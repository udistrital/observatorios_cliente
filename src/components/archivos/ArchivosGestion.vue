<template>
    <v-container class="archivo">
        <div class="flow-nav">
            <v-btn
                variant="text"
                color="primary"
                prepend-icon="mdi-arrow-left"
                @click="volverAEstructuras"
            >
                Regresar a estructuras
            </v-btn>
        </div>

        <div class="cabecera">
            <h1 class="titulo__cabecera">Archivos</h1>
        </div>
        <div class="control__container">
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
        </div>

        <v-card>
            <div class="cabecera__tabla">
                <v-card-title class="d-flex justify-space-between align-center">
                <span class="text-h5">{{ estructuraSeleccionada?.nombre }}</span>
                </v-card-title>
                <v-spacer></v-spacer>
                <v-btn
                color="primary"
                v-if="estructuraSeleccionada"
                @click="agregarRegistro"
                >
                <v-icon left>mdi-plus</v-icon> Agregar Registro
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
                    @click="verRegistro(item)"
                    color="primary"
                    title="Ver registro"
                >
                    <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn
                    variant="text"
                    icon
                    size="small"
                    @click="editarRegistro(item)"
                    color="primary"
                    title="Editar registro"
                >
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                    variant="text"
                    icon
                    size="small"
                    @click="eliminarRegistro(item)"
                    color="primary"
                    title="Eliminar registro"
                >
                    <v-icon>mdi-trash-can</v-icon>
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
import { ref, computed, onMounted, nextTick, reactive } from "vue";
import peticionAPI from "@/service/conexion_api";
import { useRouter, useRoute } from "vue-router";
import Swal from "sweetalert2";
import { useEstructuraStore } from "@/stores/estructuraStore";
import { useObservatorioStore } from "@/stores/observatorioStore";
import AgregarArchivo from "./AgregarArchivo.vue";
import RegistroArchiGestion from "./RegistroArchiGestion.vue";


const observatorioStore = useObservatorioStore();
const headerst = ref([
  { title: "Nombre", key: "nombre", align: "center" },
  { title: "Estado", key: "activo", align: "center" },
  { title: "Acciones", key: "acciones", sortable: false, align: "center" },
]);

const router = useRouter();
const route = useRoute();
const estructuraStore = useEstructuraStore();

const volverAEstructuras = () => {
  if (route.params.proceso_id && route.params.factor_id) {
    router.push({
      name: "factorEstructurasGestion",
      params: {
        proceso_id: route.params.proceso_id,
        factor_id: route.params.factor_id,
      },
    });
    return;
  }

  if (route.params.factor_id) {
    router.push({
      name: "estructuras",
      params: {
        factor_id: route.params.factor_id,
      },
    });
    return;
  }

  router.back();
};

const sortBy = ref(null);
const sortDesc = ref(false);
const ordering = computed(() => {
  if (sortBy.value) {
    return sortDesc.value == "asc" ? `${sortBy.value}` : `-${sortBy.value}`;
  }
  return "";
});

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

const cargando = ref(false);
const paginacion = reactive({
  page: 1,
  itemsPerPage: 10,
  totalItems: 0,
});

const traerEstructuras = async () => {
  cargando.value = true;

  Swal.fire({
    title: "Cargando archivos",
    text: "Por favor espera…",
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const data = await peticionAPI("campos/estructuras/", "GET", null, {
      observatorio: observatorioStore.observatorio?.observatorio_id,
    });

    estructuras.value = data;

    if (estructuraStore.estructura) {
      const encontrada = data.find(
        (e) => e.id === estructuraStore.estructura.id
      );
      if (encontrada) {
        estructuraSeleccionada.value = encontrada;
        await traerDatos(encontrada);
      } else {
      }
    }
  } catch (e) {
  } finally {
    cargando.value = false;
    Swal.close();
  }
};

const traerDatos = async (estructura) => {
  let estructuraActiva =
    estructura || estructuraSeleccionada.value || estructuraStore.estructura;

  if (!estructuraActiva) {
    console.warn("⚠️ traerDatos(): no hay estructura activa");
    return;
  }

  estructuraStore.setEstructura(estructuraActiva);
  estructuraSeleccionada.value = estructuraActiva;

  camposFormulario.value = estructuraActiva.mapeo_archivos || [];
  idEstructura.value = estructuraActiva.id_archivos || estructuraActiva.id;

  headers.value = camposFormulario.value.map((item) => ({
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

    datos.value = response.results || [];
    paginacion.totalItems = Number(response.count) || 0;
    await nextTick();
  } catch (error) {
    console.error("❌ Error al cargar archivos:", error);
  } finally {
    cargando.value = false;
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

const agregarRegistro = () => {
  _agregarRegistro.value = true;
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

const eliminarRegistro = async (item) => {
  let id = item.raw.id;

  const resultado = await Swal.fire({
    title: "Eliminar Archivo",
    html: `¿Desea eliminar este archivo?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar",
  });

  if (!resultado.isConfirmed) return;

  try {
    await peticionAPI(
      `datosArchivo/${idEstructura.value}/${id}/`,
      "DELETE"
    );

    Swal.fire("Eliminado", "Archivo eliminado correctamente", "success");

    setTimeout(() => {
      traerDatos(estructuraSeleccionada.value);
    }, 800);

  } catch (error) {
    console.error("❌ Error eliminando registro:", error);
    Swal.fire("Error", "No se pudo eliminar el archivo", "error");
  }
};

onMounted(async () => {
  await traerEstructuras();
});
</script>


<style scoped>
.archivo {
  margin: 40px auto;
}

.flow-nav {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 12px;
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
