<template>
  <div class="estructuras">
    <div class="cabecera">
      <h1 class="titulo__cabecera">Estructuras</h1>
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="crearEstructura"
        >Crear Estructura</v-btn
      >
    </div>
    <v-card>
      <div class="cabecera__tabla">
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h5">Estructuras</span>
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
        <template v-slot:item.activo="{ item }">
          <v-chip :color="item.activo ? 'green' : 'red'" dark>
            {{ item.activo ? "Activo" : "Inactivo" }}
          </v-chip>
        </template>

        <template v-slot:[`item.acciones`]="{ item }">
          <v-btn
            variant="text"
            icon
            size="small"
            @click="verEstructura(item)"
            color="primary"
            title="Ver estructura"
          >
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn
            variant="text"
            icon
            size="small"
            @click="editarEstructura(item)"
            color="primary"
            title="Editar estructura"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            v-if="item.activo"
            variant="text"
            icon
            size="small"
            @click="eliminarEstructura(item)"
            color="primary"
            title="Eliminar estructura"
          >
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
          <v-btn
            v-else
            variant="text"
            icon
            size="small"
            @click="reactivarEstructura(item)"
            color="primary"
            title="Reactivar estructura"
          >
            <v-icon> mdi-sync</v-icon>
          </v-btn>
          <v-btn
            variant="text"
            icon
            size="small"
            @click="diriguirseEstructura(item)"
            color="primary"
            title="Ir a la estructura"
          >
            <v-icon>mdi-arrow-top-right-thick</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="_crearEstructura"
      scrollable
      max-width="500px"
      max-height="70vh"
      transition="dialog-transition"
    >
      <CrearEstructura @cerrar="cerrarModal" />
    </v-dialog>
    <v-dialog
      v-model="_gestionEstructura"
      scrollable
      max-width="500px"
      max-height="70vh"
      transition="dialog-transition"
    >
      <EstructuraGestion
        :estructuraData="datosEstructura"
        :value="_modo"
        @cerrar="cerrarModal"
      />
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import peticionAPI from "../../service/conexion_api";
import Swal from "sweetalert2";
import CrearEstructura from "./CrearEstructura.vue";
import EstructuraGestion from "./EstructuraGestion.vue";
import { useEstructuraStore } from "@/stores/estructuraStore";
import { useObservatorioStore } from "@/stores/observatorioStore";

const observatorioStore = useObservatorioStore();
const estructuraStore = useEstructuraStore();
const router = useRouter();
const search = ref("");
const estructuras = ref([]);
const cargando = ref(false);

const headers = ref([
  { title: "Nombre", key: "nombre", align: "center" },
  { title: "Estado", key: "activo", align: "center" },
  { title: "Acciones", key: "acciones", sortable: false, align: "center" },
]);

const filteredObservatories = computed(() => {
  if (!search.value) return estructuras.value;
  return estructuras.value.filter((obs) =>
    obs.nombre.toLowerCase().includes(search.value.toLowerCase())
  );
});

const _crearEstructura = ref(false);
const _gestionEstructura = ref(false);
const _modo = ref(false);

const datosEstructura = ref({});

const traerEstructuras = () => {
  cargando.value = true;
  peticionAPI("campos/estructuras/", "GET", null,{'observatorio': observatorioStore.observatorio?.observatorio_id})
  .then((data) => {
    console.log("data que llega :", data);
    estructuras.value = data;
    cargando.value = false;
    })
    .catch((error) => console.error(error));
};

const cerrarModal = () => {
  setTimeout(() => {
    traerEstructuras();
  }, 2000);
  _gestionEstructura.value = false;
  _crearEstructura.value = false;
};

const crearEstructura = () => {
  _crearEstructura.value = true;
};

const verEstructura = (item) => {
  console.log("verEstructura :", item);
  _gestionEstructura.value = true;
  _modo.value = false;
  datosEstructura.value = item;
  console.log("_gestionEstructura.value :", _gestionEstructura.value);
  console.log("_modo.value :", _modo.value);
  console.log("datosEstructura.value :", datosEstructura.value);
};

const editarEstructura = (item) => {
  _gestionEstructura.value = true;
  _modo.value = true;
  datosEstructura.value = item;
  console.log("_gestionEstructura.value :", _gestionEstructura.value);
  console.log("_modo.value :", _modo.value);
  console.log("datosEstructura.value :", datosEstructura.value);
};

const reactivarEstructura = async (item) => {
  let id = item.id;
  let nombre = item.nombre;
  const resultado = await Swal.fire({
    title: "Reactivar Estructura",
    html: `¿Desea reactivar la estructura <b> ${nombre} </b> ?`,
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

    peticionAPI(`/campos/estructuras/${id}/`, "PUT", { activo: true })
      .then((data) => {
        Swal.fire({
          title: "¡Activado!",
          text: "La estructura se ha sido reactivado correctamente.",
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
          traerEstructuras();
        }, 1000);
      })
      .catch((error) => console.error(error));
  }
};
const eliminarEstructura = async (item) => {
  console.log("item item :", item);

  let id = item.id;
  let nombre = item.nombre;

  console.log("id :", id);
  console.log("nombre :", nombre);

  const resultado = await Swal.fire({
    title: "Deshabilitar Estructura",
    html: `¿Desea inhabilitar la estructura <b> ${nombre} </b> ? `,
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

    peticionAPI(`/campos/estructuras/${id}/`, "DELETE", data)
      .then((data) => {
        Swal.fire({
          title: "¡Deshabilitado!",
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
          traerEstructuras();
        }, 1000);
      })
      .catch((error) => console.error(error));
  }
};
const diriguirseEstructura = (item) => {
  estructuraStore.setEstructura({
    id: item.id,
    nombre: item.nombre,
    mapeo: item.mapeo,
  });
  router.push(`/${observatorioStore.observatorio?.observatorio_id}/tablero`);
};
onMounted(() => {
  traerEstructuras();
});
</script>

<style scoped>
.estructuras {
  width: 90%;
  margin: 40px auto;
}
</style>