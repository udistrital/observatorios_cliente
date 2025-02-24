<template>
  <div class="observatorios">
    <div class="observatorios__cabecera">
      <h1 class="observatorios__titulo">Administración de Observatorios</h1>
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="crearObservario"
        >Crear Observatorio</v-btn
      >
    </div>
    <v-card>
      <div class="cabecera__tabla">
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h5">Observatorios</span>
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
        item-value="id"
        class="elevation-1"
      >
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
            @click="confirmarEliminacion(item)"
            color="primary"
            title="Ir al observatorio"
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
    >
      <crear-observatorio @cerrar="cerrarModal" />
    </v-dialog>
    <v-dialog
      v-model="_gestionObservatorio"
      scrollable
      max-width="500px"
      transition="dialog-transition"
    >
      <!-- <crear-observatorio @cerrar="cerrarModal" /> -->
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
import Swal from "sweetalert2";
const search = ref("");
const observatorios = ref([]);

const headers = ref([
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
  peticionAPI("observatorios/", "GET")
    .then((data) => {
      observatorios.value = data;
    })
    .catch((error) => console.error(error));
};

const cerrarModal = () => {
  console.log("si entra");
  _gestionObservatorio.value = false;
  _crearObservatorio.value = false;
  traerObservatorios();
};

const crearObservario = () => {
  console.log("Crear observatorio");
  _crearObservatorio.value = true;
};

const verObservatorio = (item) => {
  console.log("Ver:", item);
  _gestionObservatorio.value = true;
  _modo.value = false;
  datosObservatorio.value = item.raw;
};

const editarObservatorio = (item) => {
  console.log("Editar:", item);
  _gestionObservatorio.value = true;
  _modo.value = true;
  datosObservatorio.value = item.raw;
};

const reactivarObservatorio = async (item) => {
  let id = item.raw.id;
  let nombre = item.raw.nombre;
  // console.log(item);

  const resultado = await Swal.fire({
    title: "Reactivar Observatorio",
    html: `¿Está seguro de que desea reactivar el observatorio <b> ${nombre} </b> ?`,
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
  let id = item.raw.id;
  let nombre = item.raw.nombre;
  // console.log(item);

  const resultado = await Swal.fire({
    title: "Deshabilitar Observatorio",
    html: `¿Está seguro de que desea inhabilitar el observatorio <b> ${nombre} </b> ? No podrá acceder a este espacio después de hacerlo.`,
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
        console.log("Elemento eliminado");
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
          traerObservatorios();
        }, 1000);
      })
      .catch((error) => console.error(error));
  }
};

onMounted(() => {
  console.log("El componente ha sido montado.");
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
.observatorios__cabecera {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.observatorios__titulo {
  color: var(--color-acentuado);
  font-weight: 700;
  text-shadow: -1px -1px 2px rgba(0, 0, 0, 0.384);
}
.cabecera__tabla {
  display: flex;
  align-items: center;
  padding: 5px;
}
.buscador__tabla {
  max-width: 400px !important;
  padding-right: 20px;
}
</style>
