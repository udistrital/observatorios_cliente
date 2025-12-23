<template>
    <v-container class="archivo">
        <!-- <div class="control__container">
            <div class="textfield__contenedor">
                <v-select
                    v-model="estructuraSeleccionada"
                    :items="estructuras"
                    item-title="nombre"
                    return-object
                    label="Estructura"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="textfield__control mr-10"
                    @update:modelValue="traerDatos"
                >
                    <template v-slot:item="{ props, item }">
                        <div class="select__estructura" v-bind="props">
                        {{ item.raw.nombre }}
                        </div>
                    </template>
                    <template v-slot:selection="{ item }">
                        {{ item.raw.nombre }}
                    </template>
                </v-select>
            </div>
            <v-spacer />
            <div class="contenedor_botones">
                <v-btn
                    v-if="_filtroActivo"
                    @click="limpiarFiltro"
                    color="primary"
                    variant="outlined"
                    class="mr-2"
                >
                    <v-icon left>mdi-filter-variant-remove</v-icon> Limpiar Filtro
                </v-btn>
                <v-btn
                    color="primary"
                    v-if="estructuraSeleccionada"
                    @click="agregarFiltro"
                >
                    <v-icon left>mdi-filter-variant</v-icon>
                </v-btn>
            </div>
        </div> -->
        
        <v-card>
          <div class="cabecera__tabla">
            <v-spacer />
            <v-btn
              v-if="_filtroActivo"
              @click="limpiarFiltro"
              color="primary"
              variant="outlined"
              class="mr-2"
            >
              <v-icon left>mdi-filter-variant-remove</v-icon>Limpiar filtro
            </v-btn>
            <v-btn
              color="primary"
              v-if="estructuraSeleccionada"
              @click="agregarFiltro"
            >
              <v-icon left>mdi-filter-variant</v-icon>Filtrar datos
            </v-btn>
          </div>
            <v-data-table-server
                v-if="headers.length > 0"
                v-model:items-per-page="paginacion.itemsPerPage"
                :headers="headers"
                :items="datos"
                :items-length="paginacion.totalItems"
                :loading="cargando"
                items-per-page-text="Elementos por página:"
                item-value="name"
                :items-per-page-options="[
                {title: '10' , value: 10},
                {title: '25' , value: 25},
                {title: '50' , value: 50},
                {title: '100' , value: 100}
                ]"
                @update:page="actualizarPagina"
                @update:items-per-page="actualizarItemsPorPagina"
                @update:sort-by="actualizarOrden"
                no-data-text="No se encontraron datos"
            >
                <template #loading>
                <v-skeleton-loader type="table" />
                </template>
                <template v-slot:[`item.acciones`]="{ item }">
                <v-btn
                    variant="text"
                    icon
                    size="small"
                    @click="verArchivo(item)"
                    color="primary"
                    title="Ver registro"
                >
                    <v-icon>mdi-eye</v-icon>
                </v-btn>
                </template>
            </v-data-table-server>

            <v-alert v-else color="primary" variant="tonal" class="ma-4">
                No se ha seleccionado ningúna estructura
            </v-alert>
        </v-card>

    </v-container>
    <v-dialog
      v-model="_agregarRegistro"
      scrollable
      max-width="500px"
      max-height="70vh"
      transition="dialog-transition"
    >
      <AgregarArchivo
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
      <RegistroArchiGestion
        @cerrar="cerrarModal"
        :esVer="_modo"
        :idEstructura="idEstructura"
        :campos="datosRegistro"
      />
    </v-dialog>

</template>

<script setup>
console.log("🔥 ArchivosGestion.vue SE ESTÁ MONTANDO");
import { ref, computed, onMounted, nextTick, reactive } from "vue";
import peticionAPI from "@/service/conexion_api";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useEstructuraStore } from "@/stores/estructuraStore";
import { useObservatorioStore } from "@/stores/observatorioStore";
import AgregarArchivo from "./AgregarArchivo.vue";
import RegistroArchiGestion from "./RegistroArchiGestion.vue";
import { environment } from "../../eviroments";


const observatorioStore = useObservatorioStore();
const headerst = ref([
  { title: "Nombre", key: "nombre", align: "center" },
  { title: "Estado", key: "activo", align: "center" },
  { title: "Acciones", key: "acciones", sortable: false, align: "center" },
]);
console.log("1");

const router = useRouter();
const estructuraStore = useEstructuraStore();

const sortBy = ref(null);
const sortDesc = ref(false);
const ordering = computed(() => {
  if (sortBy.value) {
    return sortDesc.value == "asc" ? `${sortBy.value}` : `-${sortBy.value}`;
  }
  return "";
});
console.log("ll11");

const estructuras = ref([]);
const estructuraSeleccionada = ref(null);
const camposFormulario = ref([]);
const idEstructura = ref("");
const busqueda = ref("");
const datos = ref([]);
const headers = ref([]);
const _agregarRegistro = ref(false);
const _gestionRegistro = ref(false);
const _cargarRegistro = ref(false);
const _agregarFilro = ref(false);
const _filtroActivo = ref(false);
const _modo = ref(false);
const datosRegistro = ref([]);
const filtros = ref({});
const camposBool = ref([]);
const gestorUrl = environment.GESTOR_DOCUMENTAL;

const cargando = ref(false);
const paginacion = reactive({
  page: 1,
  itemsPerPage: 10,
  totalItems: 0,
});
console.log("222");

// 🔹 1. Cargar estructuras desde el backend
/*const traerEstructuras = async () => {
  try {
    const data = await peticionAPI("campos/estructuras/", "GET", null, {
      observatorio: observatorioStore.observatorio?.observatorio_id,
    });

    console.log("📌 estructuras en ArchivosGestion:", data);
    estructuras.value = data;

    // Si vienes de Estructuras.vue con algo en el store, sincroniza
    if (estructuraStore.estructura) {
      const encontrada = data.find(
        (e) => e.id === estructuraStore.estructura.id
      );
      if (encontrada) {
        console.log("✅ Estructura encontrada por id:", encontrada);
        estructuraSeleccionada.value = encontrada;
        await traerDatos(encontrada);
      } else {
        console.warn(
          "⚠️ Estructura del store no coincide con ninguna de las cargadas"
        );
      }
    }
  } catch (e) {
    console.error("❌ Error trayendo estructuras en ArchivosGestion:", e);
  }
};*/

const traerEstructuras = async () => {
  cargando.value = true;

  Swal.fire({
    title: "Cargando estructuras",
    text: "Por favor espera…",
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const data = await peticionAPI(
      "campos/estructuras/",
      "GET",
      null,
      {
        observatorio: observatorioStore.observatorio?.observatorio_id,
      }
    );

    console.log("📌 estructuras en ArchivosVista:", data);
    estructuras.value = data;

    // 🔁 sincronizar si viene estructura desde el store
    if (estructuraStore.estructura) {
      const encontrada = data.find(
        (e) => e.id === estructuraStore.estructura.id
      );

      if (encontrada) {
        estructuraSeleccionada.value = encontrada;
        await traerDatos(encontrada, true); // 👈 loader SOLO aquí
      }
    }
  } catch (e) {
    console.error(e);
    Swal.fire(
      "Error",
      "No fue posible cargar las estructuras",
      "error"
    );
  } finally {
    cargando.value = false;
    Swal.close();
  }
};


// 🔹 2. Traer datos de archivos para una estructura
/*const traerDatos = async (estructura) => {
  console.log("llamado llamado");
  console.log("👉 traerDatos() llamado con:", estructura);

  let estructuraActiva =
    estructura || estructuraSeleccionada.value || estructuraStore.estructura;

  if (!estructuraActiva) {
    console.warn("⚠️ traerDatos(): no hay estructura activa");
    return;
  }

  console.log("✅ Estructura activa en traerDatos:", estructuraActiva);

  estructuraStore.setEstructura(estructuraActiva);
  estructuraSeleccionada.value = estructuraActiva;

  camposFormulario.value = estructuraActiva.mapeo_archivos || [];
  idEstructura.value = estructuraActiva.id_archivos || estructuraActiva.id;

  console.log("📁 mapeo_archivos usado:", camposFormulario.value);
  console.log("📁 idEstructura (archivos):", idEstructura.value);

  headers.value = camposFormulario.value
  .filter(
    (item) =>
      item.nombre !== "Hash" &&
      item.nombre !== "hash"
  )
  .map((item) => ({
    title: item.nombre,
    key: item.nombre,
    value: item.nombre,
    align: "center",
    sortable: true,
  }));


  headers.value.push({
    title: "Acciones",
    key: "acciones",
    value: "acciones",
    align: "center",
    sortable: false,
  });

  cargando.value = true;
  datos.value = [];

  try {

    const response = await peticionAPI(
      `datosArchivo/${idEstructura.value}/`,
      "GET",
      null,
      {
        page: paginacion.page,
        page_size: paginacion.itemsPerPage,
        ordering: ordering.value,
        ...filtros.value,
      }
    );

    console.log("📦 Respuesta API archivos:", response);

    datos.value = response.results || [];
    paginacion.totalItems = Number(response.count) || 0;
    await nextTick();
  } catch (error) {
    console.error("❌ Error al cargar archivos:", error);
  } finally {
    cargando.value = false;
  }
};*/

const traerDatos = async (estructura, mostrarLoader = false) => {
  let estructuraActiva =
    estructura || estructuraSeleccionada.value || estructuraStore.estructura;

  if (!estructuraActiva) return;

  estructuraStore.setEstructura(estructuraActiva);
  estructuraSeleccionada.value = estructuraActiva;

  camposFormulario.value = estructuraActiva.mapeo_archivos || [];
  idEstructura.value = estructuraActiva.id_archivos || estructuraActiva.id;

  headers.value = camposFormulario.value
    .filter(
      (item) =>
        item.nombre !== "Hash" &&
        item.nombre !== "hash"
    )
    .map((item) => ({
      title: item.nombre,
      key: item.nombre,
      value: item.nombre,
      align: "center",
      sortable: true,
    }));

  headers.value.push({
    title: "Acciones",
    key: "acciones",
    value: "acciones",
    align: "center",
    sortable: false,
  });

  if (mostrarLoader) {
    Swal.fire({
      title: "Cargando archivos",
      text: "Por favor espera…",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  cargando.value = true;
  datos.value = [];

  try {
    const response = await peticionAPI(
      `datosArchivo/${idEstructura.value}/`,
      "GET",
      null,
      {
        page: paginacion.page,
        page_size: paginacion.itemsPerPage,
        ordering: ordering.value,
        ...filtros.value,
      }
    );

    console.log("📦 Respuesta API archivos:", response);

    datos.value = response.results || [];
    paginacion.totalItems = Number(response.count) || 0;
    await nextTick();
  } catch (error) {
    console.error("❌ Error al cargar archivos:", error);
    Swal.fire("Error", "No fue posible cargar los archivos", "error");
  } finally {
    cargando.value = false;
    if (mostrarLoader) Swal.close();
  }
};


const actualizarPagina = (nuevaPagina) => {
  paginacion.page = nuevaPagina;
  traerDatos(estructuraSeleccionada.value);
};

const actualizarItemsPorPagina = (nuevoTamaño) => {
  paginacion.itemsPerPage = nuevoTamaño;
  paginacion.page = 1;
  traerDatos(estructuraSeleccionada.value);
};

const actualizarOrden = (payload) => {
  if (payload.length > 0) {
    sortBy.value = payload[0].key;
    sortDesc.value = payload[0].order;
  }
  traerDatos(estructuraSeleccionada.value);
};

const cerrarModal = () => {
  setTimeout(() => {
    traerDatos(estructuraSeleccionada.value);
  }, 2000);

  _agregarRegistro.value = false;
  _gestionRegistro.value = false;
  _cargarRegistro.value = false;
  _agregarFilro.value = false;
};

const base64ToBlob = (base64, type) => {
  const bytes = atob(base64);
  const array = new Uint8Array(bytes.length);

  for (let i = 0; i < bytes.length; i++) {
    array[i] = bytes.charCodeAt(i);
  }

  return new Blob([array], { type });
};

const verArchivo = async (item) => {
  console.log("👉 verArchivo() llamado con:", item);
  const enlaceArchivo =
      item?.raw?.Enlace ||
      item?.raw?.enlace ||
      item?.raw?.Hash ||
      item?.raw?.id_archivo;

  if (!enlaceArchivo) {
    Swal.fire("Aviso", "Este registro no tiene archivo asociado", "warning");
    return;
  }

  try {
    const resp = await fetch(
      `${gestorUrl}document/${enlaceArchivo}`
    );

    if (!resp.ok) {
      throw new Error("Error consultando gestor documental");
    }

    const data = await resp.json();
    const base64 = data.file;

    if (!base64) {
      throw new Error("No se encontró base64 del archivo");
    }

    const blob = base64ToBlob(base64, "application/pdf");
    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");

    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } catch (e) {
    console.error(e);
    Swal.fire("Error", "No se pudo abrir el archivo", "error");
  }
};

/*const verArchivo = async (item) => {
  console.log("👉 verArchivo() llamado con:", item);

  const enlaceArchivo =
    item?.raw?.Enlace ||
    item?.raw?.enlace ||
    item?.raw?.Hash ||
    item?.raw?.id_archivo;

  if (!enlaceArchivo) {
    Swal.fire(
      "Aviso",
      "Este registro no tiene archivo asociado",
      "warning"
    );
    return;
  }

  // 🟡 Loader bloqueante
  Swal.fire({
    title: "Cargando archivo",
    text: "Por favor espera…",
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const resp = await fetch(
      `${gestorUrl}document/${enlaceArchivo}`
    );

    if (!resp.ok) {
      throw new Error("Error consultando gestor documental");
    }

    const data = await resp.json();
    const base64 = data.file;

    if (!base64) {
      throw new Error("No se encontró base64 del archivo");
    }

    const blob = base64ToBlob(base64, "application/pdf");
    const url = URL.createObjectURL(blob);

    // 📄 Abrir archivo
    window.open(url, "_blank");

    // 🧹 Liberar memoria
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } catch (e) {
    console.error(e);
    Swal.fire(
      "Error",
      "No se pudo abrir el archivo",
      "error"
    );
    return;
  } finally {
    Swal.close();
  }
};*/


// 🔹 3. Montaje: aquí SÍ pasa algo
onMounted(async () => {
  console.log("🟢 onMounted ArchivosGestion.vue");
  await traerEstructuras();
});
console.log("44");
</script>


<style scoped>
.archivo {
  margin: 40px auto;
}
.control__container {
  margin: 20px 0;
  display: flex;
  align-items: center;
}
.textfield__contenedor {
  display: flex;
  width: 50%;
}
.contenedor_botones {
  display: flex;
  justify-content: space-between;
}
.boton__control {
  margin-left: 15px;
}
.select__estructura {
  padding: 5px;
  cursor: pointer;
}
.select__estructura:hover {
  background-color: var(--color-claro);
}
</style>