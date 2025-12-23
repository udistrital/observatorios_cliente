<template>
  <v-container class="tablero">
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
      </v-data-table-server>

      <v-alert v-else color="primary" variant="tonal" class="ma-4">
        No se ha seleccionado ningúna estructura
      </v-alert>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, reactive } from "vue";
import peticionAPI from "@/service/conexion_api";
import Swal from "sweetalert2";
import { useEstructuraStore } from "@/stores/estructuraStore";

import { useObservatorioStore } from "@/stores/observatorioStore";
import { usePanelStore } from "@/stores/panelStore";

const panelStore = usePanelStore();
const observatorioStore = useObservatorioStore();

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
const _agregarFilro = ref(false);
const _filtroActivo = ref(false);
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
/*const traerEstructuras = () => {
  peticionAPI("campos/estructuras/", "GET", null, {
    observatorio: observatorioStore.observatorio?.observatorio_id,
  })
    .then((data) => {
      estructuras.value = data;
    })
    .catch((error) => console.error(error));
};*/

const traerEstructuras = async () => {
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

    estructuras.value = data;
  } catch (error) {
    console.error(error);
    Swal.fire(
      "Error",
      "No fue posible cargar las estructuras",
      "error"
    );
  } finally {
    Swal.close();
  }
};


const agregarFiltro = () => {
  _agregarFilro.value = true;
};
onMounted(async () => {
  console.log("panelStore.panel :", panelStore.panel);
  console.log("estructuraStore.estructura :", estructuraStore.estructura);
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
