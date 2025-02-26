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
            v-if="item.columns.activo"
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
      max-height="90vh"
      transition="dialog-transition"
    >
      <CrearEstructura @cerrar="cerrarModal" />
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import peticionAPI from "../../service/conexion_api";
import Swal from "sweetalert2";
import CrearEstructura from "./CrearEstructura.vue";
const router = useRouter();
const search = ref("");
const estructuras = ref([]);

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
  peticionAPI("campos/estructuras/", "GET")
    .then((data) => {
      console.log(data);
      
      estructuras.value = data;
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
  _gestionEstructura.value = true;
  _modo.value = false;
  datosEstructura.value = item.raw;
};

const editarEstructura = (item) => {
  _gestionEstructura.value = true;
  _modo.value = true;
  datosEstructura.value = item.raw;
};

const reactivarEstructura = async (item) => {
  let id = item.raw.id;
  let nombre = item.raw.nombre;

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
  let id = item.raw.id;
  let nombre = item.raw.nombre;

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
  router.push("/estructuras");
  localStorage.setItem('observatorio', item.raw.id)
  localStorage.setItem('observatorio_imagen', item.raw.imagen)
  localStorage.setItem('observatorio_nombre', item.raw.nombre)
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