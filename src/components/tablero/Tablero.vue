<template>
  <v-container class="tablero">
    <div class="cabecera">
      <h1 class="titulo__cabecera">Tablero</h1>
    </div>
    <div class="control__container">
      <div class="textfield__contenedor">
        <v-select
          v-model="estructuraSeleccionada"
          :items="estructuras"
          label="Estructura"
          variant="outlined"
          density="compact"
          hide-details
          width="35px"
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
          variant="outlined"
          class="mr-2"
          v-if="estructuraSeleccionada"
          @click="cargarArchivos"
        >
          <v-icon left>mdi-paperclip</v-icon> Cargar Archivo
        </v-btn>
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
      <div class="cabecera__tabla">
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          v-if="estructuraSeleccionada"
          @click="limpiarEstructura"
        >
          <v-icon left>mdi-broom</v-icon> Limpiar estructura
        </v-btn>
      </div>
    </v-card>
  </v-container>
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
      :campos="datosRegistro"
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
    <!-- <filtrar-datos/> -->
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, reactive } from "vue";
import peticionAPI from "@/service/conexion_api";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useEstructuraStore } from "@/stores/estructuraStore";

import AgregarRegistro from "./AgregarRegistro.vue";
import RegistroGestion from "./RegistroGestion.vue";
import FiltrarDatos from "./FiltrarDatos.vue";
import CargarArchivo from "./CargarArchivo.vue";
import { useObservatorioStore } from "@/stores/observatorioStore";

const observatorioStore = useObservatorioStore();
const headerst = ref([
  { title: "Nombre", key: "nombre", align: "center" },
  { title: "Estado", key: "activo", align: "center" },
  { title: "Acciones", key: "acciones", sortable: false, align: "center" },
]);

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

const traerDatos = async (estructura) => {
  estructuraStore.setEstructura(estructura);
  let estructuraActiva = estructura;
  if (!estructuraActiva && estructuraSeleccionada.value) {
    estructuraActiva = estructuraSeleccionada.value;
  }
  if (!estructuraActiva) return;

  estructuraSeleccionada.value = estructuraActiva;
  camposFormulario.value = estructuraActiva.mapeo;
  idEstructura.value = estructuraActiva.id;

  
  camposBool.value = estructuraActiva.mapeo.filter(
    (campo) => campo.tipo === "boolean"
  );

  headers.value = estructuraActiva.mapeo.map((item) => ({
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
      `datos/${estructuraActiva.id}/`,
      "GET",
      null,
      {
        page: paginacion.page,
        page_size: paginacion.itemsPerPage,
        ordering: ordering.value,
        ...filtros.value,
      }
    );
    datos.value = response.results;
    
    camposBool.value.forEach((campo) => {
      datos.value.forEach((item) => {
        if (item[campo.nombre] === true) {
          item[campo.nombre] = "true";
        } else if (item[campo.nombre] === false) {
          item[campo.nombre] = "false";
        }
      });
    });

    paginacion.totalItems = Number(response.count) || 0;
    await nextTick();
  } catch (error) {
    console.error("Error al cargar datos:", error);
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
const datosFiltrados = computed(() => {
  return datos.value.filter((row) =>
    Object.values(row).some((val) =>
      val.toString().toLowerCase().includes(busqueda.value.toLowerCase())
    )
  );
});

const aplicarFiltro = (data) => {
  paginacion.page = 1
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
const traerEstructuras = () => {
  peticionAPI("campos/estructuras/", "GET", null, {
    observatorio: observatorioStore.observatorio?.observatorio_id,
  })
    .then((data) => {
      estructuras.value = data;
    })
    .catch((error) => console.error(error));
};
const limpiarEstructura = async () => {
  const resultado = await Swal.fire({
    title: "Limpiar Estructura",
    html: `¿Desea eliminar todos los datos de la estructura? `,
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

  if (resultado.isConfirmed) {
    const data = { confirmacion: true };

    peticionAPI(`/datos/${idEstructura.value}/`, "DELETE")
      .then((data) => {
        Swal.fire({
          title: "¡Eliminado!",
          text: "El elemento ha sido eliminado correctamente.",
          icon: "success",
          width: "300px",
          customClass: {
            popup: "popup-personalizado",
            title: "titulo-alerta-personalizado",
            confirmButton: "confirmacion-alerta-personalizado",
          },
          buttonsStyling: false,
        });
        setTimeout(() => {
          traerDatos(estructuraStore.estructura);
        }, 1000);
      })
      .catch((error) => console.error(error));
  }
};
const eliminarRegistro = async (item) => {
  let id = item.raw.id;
  const resultado = await Swal.fire({
    title: "Eliminar Registro",
    html: `¿Desea eliminar el registro? `,
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

  if (resultado.isConfirmed) {
    const data = { confirmacion: true };

    peticionAPI(`/datos/${idEstructura.value}/${id}/`, "DELETE")
      .then((data) => {
        Swal.fire({
          title: "¡Eliminado!",
          text: "El elemento ha sido eliminado correctamente.",
          icon: "success",
          width: "300px",
          customClass: {
            popup: "popup-personalizado",
            title: "titulo-alerta-personalizado",
            confirmButton: "confirmacion-alerta-personalizado",
          },
          buttonsStyling: false,
        });
        setTimeout(() => {
          traerDatos(estructuraStore.estructura);
        }, 1000);
      })
      .catch((error) => console.error(error));
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
const cerrarModal = (data) => {
  setTimeout(() => {
    traerDatos(estructuraStore.estructura);
  }, 2000);
  _gestionRegistro.value = false;
  _agregarRegistro.value = false;
  _agregarFilro.value = false;
  _cargarRegistro.value = false;
};
const agregarFiltro = () => {
  _agregarFilro.value = true;
};
onMounted(async () => {
  traerEstructuras();
  if (estructuraStore.estructura) {
    estructuraSeleccionada.value = estructuraStore.estructura;
    traerDatos(estructuraStore.estructura);
  }
});
</script>

<style scoped>
.tablero {
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
