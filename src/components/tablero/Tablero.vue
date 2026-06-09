<template>
  <section class="tablero-page">
    <article class="context-card">
      <div class="context-card__header">
        <span class="context-card__label">Tablero de evidencias</span>
        <h1>{{ nombreFactor }}</h1>
      </div>

      <div class="context-card__body">
        <div class="hierarchy-vertical">
          <div class="hierarchy-node hierarchy-node--caracteristica">
            <span class="node-label">Característica</span>
            <p>{{ nombreCaracteristica }}</p>
          </div>

          <div class="hierarchy-node hierarchy-node--aspecto">
            <span class="node-label">Aspecto</span>
            <p>{{ nombreAspecto }}</p>
          </div>
        </div>
      </div>
    </article>

    <article class="table-card">
      <div class="table-card__header">
        <div class="table-card__title">
          <span class="table-card__label">{{ etiquetaEstructura }}</span>

          <div class="table-card__title-row">
            <h2>{{ nombreEstructura }}</h2>

            <v-chip
              size="small"
              :color="colorTipoEvidencia"
              variant="tonal"
            >
              {{ tipoEvidencia }}
            </v-chip>
          </div>
        </div>

        <div class="table-card__actions">
          <v-btn
            color="primary"
            variant="tonal"
            size="small"
            class="btn-table-action"
            prepend-icon="mdi-table-column-plus-after"
            @click="crearCamposEstructura"
          >
            Agregar campos
          </v-btn>

          <v-btn
            color="primary"
            variant="tonal"
            size="small"
            class="btn-table-action"
            prepend-icon="mdi-table-edit"
            :disabled="headers.length === 0"
            @click="editarCamposEstructura"
          >
            Editar campos
          </v-btn>

          <v-btn
            v-if="esDocumental"
            color="primary"
            variant="tonal"
            size="small"
            class="btn-table-action"
            prepend-icon="mdi-file-upload"
            :disabled="camposFormulario.length === 0 || !estructuraActiva"
            @click="agregarRegistroDocumental"
          >
            Cargar documento
          </v-btn>

          <v-btn
            :color="estructuraActiva ? 'warning' : 'success'"
            variant="tonal"
            size="small"
            class="btn-table-action"
            :prepend-icon="estructuraActiva ? 'mdi-cancel' : 'mdi-sync'"
            @click="cambiarEstadoEstructura"
          >
            {{ estructuraActiva ? "Desactivar" : "Activar" }}
          </v-btn>

          <v-btn
            color="error"
            variant="tonal"
            size="small"
            class="btn-table-action"
            prepend-icon="mdi-trash-can"
            @click="eliminarEstructuraTabla"
          >
            Eliminar
          </v-btn>
          <v-btn
            color="primary"
            variant="tonal"
            size="small"
            class="btn-table-action"
            prepend-icon="mdi-plus-box"
            :disabled="camposFormulario.length === 0"
            @click="agregarRegistro"
          >
            Agregar registro
          </v-btn>
        </div>
      </div>

      <v-alert
        v-if="!estructuraSeleccionada"
        type="info"
        variant="tonal"
        class="ma-4"
      >
        No se ha seleccionado ninguna estructura.
      </v-alert>

      <v-alert
        v-else-if="headers.length === 0"
        type="info"
        variant="tonal"
        class="ma-4"
      >
        La estructura tipo tabla ya fue creada y asociada al aspecto, pero aún
        no tiene campos configurados para mostrar registros.
      </v-alert>

      <v-data-table-server
        v-else
        v-model:items-per-page="paginacion.itemsPerPage"
        :headers="headers"
        :items="datos"
        :items-length="paginacion.totalItems"
        :loading="cargando"
        density="compact"
        items-per-page-text="Elementos por página:"
        item-value="id"
        :items-per-page-options="[
          { title: '10', value: 10 },
          { title: '25', value: 25 },
          { title: '50', value: 50 },
          { title: '100', value: 100 }
        ]"
        class="tabla-registros"
        no-data-text="No se encontraron datos"
        @update:page="actualizarPagina"
        @update:items-per-page="actualizarItemsPorPagina"
        @update:sort-by="actualizarOrden"
      >
        <template #loading>
          <v-skeleton-loader type="table" />
        </template>

        <template #item.acciones="{ item }">
          <div class="acciones-tabla">
            <v-btn
              variant="tonal"
              icon
              size="x-small"
              color="primary"
              :title="esDocumental ? 'Ver documento' : 'Ver registro'"
              @click="esDocumental ? verArchivoDocumental(item) : verRegistro(item)"
            >
              <v-icon size="16">
                {{ esDocumental ? "mdi-file-eye" : "mdi-eye" }}
              </v-icon>
            </v-btn>

            <v-btn
              variant="tonal"
              icon
              size="x-small"
              color="primary"
              :title="esDocumental ? 'Editar documento' : 'Editar registro'"
              @click="esDocumental ? editarRegistroDocumental(item) : editarRegistro(item)"
            >
              <v-icon size="16">
                {{ esDocumental ? "mdi-file-document-edit" : "mdi-pencil" }}
              </v-icon>
            </v-btn>

            <v-btn
              variant="tonal"
              icon
              size="x-small"
              color="error"
              title="Eliminar registro"
              @click="eliminarRegistro(item)"
            >
              <v-icon size="16">mdi-trash-can</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table-server>

      <div class="table-card__footer">
        <v-btn
          v-if="estructuraSeleccionada && headers.length > 0"
          color="primary"
          variant="outlined"
          size="small"
          prepend-icon="mdi-broom"
          @click="limpiarEstructura"
        >
          Limpiar estructura
        </v-btn>
      </div>
    </article>

    <v-dialog
      v-model="_cargarRegistro"
      scrollable
      max-width="500px"
      max-height="70vh"
      transition="dialog-transition"
    >
      <CargarArchivo
        @cerrar="cerrarModal"
        :campos="camposFormulario"
        :idEstructura="idEstructura"
      />
    </v-dialog>

    <v-dialog
      v-model="_agregarRegistro"
      scrollable
      max-width="500px"
      max-height="70vh"
      transition="dialog-transition"
    >
      <AgregarRegistro
        @cerrar="cerrarModal"
        :campos="camposFormulario"
        :idEstructura="idEstructura"
      />
    </v-dialog>

    <v-dialog
      v-model="_gestionRegistro"
      scrollable
      max-width="500px"
      max-height="70vh"
      transition="dialog-transition"
    >
      <RegistroGestion
        @cerrar="cerrarModal"
        :esVer="_modo"
        :idEstructura="idEstructura"
        :campos="camposFormulario"
        :registro="datosRegistro"
      />
    </v-dialog>

    <v-dialog
      v-model="_agregarFilro"
      scrollable
      max-width="500px"
      max-height="70vh"
      transition="dialog-transition"
    >
      <FiltrarDatos
        @cerrar="cerrarModal"
        @filtrar="aplicarFiltro"
        :campos="camposFormulario"
        :idEstructura="idEstructura"
      />
    </v-dialog>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, reactive } from "vue";
import { useRoute } from "vue-router";
import Swal from "sweetalert2";

import peticionAPI from "@/service/conexion_api";
import { useEstructuraStore } from "@/stores/estructuraStore";

import AgregarRegistro from "./AgregarRegistro.vue";
import RegistroGestion from "./RegistroGestion.vue";
import FiltrarDatos from "./FiltrarDatos.vue";
import CargarArchivo from "./CargarArchivo.vue";

import { estructurasEvidenciasService } from "@/service/estructuras-evidencias.service";
import { aspectosService } from "@/service/aspectos.service";
import { caracteristicasService } from "@/service/caracteristicas.service";
import { factoresService } from "@/service/factores.service";
import { camposService } from "@/service/campos.service";

import gestorDocumentalApi from "@/service/gestorDocumentalService";

const route = useRoute();
const estructuraStore = useEstructuraStore();

const sortBy = ref(null);
const sortDesc = ref(false);

const estructuraSeleccionada = ref(null);
const camposFormulario = ref([]);
const idEstructura = ref("");
const datos = ref([]);
const headers = ref([]);
const _agregarRegistro = ref(false);
const _gestionRegistro = ref(false);
const _cargarRegistro = ref(false);
const _agregarFilro = ref(false);
const _filtroActivo = ref(false);
const _modo = ref(false);
const datosRegistro = ref({});
const filtros = ref({});
const camposBool = ref([]);

const cargando = ref(false);

const paginacion = reactive({
  page: 1,
  itemsPerPage: 10,
  totalItems: 0,
});

const ordering = computed(() => {
  if (sortBy.value) {
    return sortDesc.value === "asc" ? `${sortBy.value}` : `-${sortBy.value}`;
  }

  return "";
});

const estructuraIdRuta = computed(() => {
  return route.query.estructura_id || route.params.estructura_id || "";
});

const nombreFactor = computed(() => {
  return estructuraSeleccionada.value?.factor?.nombre || "Factor";
});

const nombreCaracteristica = computed(() => {
  return estructuraSeleccionada.value?.caracteristica?.nombre || "Característica";
});

const nombreAspecto = computed(() => {
  return estructuraSeleccionada.value?.aspecto?.nombre || "Aspecto";
});

const nombreEstructura = computed(() => {
  return estructuraSeleccionada.value?.nombre || "Estructura tabla";
});

const tipoEvidencia = computed(() => {
  return estructuraSeleccionada.value?.tipo_evidencia || "Tabla";
});

const estructuraActiva = computed(() => {
  return estructuraSeleccionada.value?.activo !== false;
});

const esTabla = computed(() => {
  return tipoEvidencia.value === "Tabla";
});

const esDocumental = computed(() => {
  return tipoEvidencia.value === "Documental";
});

const etiquetaEstructura = computed(() => {
  return esDocumental.value ? "Estructura documental" : "Estructura tabla";
});

const colorTipoEvidencia = computed(() => {
  return esDocumental.value ? "primary" : "success";
});

const mostrarCargandoTablero = (
  titulo = "Cargando tablero",
  texto = "Consultando la información asociada…"
) => {
  Swal.fire({
    title: titulo,
    text: texto,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

const cerrarCargandoTablero = () => {
  Swal.close();
};

const cargarContextoDesdeIdTabla = async () => {
  const estructuraId = estructuraIdRuta.value;

  if (!estructuraId) {
    return null;
  }

  const estructuraResponse = await estructurasEvidenciasService.obtener(estructuraId);

  const aspectoId = estructuraResponse.aspecto_id;

  if (!aspectoId) {
    throw new Error("No fue posible identificar el aspecto asociado a la estructura.");
  }

  const aspecto = await aspectosService.obtener(aspectoId);

  const caracteristicaId = aspecto.caracteristica_id;

  if (!caracteristicaId) {
    throw new Error("No fue posible identificar la característica asociada al aspecto.");
  }

  const caracteristica = await caracteristicasService.obtener(caracteristicaId);

  const factorIdConsulta =
    caracteristica.factor_id ||
    route.params.factor_id;

  let factor = null;

  if (factorIdConsulta) {
    factor = await factoresService.obtener(factorIdConsulta);
  }

  return {
    id: estructuraResponse.id,
    aspecto_id: estructuraResponse.aspecto_id,
    nombre: estructuraResponse.nombre,
    tipo_evidencia: estructuraResponse.tipo_evidencia,
    activo: estructuraResponse.activo !== false,
    campos: Array.isArray(estructuraResponse.campos)
      ? estructuraResponse.campos
      : [],
    data: Array.isArray(estructuraResponse.data)
      ? estructuraResponse.data
      : [],

    factor: {
      id: factor?.id || factorIdConsulta || route.params.factor_id,
      nombre: factor?.nombre || "Factor",
      descripcion: factor?.descripcion || "",
      calificacion: factor?.calificacion || "",
    },

    caracteristica: {
      id: caracteristica.id || caracteristicaId,
      nombre: caracteristica.nombre || "Característica",
      descripcion: caracteristica.descripcion || "",
      calificacion: caracteristica.calificacion || "",
    },

    aspecto: {
      id: aspecto.id || aspectoId,
      nombre: aspecto.nombre || "Aspecto",
      activo: aspecto.activo !== false,
    },
  };
};

const obtenerCampos = (estructura) => {
  if (!Array.isArray(estructura?.campos)) {
    return [];
  }

  return estructura.campos;
};

const normalizarCampos = (campos = []) => {
  if (!Array.isArray(campos)) {
    return [];
  }

  return campos
    .filter((campo) => campo?.nombre_campo)
    .map((campo, index) => ({
      campo_id: campo.campo_id || null,
      orden: Number(campo.orden || index + 1),
      nombre_campo: campo.nombre_campo.trim(),
      tipo_campo: campo.tipo_campo || "text",
      activo: campo.activo !== false,
      migrar_data: campo.migrar_data === true,
    }));
};

const base64ToBlob = (base64, type = "application/pdf") => {
  const bytes = atob(base64);
  const array = new Uint8Array(bytes.length);

  for (let i = 0; i < bytes.length; i++) {
    array[i] = bytes.charCodeAt(i);
  }

  return new Blob([array], { type });
};

const verArchivoDocumental = async (item) => {
  const hash =
    item?.raw?.hash ||
    item?.raw?.Hash ||
    item?.raw?.enlace ||
    item?.raw?.Enlace;

  if (!hash) {
    await Swal.fire({
      title: "Sin archivo",
      text: "Este registro no tiene hash de documento asociado.",
      icon: "info",
      width: "340px",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
      },
      buttonsStyling: false,
    });

    return;
  }

  mostrarCargandoTablero(
    "Abriendo documento",
    "Consultando archivo en Gestor Documental…"
  );

  try {
    const response = await gestorDocumentalApi.get(`document/${hash}`);
    const base64 = response?.file;

    if (!base64) {
      throw new Error("No se encontró el base64 del archivo.");
    }

    const blob = base64ToBlob(base64, "application/pdf");
    const url = URL.createObjectURL(blob);

    cerrarCargandoTablero();

    window.open(url, "_blank");

    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } catch (error) {
    console.error("Error al abrir documento:", error);

    cerrarCargandoTablero();

    await Swal.fire({
      title: "Error",
      text: "No se pudo abrir el documento.",
      icon: "error",
      width: "340px",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
      },
      buttonsStyling: false,
    });
  }
};

const esCampoHash = (campo) => {
  return campo?.nombre_campo === "hash";
};

const tieneCampoHash = (campos = []) => {
  return campos.some((campo) => esCampoHash(campo));
};

const asegurarCampoHashDocumental = (campos = []) => {
  const camposNormalizados = normalizarCampos(campos);

  if (!esDocumental.value) {
    return camposNormalizados;
  }

  const campoHashExistente = camposNormalizados.find((campo) => {
    return campo.nombre_campo === "hash";
  });

  const camposSinHash = camposNormalizados.filter((campo) => {
    return campo.nombre_campo !== "hash";
  });

  return [
    ...camposSinHash,
    campoHashExistente || {
      campo_id: null,
      orden: camposSinHash.length + 1,
      nombre_campo: "hash",
      tipo_campo: "text",
      activo: true,
      migrar_data: false,
    },
  ];
};

const traerDatos = async (estructura = null) => {
  let estructuraActiva = estructura || estructuraSeleccionada.value;

  if (!estructuraActiva) {
    estructuraActiva = estructuraStore.estructura;
  }

  if (!estructuraActiva) return;

  estructuraSeleccionada.value = estructuraActiva;
  estructuraStore.setEstructura(estructuraActiva);

  const campos = obtenerCampos(estructuraActiva)
    .filter((campo) => campo.activo !== false)
    .sort((a, b) => Number(a.orden || 999999) - Number(b.orden || 999999));

  camposFormulario.value = campos;
  idEstructura.value = estructuraActiva.id;

  headers.value = campos.map((campo) => ({
    title: campo.nombre_campo,
    key: campo.nombre_campo,
    value: campo.nombre_campo,
    align: "center",
    sortable: true,
  }));

  if (headers.value.length > 0) {
    headers.value.push({
      title: "Acciones",
      key: "acciones",
      value: "acciones",
      align: "center",
      sortable: false,
    });
  }

  if (headers.value.length === 0) {
    datos.value = [];
    paginacion.totalItems = 0;
    return;
  }

  cargando.value = true;
  datos.value = [];

  try {
    const response = await camposService.listarData(
      estructuraActiva.id,
      {
        page: paginacion.page,
        page_size: paginacion.itemsPerPage,
        ordering: ordering.value,
        ...filtros.value,
      }
    );

    datos.value = Array.isArray(response.results)
      ? response.results
      : [];

    paginacion.totalItems = Number(response.count) || 0;

    await nextTick();
  } catch (error) {
    console.error("Error al cargar datos:", error);

    Swal.fire({
      title: "Error",
      text: "No fue posible cargar los datos de la estructura.",
      icon: "error",
      width: "320px",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
      },
      buttonsStyling: false,
    });
  } finally {
    cargando.value = false;
  }
};

const actualizarPagina = (nuevaPagina) => {
  paginacion.page = nuevaPagina;
  traerDatos();
};

const actualizarItemsPorPagina = (nuevoTamaño) => {
  paginacion.itemsPerPage = nuevoTamaño;
  paginacion.page = 1;
  traerDatos();
};

const actualizarOrden = (payload) => {
  if (payload.length > 0) {
    sortBy.value = payload[0].key;
    sortDesc.value = payload[0].order;
  }

  traerDatos();
};

const aplicarFiltro = (data) => {
  paginacion.page = 1;

  filtros.value = Object.fromEntries(
    Object.entries(data).filter(
      ([, value]) => value !== null && value !== undefined && value !== ""
    )
  );

  traerDatos();

  _filtroActivo.value = true;
  _agregarFilro.value = false;
};

const limpiarFiltro = () => {
  filtros.value = {};
  traerDatos();
  _filtroActivo.value = false;
};

const verEstructura = async () => {
  await Swal.fire({
    title: nombreEstructura.value,
    html: `
      <div style="text-align:left">
        <p><b>ID / índice:</b></p>
        <p style="word-break:break-word">${idEstructura.value || "Sin ID"}</p>

        <p><b>Tipo de evidencia:</b></p>
        <p>${tipoEvidencia.value}</p>

        <p><b>Factor:</b></p>
        <p>${nombreFactor.value}</p>

        <p><b>Característica:</b></p>
        <p>${nombreCaracteristica.value}</p>

        <p><b>Aspecto:</b></p>
        <p>${nombreAspecto.value}</p>
      </div>
    `,
    icon: "info",
    width: "520px",
    customClass: {
      popup: "popup-personalizado",
      title: "titulo-alerta-personalizado",
      confirmButton: "confirmacion-alerta-personalizado",
    },
    buttonsStyling: false,
  });
};

const copiarIdEstructura = async () => {
  if (!idEstructura.value) {
    await Swal.fire({
      title: "Sin ID",
      text: "No hay un ID de estructura para copiar.",
      icon: "info",
      width: "320px",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
      },
      buttonsStyling: false,
    });

    return;
  }

  try {
    await navigator.clipboard.writeText(idEstructura.value);

    await Swal.fire({
      title: "Copiado",
      text: "El ID de la estructura fue copiado al portapapeles.",
      icon: "success",
      width: "320px",
      timer: 1600,
      showConfirmButton: false,
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
      },
      buttonsStyling: false,
    });
  } catch (error) {
    console.error("No fue posible copiar el ID:", error);

    await Swal.fire({
      title: "ID de la estructura",
      html: `<p style="word-break:break-word">${idEstructura.value}</p>`,
      icon: "info",
      width: "420px",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
      },
      buttonsStyling: false,
    });
  }
};

const limpiarEstructura = async () => {
  const resultado = await Swal.fire({
    title: "Limpiar registros",
    html: `¿Desea eliminar todos los registros de <b>${nombreEstructura.value}</b>?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar",
    width: "350px",
    customClass: {
      popup: "popup-personalizado",
      title: "titulo-alerta-personalizado",
      confirmButton: "confirmacion-alerta-personalizado",
      cancelButton: "cancelacion-alerta-personalizado",
    },
    buttonsStyling: false,
  });

  if (!resultado.isConfirmed) return;

  try {
    await camposService.eliminarTodosRegistros(idEstructura.value);

    await Swal.fire({
      title: "¡Eliminado!",
      text: "Los registros fueron eliminados correctamente.",
      icon: "success",
      width: "300px",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
      },
      buttonsStyling: false,
    });

    traerDatos();
  } catch (error) {
    console.error(error);
  }
};

const eliminarRegistro = async (item) => {
  const id = item.raw.id;

  const resultado = await Swal.fire({
    title: "Eliminar registro",
    html: "¿Desea eliminar el registro?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar",
    width: "350px",
    customClass: {
      popup: "popup-personalizado",
      title: "titulo-alerta-personalizado",
      confirmButton: "confirmacion-alerta-personalizado",
      cancelButton: "cancelacion-alerta-personalizado",
    },
    buttonsStyling: false,
  });

  if (!resultado.isConfirmed) return;

  try {
    await camposService.eliminarRegistro(
      idEstructura.value,
      id
    );

    await Swal.fire({
      title: "¡Eliminado!",
      text: "El registro fue eliminado correctamente.",
      icon: "success",
      width: "300px",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
      },
      buttonsStyling: false,
    });

    traerDatos();
  } catch (error) {
    console.error(error);
  }
};

const agregarRegistro = () => {
  _agregarRegistro.value = true;
};

const cargarArchivos = () => {
  _cargarRegistro.value = true;
};

const verRegistro = (item) => {
  _gestionRegistro.value = true;
  _modo.value = true;
  datosRegistro.value = item.raw;
};

const editarRegistro = (item) => {
  _gestionRegistro.value = true;
  _modo.value = false;
  datosRegistro.value = item.raw;
};

const cerrarModal = () => {
  setTimeout(() => {
    traerDatos();
  }, 1000);

  _gestionRegistro.value = false;
  _agregarRegistro.value = false;
  _agregarFilro.value = false;
  _cargarRegistro.value = false;
};

const agregarFiltro = () => {
  _agregarFilro.value = true;
};

const TIPOS_DATO = [
  { label: "Texto", value: "text" },
  { label: "Archivo PDF", value: "file" },
  { label: "Palabra clave", value: "keyword" },
  { label: "Largo", value: "long" },
  { label: "Entero", value: "integer" },
  { label: "Corto", value: "short" },
  { label: "Byte", value: "byte" },
  { label: "Doble", value: "double" },
  { label: "Flotante", value: "float" },
  { label: "Medio flotante", value: "half_float" },
  { label: "Flotante escalado", value: "scaled_float" },
  { label: "Booleano", value: "boolean" },
  { label: "Fecha", value: "date" },
  { label: "Fecha con nanosegundos", value: "date_nanos" },
  { label: "Punto geográfico", value: "geo_point" },
  { label: "Forma geográfica", value: "geo_shape" },
  { label: "Dirección IP", value: "ip" },
  { label: "Binario", value: "binary" },
  { label: "Objeto", value: "object" },
  { label: "Anidado", value: "nested" },
  { label: "Conteo de tokens", value: "token_count" },
  { label: "Rango de enteros", value: "integer_range" },
  { label: "Rango de flotantes", value: "float_range" },
  { label: "Rango de largos", value: "long_range" },
  { label: "Rango de dobles", value: "double_range" },
  { label: "Rango de fechas", value: "date_range" },
  { label: "Rango de IPs", value: "ip_range" },
  { label: "Palabra clave constante", value: "constant_keyword" },
  { label: "Aplanado", value: "flattened" },
  { label: "Forma", value: "shape" },
];

const escaparHtml = (valor = "") => {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

const construirOpcionesTipoDato = (tipoSeleccionado = "text") => {
  return TIPOS_DATO
    .map((tipo) => {
      const selected = tipo.value === tipoSeleccionado ? "selected" : "";

      return `
        <option value="${tipo.value}" ${selected}>
          ${tipo.label} (${tipo.value})
        </option>
      `;
    })
    .join("");
};

const construirFilaCampo = (campo = {}, index = 0, esExistente = false) => {
  const campoId = escaparHtml(campo.campo_id || "");
  const orden = Number(campo.orden || index + 1);
  const nombre = escaparHtml(campo.nombre_campo || "");
  const tipo = campo.tipo_campo || "text";
  const activo = campo.activo !== false;

  return `
    <div
      class="campo-row"
      data-index="${index}"
      data-campo-id="${campoId}"
      data-orden="${orden}"
      data-tipo-original="${tipo}"
      data-original="${nombre}"
      data-activo="${activo ? "true" : "false"}"
      data-existente="${esExistente ? "true" : "false"}"
      style="${activo ? "" : "opacity:0.45"}"
    >
      <div class="campo-field">
        <input
          class="campo-input campo-nombre"
          placeholder="Nombre del campo"
          value="${nombre}"
        />
      </div>

      <div class="campo-field campo-select-wrapper">
        <label>Tipo de dato</label>
        <select class="campo-input campo-tipo">
          ${construirOpcionesTipoDato(tipo)}
        </select>
      </div>

      <button
        type="button"
        class="campo-disable"
        title="Quita el campo de la vista, pero conserva la data histórica"
      >
        ${activo ? "Desactivar" : "Activar"}
      </button>

      <button
        type="button"
        class="campo-delete"
        title="Quita el campo y borra esa columna en la data"
      >
        Eliminar
      </button>
    </div>
  `;
};

const abrirFormularioCampos = async (camposIniciales = [], opciones = {} ) => {
  const camposBase = normalizarCampos(camposIniciales);

  const camposRender = [...camposBase];

  if (opciones.agregarFilaVacia || camposRender.length === 0) {
    camposRender.push({
      nombre_campo: "",
      tipo_campo: "text",
    });
  }

  const eliminadosData = [];

  return Swal.fire({
    title: "Campos de la estructura",
    html: `
      <div class="campos-popup">
        <p class="campos-popup__help">
          Agrega o administra los campos que tendrá la estructura.
          <br>
          <b>Desactivar</b> quita el campo de la tabla, pero conserva la data histórica.
          <br>
          <b>Eliminar</b> quita el campo y borra esa columna en todos los registros.
        </p>

        <div id="camposContainer" class="campos-container">
          ${camposRender
            .map((campo, index) =>
              construirFilaCampo(campo, index, Boolean(campo.nombre_campo))
            )
            .join("")}
        </div>

        <button
          id="btnAgregarCampo"
          type="button"
          class="btn-agregar-campo"
        >
          + Agregar campo
        </button>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Guardar",
    cancelButtonText: "Cancelar",
    width: "860px",
    customClass: {
      popup: "popup-personalizado popup-campos",
      title: "titulo-alerta-personalizado",
      confirmButton: "confirmacion-alerta-personalizado",
      cancelButton: "cancelacion-alerta-personalizado",
    },
    buttonsStyling: false,
    didOpen: () => {
      const container = document.getElementById("camposContainer");
      const btnAgregar = document.getElementById("btnAgregarCampo");

      const enlazarEventos = () => {
        const botonesDesactivar = container.querySelectorAll(".campo-disable");
        const botonesEliminar = container.querySelectorAll(".campo-delete");

        botonesDesactivar.forEach((boton) => {
          boton.onclick = () => {
            const fila = boton.closest(".campo-row");
            const estaActivo = fila.dataset.activo !== "false";

            fila.dataset.activo = estaActivo ? "false" : "true";
            fila.style.opacity = estaActivo ? "0.45" : "1";
            boton.textContent = estaActivo ? "Activar" : "Desactivar";
          };
        });

        botonesEliminar.forEach((boton) => {
          boton.onclick = () => {
            const fila = boton.closest(".campo-row");
            const campoId = fila.dataset.campoId;
            const nombreOriginal = fila.dataset.original;

            if (campoId) {
              eliminadosData.push(campoId);
            } else if (nombreOriginal) {
              eliminadosData.push(nombreOriginal);
            }

            fila.remove();
          };
        });
      };

      btnAgregar.onclick = () => {
        const total = container.querySelectorAll(".campo-row").length;

        container.insertAdjacentHTML(
          "beforeend",
          construirFilaCampo(
            { nombre_campo: "", tipo_campo: "text" },
            total,
            false
          )
        );

        enlazarEventos();
      };

      enlazarEventos();
    },
    preConfirm: () => {
      const filas = Array.from(document.querySelectorAll(".campo-row"));

      const campos = filas.map((fila, index) => {
        const nombreCampo = fila.querySelector(".campo-nombre")?.value?.trim();
        const tipoCampo = fila.querySelector(".campo-tipo")?.value || "text";
        const tipoOriginal = fila.dataset.tipoOriginal || tipoCampo;

        return {
          campo_id: fila.dataset.campoId || null,
          orden: Number(fila.dataset.orden || index + 1),
          nombre_campo: nombreCampo,
          tipo_campo: tipoCampo,
          activo: fila.dataset.activo !== "false",
          migrar_data: tipoOriginal !== tipoCampo ? false : false,
        };
      });

      const camposValidos = campos.filter((campo) => campo.nombre_campo);

      if (camposValidos.length === 0) {
        Swal.showValidationMessage("Debe registrar al menos un campo.");
        return false;
      }

      const regexNombre = /^[A-Za-z_][A-Za-z0-9_]*$/;

      const campoInvalido = camposValidos.find(
        (campo) => !regexNombre.test(campo.nombre_campo)
      );

      if (campoInvalido) {
        Swal.showValidationMessage(
          `El campo '${campoInvalido.nombre_campo}' no es válido. ` +
          "Use letras, números y guion bajo. Debe iniciar con letra o guion bajo."
        );

        return false;
      }

      const nombres = camposValidos.map((campo) =>
        campo.nombre_campo.toLowerCase()
      );

      const nombresUnicos = new Set(nombres);

      if (nombres.length !== nombresUnicos.size) {
        Swal.showValidationMessage("No puede haber campos repetidos.");
        return false;
      }

      return {
        campos: camposValidos,
        eliminar_data_campos: [...new Set(eliminadosData)],
      };
    },
  });
};

const actualizarCamposEstructura = async ({
  campos = [],
  eliminarDataCampos = [],
} = {}) => {
  if (!idEstructura.value) {
    throw new Error("No hay una estructura seleccionada.");
  }

  const camposPreparados = asegurarCampoHashDocumental(campos);

  const estructuraActualizada = await camposService.actualizarCampos(
    idEstructura.value,
    camposPreparados,
    eliminarDataCampos
  );

  estructuraSeleccionada.value = {
    ...estructuraSeleccionada.value,
    ...estructuraActualizada,
    campos: normalizarCampos(estructuraActualizada.campos || []),
    data: Array.isArray(estructuraActualizada.data)
      ? estructuraActualizada.data
      : [],
  };

  estructuraStore.setEstructura(estructuraSeleccionada.value);

  await traerDatos(estructuraSeleccionada.value);
};

const sincronizarCampoHashDocumental = async (estructura) => {
  if (estructura?.tipo_evidencia !== "Documental") {
    return estructura;
  }

  const camposActuales = normalizarCampos(estructura.campos || []);

  if (tieneCampoHash(camposActuales)) {
    return estructura;
  }

  const camposConHash = asegurarCampoHashDocumental(camposActuales);

  const estructuraActualizada = await camposService.actualizarCampos(
    estructura.id,
    camposConHash,
    []
  );

  return {
    ...estructura,
    ...estructuraActualizada,
    campos: normalizarCampos(estructuraActualizada.campos || camposConHash),
  };
};

const crearCamposEstructura = async () => {
  const resultado = await abrirFormularioCampos(
    camposFormulario.value,
    {
      agregarFilaVacia: true,
    }
  );

  if (!resultado.isConfirmed) return;

  mostrarCargandoTablero(
    "Creando campos",
    "Guardando los campos de la estructura…"
  );

  try {
    await actualizarCamposEstructura({
      campos: resultado.value.campos,
    });

    cerrarCargandoTablero();

    await Swal.fire({
      title: "¡Campos creados!",
      text: "Los campos fueron creados correctamente.",
      icon: "success",
      width: "320px",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
      },
      buttonsStyling: false,
    });
  } catch (error) {
    cerrarCargandoTablero();

    await Swal.fire({
      title: "Error",
      text: "No fue posible crear los campos.",
      icon: "error",
      width: "340px",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
      },
      buttonsStyling: false,
    });
  }
};

const editarCamposEstructura = async () => {
  const resultado = await abrirFormularioCampos(camposFormulario.value);

  if (!resultado.isConfirmed) return;

  mostrarCargandoTablero(
    "Editando campos",
    "Actualizando los campos de la estructura…"
  );

  try {
    await actualizarCamposEstructura({
      campos: resultado.value.campos,
      eliminarDataCampos: resultado.value.eliminar_data_campos,
    });

    cerrarCargandoTablero();

    await Swal.fire({
      title: "¡Campos actualizados!",
      text: "Los campos fueron actualizados correctamente.",
      icon: "success",
      width: "320px",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
      },
      buttonsStyling: false,
    });
  } catch (error) {
    cerrarCargandoTablero();

    await Swal.fire({
      title: "Error",
      text: "No fue posible editar los campos.",
      icon: "error",
      width: "340px",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
      },
      buttonsStyling: false,
    });
  }
};

const actualizarMetadataEstructura = async (data = {}) => {
  if (!idEstructura.value) {
    throw new Error("No hay una estructura seleccionada.");
  }

  const payload = {
    aspecto_id: estructuraSeleccionada.value?.aspecto?.id,
    tipo_evidencia: tipoEvidencia.value,
    nombre: nombreEstructura.value,
    activo: estructuraActiva.value,
    mapeo: normalizarCampos(camposFormulario.value),
    ...data,
  };

  const response = await estructurasEvidenciasService.actualizar(
    idEstructura.value,
    payload
  );

  const estructurasActualizadas = response.estructuras_evidencias || [];

  const estructuraActualizada =
    estructurasActualizadas.find((item) => item.id === idEstructura.value) ||
    {
      id: idEstructura.value,
      tipo_evidencia: payload.tipo_evidencia,
      nombre: payload.nombre,
      activo: payload.activo,
      mapeo: payload.mapeo,
    };

  estructuraSeleccionada.value = {
    ...estructuraSeleccionada.value,
    ...estructuraActualizada,
    tipo_evidencia:
      estructuraActualizada.tipo_evidencia ||
      estructuraSeleccionada.value?.tipo_evidencia ||
      "Tabla",
    mapeo: normalizarCampos(estructuraActualizada.mapeo || payload.mapeo),
  };

  estructuraStore.setEstructura(estructuraSeleccionada.value);

  await traerDatos(estructuraSeleccionada.value);
};


const convertirArchivoBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const resultado = String(reader.result || "");
      resolve(resultado.split(",")[1]);
    };

    reader.onerror = () => {
      reject(new Error("No fue posible leer el archivo."));
    };

    reader.readAsDataURL(file);
  });
};

const extraerHashGestorDocumental = (response) => {
  return (
    response?.res?.Enlace ||
    response?.res?.enlace ||
    response?.Enlace ||
    response?.enlace ||
    response?.hash ||
    response?.id ||
    response?.Id ||
    response?.data?.hash ||
    response?.data?.id
  );
};

const construirMetadatosGestor = (metadatos = {}) => {
  const { hash, Hash, enlace, Enlace, ...metadatosSinHash } = metadatos;

  return {
    ...metadatosSinHash,
    estructura_id: idEstructura.value,
    estructura_nombre: nombreEstructura.value,
    tipo_evidencia: tipoEvidencia.value,
    factor: nombreFactor.value,
    caracteristica: nombreCaracteristica.value,
    aspecto: nombreAspecto.value,
  };
};

const subirArchivoGestorDocumental = async ({
  file,
  fileBase64,
  metadatos = {},
}) => {
  const payload = [
    {
      IdTipoDocumento: 192,
      nombre: file.name,
      metadatos: construirMetadatosGestor(metadatos),
      descripcion: "Archivo cargado desde Atlas",
      file: fileBase64,
    },
  ];

  const response = await gestorDocumentalApi.post(
    "document/uploadAnyFormat",
    payload
  );

  const status = response?.Status || response?.status;

  if (status && String(status) !== "200") {
    throw new Error(
      response?.message ||
        response?.error ||
        "El Gestor Documental no pudo guardar el archivo."
    );
  }

  const hash = extraerHashGestorDocumental(response);

  if (!hash) {
    throw new Error(
      "El Gestor Documental guardó la solicitud, pero no retornó el Enlace/hash del documento."
    );
  }

  return hash;
};

const eliminarArchivoGestorDocumental = async (hash) => {
  if (!hash) return;

  await gestorDocumentalApi.delete(`document/${hash}`);
};

const construirInputDocumento = (campo, registro = {}) => {
  const nombre = campo.nombre_campo;
  const tipo = campo.tipo_campo;
  const valor = escaparHtml(registro?.[nombre] ?? "");

  if (nombre === "hash") {
    return `
      <label class="documento-label">${nombre}</label>
      <input
        id="documento_${nombre}"
        class="documento-input"
        value="${valor || "Se llenará automáticamente al cargar el documento"}"
        disabled
      />
    `;
  }

  if (tipo === "boolean") {
    const seleccionadoTrue = String(valor) === "true" ? "selected" : "";
    const seleccionadoFalse = String(valor) === "false" ? "selected" : "";

    return `
      <label class="documento-label">${nombre}</label>
      <select id="documento_${nombre}" class="documento-input">
        <option value="">Seleccione</option>
        <option value="true" ${seleccionadoTrue}>Sí</option>
        <option value="false" ${seleccionadoFalse}>No</option>
      </select>
    `;
  }

  if (tipo === "date" || tipo === "date_nanos") {
    return `
      <label class="documento-label">${nombre}</label>
      <input
        id="documento_${nombre}"
        type="date"
        class="documento-input"
        value="${valor}"
      />
    `;
  }

  if (
    ["integer", "long", "short", "byte", "double", "float", "half_float", "scaled_float"].includes(tipo)
  ) {
    return `
      <label class="documento-label">${nombre}</label>
      <input
        id="documento_${nombre}"
        type="number"
        class="documento-input"
        placeholder="${nombre}"
        value="${valor}"
      />
    `;
  }

  return `
    <label class="documento-label">${nombre}</label>
    <input
      id="documento_${nombre}"
      class="documento-input"
      placeholder="${nombre}"
      value="${valor}"
    />
  `;
};

const obtenerIdRegistro = (item) => {
  return (
    item?.raw?.id ||
    item?.raw?._id ||
    item?.id ||
    item?._id
  );
};

const obtenerHashRegistro = (registro = {}) => {
  return (
    registro?.hash ||
    registro?.Hash ||
    registro?.enlace ||
    registro?.Enlace ||
    ""
  );
};

const editarRegistroDocumental = async (item) => {
  const registroActual = item?.raw || item;
  const idRegistro = obtenerIdRegistro(item);
  const hashAnterior = obtenerHashRegistro(registroActual);

  if (!idRegistro) {
    await Swal.fire({
      title: "Registro sin ID",
      text: "No fue posible identificar el registro que se desea editar.",
      icon: "error",
      width: "340px",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
      },
      buttonsStyling: false,
    });

    return;
  }

  const resultado = await abrirFormularioDocumento(registroActual, {
    modo: "editar",
    archivoRequerido: false,
  });

  if (!resultado.isConfirmed) return;

  mostrarCargandoTablero(
    "Editando documento",
    "Actualizando la información del documento…"
  );

  let hashNuevo = hashAnterior;
  let archivoCambiado = false;

  try {
    if (resultado.value.archivoNuevo) {
      const fileBase64 = await convertirArchivoBase64(resultado.value.file);

      hashNuevo = await subirArchivoGestorDocumental({
        file: resultado.value.file,
        fileBase64,
        metadatos: resultado.value.datosFormulario,
      });

      archivoCambiado = true;
    }

    const datosActualizados = {
      ...resultado.value.datosFormulario,
      hash: hashNuevo,
    };

    await camposService.actualizarRegistro(
      idEstructura.value,
      idRegistro,
      datosActualizados
    );

    let errorEliminandoAnterior = null;

    if (archivoCambiado && hashAnterior && hashAnterior !== hashNuevo) {
      try {
        await eliminarArchivoGestorDocumental(hashAnterior);
      } catch (error) {
        errorEliminandoAnterior = error;
        console.warn(
          "El registro fue actualizado, pero no fue posible eliminar el documento anterior:",
          error
        );
      }
    }

    cerrarCargandoTablero();

    if (errorEliminandoAnterior) {
      await Swal.fire({
        title: "Actualizado con advertencia",
        text: "El registro fue actualizado, pero no fue posible eliminar el documento anterior del Gestor Documental.",
        icon: "warning",
        width: "420px",
        customClass: {
          popup: "popup-personalizado",
          title: "titulo-alerta-personalizado",
          confirmButton: "confirmacion-alerta-personalizado",
        },
        buttonsStyling: false,
      });
    } else {
      await Swal.fire({
        title: "¡Documento actualizado!",
        text: archivoCambiado
          ? "El documento fue reemplazado y la información fue actualizada correctamente."
          : "La información del documento fue actualizada correctamente.",
        icon: "success",
        width: "390px",
        customClass: {
          popup: "popup-personalizado",
          title: "titulo-alerta-personalizado",
          confirmButton: "confirmacion-alerta-personalizado",
        },
        buttonsStyling: false,
      });
    }

    await traerDatos(estructuraSeleccionada.value);
  } catch (error) {
    console.error("Error al editar documento:", error);

    if (archivoCambiado && hashNuevo && hashNuevo !== hashAnterior) {
      try {
        await eliminarArchivoGestorDocumental(hashNuevo);
      } catch (rollbackError) {
        console.warn(
          "No fue posible eliminar el documento nuevo después del error:",
          rollbackError
        );
      }
    }

    cerrarCargandoTablero();

    await Swal.fire({
      title: "Error",
      text:
        error?.response?.data?.message ||
        error?.message ||
        "No fue posible actualizar el documento.",
      icon: "error",
      width: "390px",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
      },
      buttonsStyling: false,
    });
  }
};

const abrirFormularioDocumento = async (
  registro = {},
  opciones = {
    modo: "crear",
    archivoRequerido: true,
  }
) => {
  const campos = normalizarCampos(camposFormulario.value);
  const esEdicion = opciones.modo === "editar";

  const camposHtml = campos
    .map((campo) => construirInputDocumento(campo, registro))
    .join("");

  return Swal.fire({
    title: esEdicion ? "Editar documento" : "Cargar documento",
    html: `
      <div class="documento-popup">
        <p class="documento-help">
          ${
            esEdicion
              ? "Actualice los campos del documento. Seleccione un nuevo PDF solo si desea reemplazar el archivo actual."
              : "Seleccione el archivo PDF y complete los campos de la estructura."
          }
          <br>
          El campo <b>hash</b> se actualiza automáticamente con el identificador retornado por el Gestor Documental.
        </p>

        <label class="documento-label">
          ${esEdicion ? "Nuevo archivo PDF opcional" : "Archivo PDF"}
        </label>
        <input
          id="documentoArchivo"
          type="file"
          accept=".pdf,application/pdf"
          class="documento-file"
        />

        <div class="documento-fields">
          ${camposHtml}
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Guardar",
    cancelButtonText: "Cancelar",
    width: "620px",
    customClass: {
      popup: "popup-personalizado popup-documento",
      title: "titulo-alerta-personalizado",
      confirmButton: "confirmacion-alerta-personalizado",
      cancelButton: "cancelacion-alerta-personalizado",
    },
    buttonsStyling: false,
    preConfirm: () => {
      const file = document.getElementById("documentoArchivo")?.files?.[0];

      if (opciones.archivoRequerido && !file) {
        Swal.showValidationMessage("Debe seleccionar un archivo PDF.");
        return false;
      }

      if (file) {
        const esPdf =
          file.type === "application/pdf" ||
          file.name.toLowerCase().endsWith(".pdf");

        if (!esPdf) {
          Swal.showValidationMessage("Solo se permiten archivos PDF.");
          return false;
        }
      }

      const datosFormulario = {};

      campos.forEach((campo) => {
        const nombre = campo.nombre_campo;
        const input = document.getElementById(`documento_${nombre}`);

        if (nombre === "hash") {
          datosFormulario[nombre] = registro?.hash || registro?.Hash || "";
          return;
        }

        datosFormulario[nombre] = input?.value ?? "";
      });

      return {
        file,
        datosFormulario,
        archivoNuevo: Boolean(file),
      };
    },
  });
};

const agregarRegistroDocumental = async () => {
  if (!esDocumental.value) return;

  if (!tieneCampoHash(camposFormulario.value)) {
    await Swal.fire({
      title: "Campo hash requerido",
      text: "La estructura documental debe tener el campo hash antes de cargar documentos.",
      icon: "info",
      width: "390px",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
      },
      buttonsStyling: false,
    });

    return;
  }

  const resultado = await abrirFormularioDocumento();

  if (!resultado.isConfirmed) return;

  mostrarCargandoTablero(
    "Cargando documento",
    "Enviando archivo al Gestor Documental…"
  );

  try {
    const fileBase64 = await convertirArchivoBase64(resultado.value.file);

    const hash = await subirArchivoGestorDocumental({
      file: resultado.value.file,
      fileBase64,
      metadatos: resultado.value.datosFormulario,
    });

    const datosRegistro = {
      ...resultado.value.datosFormulario,
      hash,
    };

    await camposService.crearRegistro(idEstructura.value, datosRegistro);

    cerrarCargandoTablero();

    await Swal.fire({
      title: "¡Documento cargado!",
      text: "El archivo fue enviado al Gestor Documental y el registro fue guardado correctamente.",
      icon: "success",
      width: "380px",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
      },
      buttonsStyling: false,
    });

    await traerDatos(estructuraSeleccionada.value);
  } catch (error) {
    console.error("Error al cargar documento:", error);

    cerrarCargandoTablero();

    await Swal.fire({
      title: "Error",
      text:
        error?.message ||
        "No fue posible cargar el documento.",
      icon: "error",
      width: "390px",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
      },
      buttonsStyling: false,
    });
  }
};

onMounted(async () => {
  mostrarCargandoTablero(
    "Cargando tablero",
    "Consultando estructura, aspecto y característica…"
  );

  try {
    let estructuraInicial = null;

    if (estructuraIdRuta.value) {
      estructuraInicial = await cargarContextoDesdeIdTabla();
    } else if (estructuraStore.estructura) {
      estructuraInicial = estructuraStore.estructura;
    }

    if (!estructuraInicial) {
      cerrarCargandoTablero();

      await Swal.fire({
        title: "Sin estructura",
        text: "No se recibió el ID de la estructura tabla.",
        icon: "info",
        width: "340px",
        customClass: {
          popup: "popup-personalizado",
          title: "titulo-alerta-personalizado",
          confirmButton: "confirmacion-alerta-personalizado",
        },
        buttonsStyling: false,
      });

      return;
    }

    estructuraInicial = await sincronizarCampoHashDocumental(estructuraInicial);

    estructuraSeleccionada.value = estructuraInicial;
    estructuraStore.setEstructura(estructuraInicial);

    await traerDatos(estructuraInicial);

    cerrarCargandoTablero();
  } catch (error) {
    console.error(
      "Error al cargar contexto del tablero:",
      error?.response?.data || error
    );

    cerrarCargandoTablero();

    await Swal.fire({
      title: "Error",
      text: "No fue posible cargar la información del tablero.",
      icon: "error",
      width: "340px",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
      },
      buttonsStyling: false,
    });
  }
});
</script>

<style scoped>
.tablero-page {
  width: 94%;
  max-width: 1280px;
  margin: 16px auto 48px;
  font-family: Arial, Helvetica, sans-serif;
  color: #263238;
}

.context-card,
.table-card {
  overflow: hidden;
  border: 1px solid #d7e1ef;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 6px 18px rgba(25, 55, 90, 0.08);
}

.context-card {
  margin-bottom: 18px;
}

.context-card__header {
  padding: 18px 22px;
  background: linear-gradient(135deg, #244f84 0%, #376aa3 100%);
  color: #ffffff;
}

.context-card__label,
.table-card__label {
  display: block;
  margin-bottom: 4px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.85;
}

.context-card__header h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  line-height: 1.25;
}

.context-card__body {
  padding: 16px;
  background: #ffffff;
}

.hierarchy-vertical {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 980px;
  margin: 0 auto;
}

.hierarchy-node {
  min-height: 78px;
  padding: 14px 16px;
  border: 1px solid #d7e1ef;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(25, 55, 90, 0.06);
}

.hierarchy-node--caracteristica {
  border-left: 6px solid #315f99;
  background: #f3f7fc;
}

.hierarchy-node--aspecto {
  border-left: 6px solid #2e8b74;
  background: #f1faf7;
}

.node-label {
  display: block;
  margin-bottom: 6px;
  color: #607d9a;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.hierarchy-node p {
  margin: 0;
  color: #37474f;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.45;
  word-break: break-word;
}

.table-card__header {
  display: grid;
  grid-template-columns: minmax(260px, 1fr) auto;
  align-items: center;
  gap: 16px;
  padding: 14px 18px;
  border-bottom: 1px solid #e2e8f0;
  background: #f5f7fb;
}

.table-card__title {
  min-width: 0;
}

.table-card__title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.table-card__header h2 {
  margin: 0;
  color: #2f4774;
  font-size: 20px;
  font-weight: 900;
  line-height: 1.25;
  word-break: break-word;
}

.table-card__label {
  color: #607d9a;
}

.table-card__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;
}

.table-card__footer {
  display: flex;
  justify-content: flex-end;
  padding: 12px 18px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.acciones-tabla {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-wrap: nowrap;
}

.table-card__actions .v-btn {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.02em;
  text-transform: none;
}

.tabla-registros {
  border-radius: 0;
}

:deep(.tabla-registros .v-data-table__td),
:deep(.tabla-registros .v-data-table__th) {
  text-align: center !important;
  vertical-align: middle !important;
}

:deep(.tabla-registros .v-data-table__th .v-data-table-header__content) {
  justify-content: center !important;
}

:deep(.tabla-registros .v-data-table__td) {
  font-size: 12px !important;
}

:deep(.tabla-registros .v-data-table__th) {
  font-size: 11px !important;
  font-weight: 900 !important;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  background: #e7f1fa;
}

.btn-table-action {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.02em;
  text-transform: none;
  border-radius: 9px;
}

.btn-agregar-campo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  padding: 9px 14px;
  border: 1px solid #315f99;
  border-radius: 9px;
  background: #f3f7fc;
  color: #315f99;
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;
}

@media (max-width: 900px) {
  .hierarchy-vertical {
    max-width: 100%;
  }

  .table-card__header {
    grid-template-columns: 1fr;
    align-items: flex-start;
  }

  .table-card__actions {
    justify-content: flex-start;
  }
}
</style>
<style>
.popup-campos {
  width: 760px !important;
  padding: 0 0 22px !important;
}

.popup-campos .swal2-title {
  margin: 0 !important;
  padding: 22px 24px 8px !important;
  color: #455a64 !important;
  font-size: 22px !important;
  font-weight: 900 !important;
}

.popup-campos .swal2-html-container {
  display: block !important;
  margin: 10px 28px 0 !important;
  padding: 0 !important;
  overflow: visible !important;
  text-align: left !important;
}

.campos-popup {
  width: 100%;
  text-align: left !important;
}

.campos-popup__help {
  margin: 0 0 18px !important;
  color: #607d8b !important;
  font-size: 13px !important;
  line-height: 1.4 !important;
  text-align: left !important;
}

.campos-container {
  display: flex !important;
  flex-direction: column !important;
  gap: 12px !important;
  max-height: 330px !important;
  overflow-y: auto !important;
  padding: 4px 4px 6px !important;
}

.campo-row {
  display: grid !important;
  grid-template-columns: minmax(220px, 1fr) minmax(220px, 260px) 96px 86px !important;
  align-items: center !important;
  gap: 10px !important;
  width: 100% !important;
}

.campo-disable,
.campo-delete {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  height: 40px !important;
  border: none !important;
  border-radius: 9px !important;
  font-size: 11px !important;
  font-weight: 800 !important;
  cursor: pointer !important;
}

.campo-disable {
  background: #fff8e1 !important;
  color: #8a6d1d !important;
}

.campo-disable:hover {
  background: #ffecb3 !important;
}

.campo-field {
  width: 100% !important;
}

.campo-input {
  width: 100% !important;
  height: 48px !important;
  box-sizing: border-box !important;
  padding: 0 14px !important;
  border: 1px solid #b0bec5 !important;
  border-radius: 6px !important;
  outline: none !important;
  background: #ffffff !important;
  color: #37474f !important;
  font-size: 14px !important;
  font-family: Arial, Helvetica, sans-serif !important;
  text-align: left !important;
}

.campo-input::placeholder {
  color: #7d8a92 !important;
}

.campo-input:focus {
  border-color: #315f99 !important;
  box-shadow: 0 0 0 2px rgba(49, 95, 153, 0.14) !important;
}

.campo-select-wrapper {
  position: relative !important;
}

.campo-select-wrapper label {
  position: absolute !important;
  top: -9px !important;
  left: 10px !important;
  z-index: 1 !important;
  padding: 0 5px !important;
  background: #ffffff !important;
  color: #607d8b !important;
  font-size: 12px !important;
  line-height: 1 !important;
}

.campo-tipo {
  cursor: pointer !important;
}

.campo-delete {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 36px !important;
  height: 44px !important;
  border: none !important;
  border-radius: 9px !important;
  background: transparent !important;
  color: #7a95c9 !important;
  font-size: 24px !important;
  font-weight: 700 !important;
  cursor: pointer !important;
  transition: background-color 0.2s ease, color 0.2s ease !important;
}

.campo-delete:hover {
  background: #f1f5fb !important;
  color: #d32f2f !important;
}

.campo-delete--disabled {
  cursor: not-allowed !important;
  opacity: 0.35 !important;
}

.btn-agregar-campo {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin-top: 16px !important;
  padding: 9px 14px !important;
  border: 1px solid #315f99 !important;
  border-radius: 9px !important;
  background: #f3f7fc !important;
  color: #315f99 !important;
  font-size: 12px !important;
  font-weight: 900 !important;
  cursor: pointer !important;
}

.btn-agregar-campo:hover {
  background: #e7f1fa !important;
}

@media (max-width: 700px) {
  .popup-campos {
    width: 94vw !important;
  }

  .popup-campos .swal2-html-container {
    margin: 10px 18px 0 !important;
  }

  .campo-row {
    grid-template-columns: 1fr !important;
  }

  .campo-delete {
    justify-self: flex-end !important;
  }
}
</style>

<style>
.popup-documento {
  width: 620px !important;
  padding: 0 0 22px !important;
}

.popup-documento .swal2-html-container {
  margin: 12px 28px 0 !important;
  text-align: left !important;
}

.documento-popup {
  width: 100%;
  text-align: left;
}

.documento-help {
  margin: 0 0 16px;
  color: #607d8b;
  font-size: 13px;
  line-height: 1.4;
}

.documento-label {
  display: block;
  margin: 10px 0 6px;
  color: #455a64;
  font-size: 12px;
  font-weight: 800;
}

.documento-file,
.documento-input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid #b0bec5;
  border-radius: 8px;
  background: #ffffff;
  color: #37474f;
  font-size: 13px;
}

.documento-input:disabled {
  background: #f3f7fc;
  color: #607d8b;
  cursor: not-allowed;
}

.documento-fields {
  margin-top: 14px;
}
</style>
