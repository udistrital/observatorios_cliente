<template>
  <div class="observatorios">
    <div class="cabecera">
      <h1 class="titulo__cabecera">Administración de Factores</h1>
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="crearObservario"
        >Crear Factor</v-btn
      >
    </div>
    <v-card>
      <div class="cabecera__tabla">
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h5">Factores</span>
        </v-card-title>
        <v-spacer />
        <v-text-field
          class="buscador__tabla"
          v-model="search"
          append-inner-icon="mdi-magnify"
          label="Buscar"
          variant="underlined"
        />
      </div>

      <v-data-table
        :headers="headers"
        :items="filteredObservatories"
        :loading="cargando"
        item-value="id"
        class="elevation-1"
        no-data-text="No se encontraron datos"
        items-per-page-text="Elementos por página:"
      >
        <template #loading>
          <v-skeleton-loader type="table" />
        </template>
        <template v-slot:[`item.activo`]="{ item }">
          <v-chip :color="item.columns.activo ? 'green' : 'red'" dark>
            {{ item.columns.activo ? "Activo" : "Inactivo" }}
          </v-chip>
        </template>

        <template v-slot:[`item.acciones`]="{ item }">
          <v-btn
            variant="text"
            icon
            size="small"
            @click="verObservatorio(item)"
            color="primary"
            title="Ver observatorio"
          >
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn
            variant="text"
            icon
            size="small"
            @click="editarObservatorio(item)"
            color="primary"
            title="Editar observatorio"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            v-if="item.columns.activo"
            variant="text"
            icon
            size="small"
            @click="eliminarObservatorio(item)"
            color="primary"
            title="Eliminar observatorio"
          >
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
          <v-btn
            v-else
            variant="text"
            icon
            size="small"
            @click="reactivarObservatorio(item)"
            color="primary"
            title="Reactivar observatorio"
          >
            <v-icon> mdi-sync</v-icon>
          </v-btn>
          <v-btn
            variant="text"
            icon
            size="small"
            @click="diriguirseObservatorio(item)"
            color="primary"
            title="Ir al observatorio"
            v-if="item.columns.activo"
          >
            <v-icon>mdi-arrow-top-right-thick</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="_crearObservatorio"
      scrollable
      max-width="500px"
      transition="dialog-transition"
      max-height="70vh"
    >
      <crear-observatorio @cerrar="cerrarModal" />
    </v-dialog>
    <v-dialog
      v-model="_gestionObservatorio"
      scrollable
      max-width="500px"
      transition="dialog-transition"
      max-height="80vh"
    >
      <ObservatoriosGestion
        :observatorio="datosObservatorio"
        :modo="_modo"
        @cerrar="cerrarModal"
      />
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import CrearObservatorio from "./observatorios/CrearObservatorio.vue";
import ObservatoriosGestion from "./observatorios/ObservatoriosGestion.vue";
import peticionAPI from "../../service/conexion_api";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useObservatorioStore } from "@/stores/observatorioStore";

const observatorioStore = useObservatorioStore();

const router = useRouter();
const search = ref("");
const observatorios = ref([]);
const cargando = ref(false);

const headers = ref([
  { title: "ID del Observatorio", key: "observatorio_id", align: "center" },
  { title: "Nombre", key: "nombre", align: "center" },
  { title: "Estado", key: "activo", align: "center" },
  { title: "Acciones", key: "acciones", sortable: false, align: "center" },
]);

const filteredObservatories = computed(() => {
  if (!search.value) return observatorios.value;
  return observatorios.value.filter((obs) =>
    obs.nombre.toLowerCase().includes(search.value.toLowerCase())
  );
});

const _crearObservatorio = ref(false);
const _gestionObservatorio = ref(false);
const _modo = ref(false);
const datosObservatorio = ref({});

const traerObservatorios = () => {
  cargando.value = true;
  observatorios.value = [];
  peticionAPI("observatorios/", "GET")
    .then((data) => {
      observatorios.value = data;
      cargando.value = false;
      localStorage.setItem('observatorios_espacios', JSON.stringify(observatorios.value))
    })
    .catch((error) => console.error(error));
};

const cerrarModal = () => {
  setTimeout(() => {
    traerObservatorios();
    _gestionObservatorio.value = false;
    _crearObservatorio.value = false;
  }, 2000);
};

const crearObservario = () => {
  _crearObservatorio.value = true;
};

const verObservatorio = (item) => {
  _gestionObservatorio.value = true;
  _modo.value = false;
  datosObservatorio.value = item.raw;
};

const editarObservatorio = (item) => {
  _gestionObservatorio.value = true;
  _modo.value = true;
  datosObservatorio.value = item.raw;
};

const reactivarObservatorio = async (item) => {
  let id = item.raw.observatorio_id;
  let nombre = item.raw.nombre;

  const resultado = await Swal.fire({
    title: "Reactivar Observatorio",
    html: `¿Desea reactivar el observatorio <b> ${nombre} </b> ?`,
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
    const formData = new FormData();
    formData.append("activo", true);

    peticionAPI(`/observatorios/${id}/`, "PUT", { activo: true })
      .then((data) => {
        Swal.fire({
          title: "¡Activado!",
          text: "El observatorio se ha sido reactivado correctamente.",
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
          traerObservatorios();
        }, 1000);
      })
      .catch((error) => console.error(error));
  }
};
const eliminarObservatorio = async (item) => {
  let id = item.raw.observatorio_id;
  let nombre = item.raw.nombre;

  const resultado = await Swal.fire({
    title: "Deshabilitar Observatorio",
    html: `¿Desea inhabilitar el observatorio <b> ${nombre} </b> ? No podrá acceder a este espacio después de hacerlo.`,
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

    peticionAPI(`/observatorios/${id}/`, "DELETE", data)
      .then((data) => {
        Swal.fire({
          title: "¡Eliminado!",
          text: "El elemento ha sido deshabilitado correctamente.",
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
          traerObservatorios();
        }, 1000);
      })
      .catch((error) => console.error(error));
  }
};

const diriguirseObservatorio = (item) => {
  observatorioStore.setObservatorio({
    id: item.raw.id,
    observatorio_id: item.raw.observatorio_id,
    nombre: item.raw.nombre,
    imagen: item.raw.imagen,
  });
  router.push(`/${item.raw.observatorio_id}/estructuras`);
};
onMounted(() => {
  traerObservatorios();
});
</script>

<style scoped>
.observatorios {
  width: 90%;
  margin: 40px auto;
}
.v-card-title {
  background-color: #ffffff;
}
</style>
