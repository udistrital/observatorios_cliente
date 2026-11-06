<template>
  <section class="documento-visor">
    <header class="visor-cabecera">
      <div class="visor-identidad">
        <div class="visor-icono" aria-hidden="true">
          <v-icon size="28">{{ iconoFormato }}</v-icon>
        </div>

        <div class="visor-titulos">
          <span>Visor de documentos</span>
          <h1 :title="nombreArchivo">{{ nombreArchivo }}</h1>
        </div>

        <v-chip v-if="extension" size="small" color="primary" variant="tonal">
          {{ extension.toUpperCase() }}
        </v-chip>
      </div>

      <v-btn variant="tonal" color="primary" prepend-icon="mdi-close" @click="cerrarVisor">
        Cerrar visor
      </v-btn>
    </header>

    <main class="visor-superficie" :class="{ 'visor-superficie--hoja': esHojaCalculo }">
      <div v-if="cargando" class="visor-estado" role="status">
        <v-progress-circular indeterminate color="primary" size="52" width="5" />
        <div>
          <strong>Preparando documento</strong>
          <p>El archivo se procesa de forma local en el navegador.</p>
        </div>
      </div>

      <div v-else-if="mensajeError" class="visor-estado visor-estado--error">
        <v-icon color="error" size="54">mdi-file-alert-outline</v-icon>
        <div>
          <strong>No fue posible mostrar el documento</strong>
          <p>{{ mensajeError }}</p>
        </div>
        <v-btn color="primary" variant="flat" prepend-icon="mdi-refresh" @click="cargarDocumento">
          Reintentar
        </v-btn>
      </div>

      <iframe
        v-show="!cargando && !mensajeError && extension === 'pdf'"
        :src="urlPdf"
        class="visor-pdf"
        :title="`Vista previa de ${nombreArchivo}`"
      />

      <iframe
        v-show="!cargando && !mensajeError && esDocumentoWord"
        ref="marcoWord"
        class="visor-word"
        sandbox="allow-same-origin"
        :title="`Vista previa de ${nombreArchivo}`"
      />

      <section v-if="!cargando && !mensajeError && esHojaCalculo" class="visor-hoja">
        <div class="hoja-barra">
          <v-select
            v-model="nombreHojaActiva"
            :items="nombresHojas"
            :loading="cargandoHoja"
            :disabled="cargandoHoja"
            label="Hoja"
            density="compact"
            variant="outlined"
            hide-details
            class="selector-hoja"
            @update:model-value="seleccionarHoja"
          />

          <span class="hoja-resumen">
            {{ totalFilasHoja.toLocaleString("es-CO") }} filas ·
            {{ totalColumnasHoja.toLocaleString("es-CO") }} columnas
          </span>
        </div>

        <v-alert
          v-if="hojaTruncada"
          type="warning"
          variant="tonal"
          density="compact"
          class="hoja-alerta ma-3"
        >
          <div class="hoja-alerta-contenido">
            <span>
              Por rendimiento, la vista muestra
              {{ filasRenderizadasHoja.toLocaleString("es-CO") }} de
              {{ totalFilasHoja.toLocaleString("es-CO") }} filas y hasta
              {{ LIMITE_COLUMNAS }} columnas de esta hoja.
            </span>
            <v-btn
              v-if="puedeMostrarMasFilas"
              color="warning"
              variant="outlined"
              size="small"
              :loading="cargandoHoja"
              @click="mostrarMasFilas"
            >
              Mostrar {{ filasSiguienteCarga.toLocaleString("es-CO") }} filas mas
            </v-btn>
          </div>
        </v-alert>

        <div v-if="filasHoja.length" class="tabla-hoja-contenedor">
          <table class="tabla-hoja">
            <thead>
              <tr>
                <th class="celda-indice celda-esquina" aria-label="Numero de fila"></th>
                <th v-for="columna in columnasVisibles" :key="columna.indice">
                  {{ columna.etiqueta }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="fila in filasPagina" :key="fila.numero">
                <th class="celda-indice">{{ fila.numero }}</th>
                <td v-for="columna in columnasVisibles" :key="columna.indice">
                  {{ fila.celdas[columna.posicion] ?? "" }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="hoja-vacia">
          <v-icon size="42">mdi-table-off</v-icon>
          <p>La hoja seleccionada no contiene celdas para mostrar.</p>
        </div>

        <div v-if="totalPaginasHoja > 1" class="hoja-paginacion">
          <v-pagination
            v-model="paginaHoja"
            :length="totalPaginasHoja"
            :total-visible="5"
            density="comfortable"
          />
        </div>
      </section>
    </main>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import gestorDocumentalApi from "@/service/gestorDocumentalService";
import {
  base64ABytes,
  etiquetaColumna,
  mimePorExtension,
  obtenerExtensionDocumento,
  validarFirmaDocumento,
} from "@/utils/documentViewer";

const FILAS_POR_CARGA = 8000;
const LIMITE_COLUMNAS = 100;
const FILAS_POR_PAGINA = 100;
const LIMITE_DOCUMENTO_BYTES = 100 * 1024 * 1024;

const route = useRoute();
const router = useRouter();

const cargando = ref(true);
const mensajeError = ref("");
const nombreArchivo = ref("Documento");
const extension = ref("");
const urlPdf = ref("");
const marcoWord = ref(null);

const nombresHojas = ref([]);
const nombreHojaActiva = ref("");
const cargandoHoja = ref(false);
const filasHoja = ref([]);
const columnaInicialHoja = ref(0);
const totalFilasHoja = ref(0);
const totalColumnasHoja = ref(0);
const filasRenderizadasHoja = ref(0);
const filasSolicitadasHoja = ref(FILAS_POR_CARGA);
const columnasRenderizadas = ref(0);
const hojaTruncada = ref(false);
const paginaHoja = ref(1);

let bytesExcel = null;
let lectorExcel = null;
let utilidadesExcel = null;
let idCarga = 0;

const esDocumentoWord = computed(() => ["doc", "docx"].includes(extension.value));
const esHojaCalculo = computed(() => ["xls", "xlsx"].includes(extension.value));

const iconoFormato = computed(() => {
  return {
    pdf: "mdi-file-pdf-box",
    doc: "mdi-file-word-box",
    docx: "mdi-file-word-box",
    xls: "mdi-file-excel-box",
    xlsx: "mdi-file-excel-box",
  }[extension.value] || "mdi-file-document-outline";
});

const columnasVisibles = computed(() => {
  return Array.from({ length: columnasRenderizadas.value }, (_, posicion) => {
    const indice = columnaInicialHoja.value + posicion;

    return {
      posicion,
      indice,
      etiqueta: etiquetaColumna(indice),
    };
  });
});

const totalPaginasHoja = computed(() => {
  return Math.max(1, Math.ceil(filasHoja.value.length / FILAS_POR_PAGINA));
});

const filasPagina = computed(() => {
  const inicio = (paginaHoja.value - 1) * FILAS_POR_PAGINA;
  return filasHoja.value.slice(inicio, inicio + FILAS_POR_PAGINA);
});

const puedeMostrarMasFilas = computed(() => {
  return filasRenderizadasHoja.value < totalFilasHoja.value;
});

const filasSiguienteCarga = computed(() => {
  return Math.min(
    FILAS_POR_CARGA,
    Math.max(0, totalFilasHoja.value - filasRenderizadasHoja.value)
  );
});

const limpiarVisualizacion = () => {
  if (urlPdf.value) {
    URL.revokeObjectURL(urlPdf.value.split("#")[0]);
    urlPdf.value = "";
  }

  if (marcoWord.value) {
    marcoWord.value.srcdoc = "";
  }

  bytesExcel = null;
  lectorExcel = null;
  utilidadesExcel = null;
  nombresHojas.value = [];
  nombreHojaActiva.value = "";
  cargandoHoja.value = false;
  filasHoja.value = [];
  totalFilasHoja.value = 0;
  totalColumnasHoja.value = 0;
  filasRenderizadasHoja.value = 0;
  filasSolicitadasHoja.value = FILAS_POR_CARGA;
  columnasRenderizadas.value = 0;
  hojaTruncada.value = false;
  paginaHoja.value = 1;
};

const crearContenedorWord = async () => {
  const marco = marcoWord.value;

  if (!marco) {
    throw new Error("No se encontro el contenedor para el documento.");
  }

  const cargaMarco = new Promise((resolve) => {
    marco.addEventListener("load", resolve, { once: true });
  });

  marco.srcdoc = `<!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: blob:; font-src data: blob:; style-src 'unsafe-inline'; connect-src 'none'; media-src 'none'; frame-src 'none'; form-action 'none'; base-uri 'none'">
        <style>
          html, body { min-height: 100%; margin: 0; background: #e8edf3; color: #172033; font-family: Arial, sans-serif; }
          #documento { min-height: 100%; box-sizing: border-box; padding: 28px; }
          .msdoc-root { max-width: 920px; min-height: calc(100vh - 56px); margin: 0 auto; padding: 52px; box-sizing: border-box; background: white; box-shadow: 0 8px 28px rgba(20, 35, 60, .14); }
          @media (max-width: 700px) { #documento { padding: 10px; } .msdoc-root { padding: 24px 18px; } }
        </style>
      </head>
      <body><div id="documento"></div></body>
    </html>`;

  await cargaMarco;

  const documento = marco.contentDocument;
  const contenedor = documento?.getElementById("documento");

  if (!documento || !contenedor) {
    throw new Error("No se pudo inicializar el visor de Word.");
  }

  documento.addEventListener(
    "click",
    (event) => {
      if (event.target?.closest?.("a")) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    true
  );

  return contenedor;
};

const neutralizarRecursosExternos = (contenedor) => {
  contenedor.querySelectorAll("a").forEach((enlace) => {
    enlace.removeAttribute("href");
    enlace.removeAttribute("target");
  });

  contenedor.querySelectorAll("[src]").forEach((elemento) => {
    const origen = elemento.getAttribute("src") || "";

    if (!origen.startsWith("data:") && !origen.startsWith("blob:")) {
      elemento.removeAttribute("src");
    }
  });
};

const renderizarWord = async (bytes, formato, cargaActual) => {
  await nextTick();

  if (cargaActual !== idCarga) return;

  const contenedor = await crearContenedorWord();

  if (cargaActual !== idCarga) return;

  if (formato === "doc") {
    const { mountMsDoc, parseMsDocToHtml } = await import("@file-viewer/doc");
    const resultado = await parseMsDocToHtml(bytes, {
      parseOptions: { maxPictureBytes: 10 * 1024 * 1024 },
      renderOptions: {
        externalLinkPolicy: "block",
        externalResourcePolicy: "block",
      },
    });

    if (cargaActual !== idCarga) return;

    mountMsDoc(contenedor, resultado);
  } else {
    const { renderAsync } = await import("docx-preview");

    await renderAsync(bytes, contenedor, null, {
      breakPages: true,
      ignoreLastRenderedPageBreak: false,
      renderAltChunks: false,
      renderComments: false,
      renderChanges: false,
      useBase64URL: true,
    });
  }

  if (cargaActual !== idCarga) return;

  neutralizarRecursosExternos(contenedor);
};

const cargarHoja = async (
  nombre,
  mostrarCarga = false,
  limiteFilas = FILAS_POR_CARGA
) => {
  if (!bytesExcel || !lectorExcel || !utilidadesExcel || !nombre) return;

  if (mostrarCarga) {
    cargandoHoja.value = true;
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }

  const libro = lectorExcel.read(bytesExcel, {
    type: "array",
    sheets: nombre,
    sheetRows: limiteFilas,
    dense: true,
    cellFormula: false,
    cellHTML: false,
    cellNF: false,
    cellStyles: false,
    bookDeps: false,
    bookFiles: false,
    bookLinks: false,
    bookVBA: false,
  });
  const hoja = libro.Sheets[nombre];
  paginaHoja.value = 1;

  if (!hoja?.["!ref"]) {
    filasHoja.value = [];
    totalFilasHoja.value = 0;
    totalColumnasHoja.value = 0;
    filasRenderizadasHoja.value = 0;
    columnasRenderizadas.value = 0;
    hojaTruncada.value = false;
    cargandoHoja.value = false;
    return;
  }

  const rangoDisponible = utilidadesExcel.decode_range(hoja["!ref"]);
  const rangoOriginal = utilidadesExcel.decode_range(hoja["!fullref"] || hoja["!ref"]);
  totalFilasHoja.value = rangoOriginal.e.r - rangoOriginal.s.r + 1;
  totalColumnasHoja.value = rangoOriginal.e.c - rangoOriginal.s.c + 1;
  columnaInicialHoja.value = rangoDisponible.s.c;

  const rangoVisible = {
    s: { ...rangoDisponible.s },
    e: {
      r: Math.min(rangoDisponible.e.r, rangoDisponible.s.r + limiteFilas - 1),
      c: Math.min(rangoDisponible.e.c, rangoDisponible.s.c + LIMITE_COLUMNAS - 1),
    },
  };

  filasSolicitadasHoja.value = limiteFilas;
  filasRenderizadasHoja.value = rangoVisible.e.r - rangoVisible.s.r + 1;
  columnasRenderizadas.value = rangoVisible.e.c - rangoVisible.s.c + 1;
  hojaTruncada.value =
    puedeMostrarMasFilas.value || totalColumnasHoja.value > LIMITE_COLUMNAS;

  const filas = utilidadesExcel.sheet_to_json(hoja, {
    header: 1,
    raw: false,
    defval: "",
    blankrows: true,
    range: utilidadesExcel.encode_range(rangoVisible),
  });

  filasHoja.value = filas.map((celdas, indice) => ({
    numero: rangoVisible.s.r + indice + 1,
    celdas,
  }));
  cargandoHoja.value = false;
};

const seleccionarHoja = async (nombre) => {
  try {
    await cargarHoja(nombre, true, FILAS_POR_CARGA);
  } catch (error) {
    console.error("Error al cargar la hoja:", error);
    mensajeError.value = error?.message || "No fue posible procesar la hoja seleccionada.";
    cargandoHoja.value = false;
  }
};

const mostrarMasFilas = async () => {
  if (!puedeMostrarMasFilas.value || cargandoHoja.value) return;

  const paginaActual = paginaHoja.value;
  const nuevoLimite = filasSolicitadasHoja.value + FILAS_POR_CARGA;

  try {
    await cargarHoja(nombreHojaActiva.value, true, nuevoLimite);
    paginaHoja.value = Math.min(paginaActual, totalPaginasHoja.value);
  } catch (error) {
    console.error("Error al ampliar la hoja:", error);
    mensajeError.value = error?.message || "No fue posible mostrar mas filas de esta hoja.";
    cargandoHoja.value = false;
  }
};

const renderizarHojaCalculo = async (bytes) => {
  const [XLSX, cpexcel] = await Promise.all([
    import("xlsx"),
    import("xlsx/dist/cpexcel.full.mjs"),
  ]);

  XLSX.set_cptable(cpexcel);
  bytesExcel = bytes;
  lectorExcel = XLSX;
  utilidadesExcel = XLSX.utils;

  const libro = XLSX.read(bytes, {
    type: "array",
    bookSheets: true,
  });
  nombresHojas.value = [...libro.SheetNames];
  nombreHojaActiva.value = nombresHojas.value[0] || "";
  await cargarHoja(nombreHojaActiva.value);
};

const mensajeErrorHttp = (error) => {
  const estado = error?.response?.status;

  if (estado === 401 || estado === 403) {
    return "Su sesion no tiene autorizacion para consultar este archivo.";
  }

  if (estado === 404) {
    return "El archivo solicitado no existe o ya no esta disponible.";
  }

  return error?.message || "Ocurrio un error al consultar el archivo.";
};

const cargarDocumento = async () => {
  const cargaActual = ++idCarga;
  const hash = String(route.params.hash || "").trim();

  limpiarVisualizacion();
  cargando.value = true;
  mensajeError.value = "";
  nombreArchivo.value = "Documento";
  extension.value = "";

  try {
    if (!hash) {
      throw new Error("No se recibio un identificador de documento valido.");
    }

    const respuesta = await gestorDocumentalApi.get(`document/${encodeURIComponent(hash)}`);

    if (cargaActual !== idCarga) return;

    const contenido = respuesta?.["file:content"] || {};
    const nombre = String(contenido?.name || respuesta?.["dc:title"] || "Documento");
    const mime = String(contenido?.["mime-type"] || "").toLowerCase();
    const formato = obtenerExtensionDocumento(nombre, mime);

    if (!formato) {
      throw new Error("El formato del archivo no es compatible con este visor.");
    }

    const bytes = base64ABytes(respuesta?.file, LIMITE_DOCUMENTO_BYTES);
    validarFirmaDocumento(bytes, formato);
    nombreArchivo.value = nombre;
    extension.value = formato;

    if (formato === "pdf") {
      const blob = new Blob([bytes], { type: mimePorExtension(formato) });
      urlPdf.value = `${URL.createObjectURL(blob)}#toolbar=0&navpanes=0`;
    } else if (["doc", "docx"].includes(formato)) {
      await renderizarWord(bytes, formato, cargaActual);
    } else {
      await renderizarHojaCalculo(bytes);
    }

    if (cargaActual !== idCarga) return;
  } catch (error) {
    if (cargaActual !== idCarga) return;

    console.error("Error al visualizar documento:", error);
    mensajeError.value = mensajeErrorHttp(error);
  } finally {
    if (cargaActual === idCarga) {
      cargando.value = false;
    }
  }
};

const cerrarVisor = () => {
  window.close();

  setTimeout(() => {
    if (!window.closed) {
      router.push({ name: "procesos" });
    }
  }, 100);
};

watch(() => route.params.hash, cargarDocumento, { immediate: true });

onBeforeUnmount(() => {
  idCarga++;
  limpiarVisualizacion();
});
</script>

<style scoped>
.documento-visor {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 14px;
  height: 100%;
  min-height: 560px;
  padding: 18px clamp(12px, 2.5vw, 32px) 24px;
  box-sizing: border-box;
  color: #172033;
}

.visor-cabecera {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 14px 18px;
  border: 1px solid rgba(25, 86, 146, 0.16);
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(35, 58, 85, 0.08);
}

.visor-identidad {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 12px;
}

.visor-icono {
  display: grid;
  flex: 0 0 48px;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 12px;
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.1);
}

.visor-titulos {
  min-width: 0;
}

.visor-titulos span {
  color: #66768a;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.visor-titulos h1 {
  max-width: min(58vw, 760px);
  margin: 2px 0 0;
  overflow: hidden;
  font-size: clamp(1rem, 1.8vw, 1.35rem);
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.visor-superficie {
  position: relative;
  min-height: 0;
  overflow: hidden;
  border: 1px solid rgba(25, 86, 146, 0.16);
  border-radius: 14px;
  background: #e8edf3;
  box-shadow: 0 12px 30px rgba(35, 58, 85, 0.1);
}

.visor-superficie--hoja {
  background: #fff;
}

.visor-estado {
  display: flex;
  min-height: 100%;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 40px;
  text-align: left;
}

.visor-estado strong {
  display: block;
  margin-bottom: 5px;
  font-size: 1.1rem;
}

.visor-estado p {
  margin: 0;
  color: #59697b;
}

.visor-estado--error {
  flex-direction: column;
  text-align: center;
}

.visor-pdf,
.visor-word {
  width: 100%;
  height: 100%;
  min-height: 520px;
  border: 0;
}

.visor-hoja {
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  height: 100%;
  min-height: 520px;
}

.hoja-barra {
  grid-row: 1;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 12px 14px;
  border-bottom: 1px solid #d7dee8;
  background: #f6f8fb;
}

.hoja-alerta {
  grid-row: 2;
}

.hoja-alerta-contenido {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.hoja-alerta-contenido .v-btn {
  flex: 0 0 auto;
}

.selector-hoja {
  max-width: 320px;
}

.hoja-resumen {
  color: #66768a;
  font-size: 0.84rem;
}

.tabla-hoja-contenedor {
  grid-row: 3;
  min-height: 0;
  overflow: auto;
}

.tabla-hoja {
  min-width: 100%;
  border-spacing: 0;
  table-layout: fixed;
  font-size: 0.82rem;
}

.tabla-hoja th,
.tabla-hoja td {
  min-width: 130px;
  max-width: 280px;
  height: 34px;
  padding: 6px 9px;
  overflow: hidden;
  border-right: 1px solid #dce2ea;
  border-bottom: 1px solid #dce2ea;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tabla-hoja thead th {
  position: sticky;
  z-index: 2;
  top: 0;
  color: #43536a;
  background: #edf1f6;
  text-align: center;
}

.tabla-hoja .celda-indice {
  position: sticky;
  z-index: 1;
  left: 0;
  min-width: 56px;
  width: 56px;
  color: #5a6a7f;
  background: #edf1f6;
  text-align: center;
}

.tabla-hoja .celda-esquina {
  z-index: 3;
}

.hoja-vacia {
  grid-row: 3;
  display: grid;
  min-height: 300px;
  place-content: center;
  color: #66768a;
  text-align: center;
}

.hoja-vacia p {
  margin: 10px 0 0;
}

.hoja-paginacion {
  grid-row: 4;
  display: flex;
  justify-content: center;
  padding: 8px;
  border-top: 1px solid #d7dee8;
  background: #f6f8fb;
}

@media (max-width: 700px) {
  .documento-visor {
    min-height: 620px;
    padding: 10px;
  }

  .visor-cabecera {
    align-items: stretch;
    flex-direction: column;
  }

  .visor-titulos h1 {
    max-width: 60vw;
  }

  .hoja-barra {
    align-items: stretch;
    flex-direction: column;
    gap: 8px;
  }

  .selector-hoja {
    max-width: none;
  }

  .hoja-alerta-contenido {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
