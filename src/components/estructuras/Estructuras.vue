<template>
  <div class="intro">
    <h1>{{ observatorioStore.observatorio?.nombre }}</h1>
    <div class="intro-box">
      <p>{{ observatorioStore.observatorio?.descripcion }}</p>
    </div>
  </div>

  <div class="estructuras">
    <div class="cabecera">
      <h1 class="titulo__cabecera">Características</h1>
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="crearEstructura"
        >Crear Característica</v-btn
      >
    </div>
    <v-card>
      <div class="cabecera__tabla">
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h5">Características</span>
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
          <v-chip :color="item.columns.activo ? 'green' : 'red'" dark>
            {{ item.columns.activo ? "Activo" : "Inactivo" }}
          </v-chip>
        </template>

        <template v-slot:[`item.acciones_datos`]="{ item }">
          <v-btn
            variant="text"
            icon
            size="small"
            @click="verEstructura(item)"
            color="primary"
            title="Ver característica"
          >
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn
            variant="text"
            icon
            size="small"
            @click="editarEstructura(item)"
            color="primary"
            title="Editar característica"
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
            title="Eliminar característica"
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
            title="Reactivar característica"
          >
            <v-icon> mdi-sync</v-icon>
          </v-btn>
          <v-btn
            variant="text"
            icon
            size="small"
            @click="diriguirseEstructura(item)"
            color="primary"
            title="Ir a los datos"
          >
            <v-icon>mdi-database</v-icon>
          </v-btn>
        </template>

        <template v-slot:[`item.acciones_archivos`]="{ item }">
                    <v-btn
            variant="text"
            icon
            size="small"
            @click="verEstructuraArchivos(item)"
            color="green"
            title="Ver característica"
          >
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn
            variant="text"
            icon
            size="small"
            @click="editarEstructuraArchivos(item)"
            color="green"
            title="Editar característica"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            v-if="item.columns.activo"
            variant="text"
            icon
            size="small"
            @click="eliminarEstructura(item)"
            color="green"
            title="Eliminar característica"
          >
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
          <v-btn
            v-else
            variant="text"
            icon
            size="small"
            @click="reactivarEstructura(item)"
            color="green"
            title="Reactivar característica"
          >
            <v-icon> mdi-sync</v-icon>
          </v-btn>
          <v-btn
            variant="text"
            icon
            size="small"
            @click="diriguirseArchivos(item)"
            color="green"
            title="Ir a los archivos"
          >
            <v-icon>mdi-file-document-outline</v-icon>
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
  { title: "Acciones datos", key: "acciones_datos", sortable: false, align: "center" },
  { title: "Acciones archivos", key: "acciones_archivos", sortable: false, align: "center" },
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
      { observatorio: observatorioStore.observatorio?.observatorio_id }
    );

    console.log("data que llega :", data);

    estructuras.value = data.map((item) => ({
      ...item,
      tieneDatos: item.mapeo?.length > 0,
      tieneArchivos: item.mapeo_archivos?.length > 0,
    }));
  } catch (error) {
    console.error(error);
    Swal.fire(
      "Error",
      "No fue posible cargar las estructuras",
      "error"
    );
  } finally {
    cargando.value = false;
    Swal.close();
  }
  /*peticionAPI("campos/estructuras/", "GET", null,{'observatorio': observatorioStore.observatorio?.observatorio_id})
  .then((data) => {
    console.log("data que llega :", data);
    estructuras.value = data.map(item => ({
      ...item,
      tieneDatos: item.mapeo?.length > 0,
      tieneArchivos: item.mapeo_archivos?.length > 0,
    }));
    cargando.value = false;
    })
    .catch((error) => console.error(error));*/
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
  console.log("verEstructura :", item.raw);
  _gestionEstructura.value = true;
  _modo.value = false;
  datosEstructura.value = item.raw;
  console.log("_gestionEstructura.value :", _gestionEstructura.value);
  console.log("_modo.value :", _modo.value);
  console.log("datosEstructura.value :", datosEstructura.value);
};

const verEstructuraArchivos = (item) => {
  console.log("verEstructuraArchivos :", item.raw);

  _gestionEstructura.value = true;
  _modo.value = false;

  datosEstructura.value = {
    ...item.raw,
    tipo: 'archivos',
    mapeo_archivos: item.raw.mapeo_archivos
  };

  console.log("_gestionEstructura.value :", _gestionEstructura.value);
  console.log("_modo.value :", _modo.value);
  console.log("datosEstructura.value :", datosEstructura.value);
};

const editarEstructura = (item) => {
  _gestionEstructura.value = true;
  _modo.value = true;
  datosEstructura.value = item.raw;
  console.log("_gestionEstructura.value :", _gestionEstructura.value);
  console.log("_modo.value :", _modo.value);
  console.log("datosEstructura.value :", datosEstructura.value);
};

const editarEstructuraArchivos = (item) => {
  console.log("editarEstructuraArchivos :", item.raw);

  _gestionEstructura.value = true;
  _modo.value = true;

  datosEstructura.value = {
    ...item.raw,
    tipo: "archivos",
    mapeo_archivos: item.raw.mapeo_archivos
  };

  console.log("datosEstructura.value :", datosEstructura.value);
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
  console.log("item.raw :", item.raw);

  let id = item.raw.id;
  let nombre = item.raw.nombre;

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
    id: item.raw.id,
    nombre: item.raw.nombre,
    mapeo: item.raw.mapeo,
  });
  router.push(`/${observatorioStore.observatorio?.observatorio_id}/tablero`);
};
const diriguirseArchivos = (item) => {
  console.log("diriguirseArchivos item.raw :", item.raw);
  estructuraStore.setEstructura({
    id: item.raw.id,
    nombre: item.raw.nombre,
    mapeo: item.raw.mapeo,
    id_archivos: item.raw.id_archivos,
    mapeo_archivos: item.raw.mapeo_archivos
  });
  router.push(`/${observatorioStore.observatorio?.observatorio_id}/archivos`);
};
onMounted(async () => {
  await traerEstructuras();
});
</script>

<style scoped>
.intro {
  background-color: #335f97;
  color: #ffffff;
  padding: 8px;
  border-radius: 8px;
  margin-bottom: 8px;
  margin-top: 8px;
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;
}
.intro h1 {
  text-align: center;
  font-size: 26px;
  margin-bottom: 10px;
}
.intro-box {
  background-color: #ffffff;
  color: black;
  border: 2px solid black;
  padding: 15px;
  border-radius: 10px;
  margin-top: 10px;
  margin-bottom: 20px;
}
.intro-box p{
  font-size: 14px;
}
.estructuras {
  width: 90%;
  margin: 40px auto;
}
</style>