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
        <v-text-field
          v-model="busqueda"
          label="Buscar"
          variant="outlined"
          @click:append-inner="filtrarDatos"
          density="compact"
          hide-details
          class="textfield__control"
        ></v-text-field>
      </div>
      <v-spacer />
      <div class="contenedor_botones">
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
        :search="search"
        item-value="name"
        @update:page="actualizarPagina"
        @update:items-per-page="actualizarItemsPorPagina"
      >
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
    max-height="90vh"
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
    max-height="90vh"
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
    max-height="90vh"
    transition="dialog-transition"
  >
    <RegistroGestion
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
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import AgregarRegistro from "./AgregarRegistro.vue";
import RegistroGestion from "./RegistroGestion.vue";
import CargarArchivo from "./CargarArchivo.vue";

const headerst = ref([
  { title: "Nombre", key: "nombre", align: "center" },
  { title: "Estado", key: "activo", align: "center" },
  { title: "Acciones", key: "acciones", sortable: false, align: "center" },
]);

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
const _modo = ref(false);
const datosRegistro = ref([]);

const cargando = ref(false);
const paginacion = reactive({
  page: 1,
  itemsPerPage: 10,
  totalItems: 0,
});

const traerDatos = async (nuevoValor) => {
  let estructura = null;

  if (nuevoValor?.id) {
    estructura = estructuras.value.find((e) => e.id === nuevoValor.id);
  } else if (estructuraSeleccionada.value) {
    estructura = estructuraSeleccionada.value;
  }

  if (!estructura) return;

  estructuraSeleccionada.value = estructura;
  camposFormulario.value = estructura.mapeo;
  idEstructura.value = estructura.id;

  headers.value = estructura.mapeo.map((item) => ({
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
  try {
    const response = await peticionAPI(`datos/${estructura.id}`, "GET", null, {
      page: paginacion.page,
      page_size: paginacion.itemsPerPage,
    });

    datos.value = response.results;
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
  traerDatos(); // 👈
};

const actualizarItemsPorPagina = (nuevoTamaño) => {
  paginacion.itemsPerPage = nuevoTamaño;
  paginacion.page = 1;
  traerDatos(); // 👈
};
const datosFiltrados = computed(() => {
  return datos.value.filter((row) =>
    Object.values(row).some((val) =>
      val.toString().toLowerCase().includes(busqueda.value.toLowerCase())
    )
  );
});

const filtrarDatos = () => {
  console.log("Filtrando datos con búsqued:", busqueda.value);
};

const traerEstructuras = () => {
  peticionAPI("campos/estructuras/", "GET")
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
          traerDatos({ id: idEstructura.value });
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
          traerDatos({ id: idEstructura.value });
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
    traerDatos(data);
  }, 2000);
  _gestionRegistro.value = false;
  _agregarRegistro.value = false;
};
onMounted(async () => {
  traerEstructuras();
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
  width: 80%;
}
.contenedor_botones {
  display: flex;
  justify-content: space-between;
}
.textfield__control {
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
