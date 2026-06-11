<template>
  <div class="intro">
    <h1>{{ observatorioStore.observatorio?.nombre }}</h1>
    <div class="intro-box">
      <p>{{ observatorioStore.observatorio?.descripcion }}</p>
    </div>
  </div>

  <div class="paneles">
    <div class="cabecera">
      <v-spacer />
      <v-btn
        v-if="esAdministrador"
        color="primary"
        prepend-icon="mdi-plus"
        @click="crearPanel"
        >Crear Panel</v-btn
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
        <template v-slot:[`item.activo`]="{ item }">
          <v-chip :color="item.columns.activo ? 'green' : 'red'" dark>
            {{ item.columns.activo ? "Activo" : "Inactivo" }}
          </v-chip>
        </template>

        <template v-slot:[`item.acciones`]="{ item }">
          <div class="accionesContainer">
            <v-btn
              variant="text"
              icon
              size="small"
              @click="verPanel(item)"
              color="primary"
              title="Ver panel"
              v-if="esAdministrador"
            >
              <v-icon>mdi-eye</v-icon>
            </v-btn>
            <v-btn
              variant="text"
              icon
              size="small"
              @click="editarPanel(item)"
              color="primary"
              title="Editar panel"
              v-if="esAdministrador"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <div v-if="esAdministrador" class="">
              <v-btn
                v-if="item.columns.activo"
                variant="text"
                icon
                size="small"
                @click="eliminarPanel(item)"
                color="primary"
                title="Eliminar panel"
              >
                <v-icon>mdi-trash-can</v-icon>
              </v-btn>
              <v-btn
                v-else
                variant="text"
                icon
                size="small"
                @click="reactivarPanel(item)"
                color="primary"
                title="Reactivar panel"
              >
                <v-icon> mdi-sync</v-icon>
              </v-btn>
            </div>
            <v-btn
              variant="text"
              icon
              size="small"
              @click="diriguirsePanel(item)"
              color="primary"
              title="Ir al panel"
            >
              <v-icon>mdi-arrow-top-right-thick</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="_crearPanel"
      scrollable
      max-width="500px"
      max-height="70vh"
      transition="dialog-transition"
    >
      <CrearPanel @cerrar="cerrarModal" />
    </v-dialog>
    <v-dialog
      v-model="_gestionPanel"
      scrollable
      max-width="500px"
      max-height="70vh"
      transition="dialog-transition"
    >
      <PanelGestion
        :panelData="datosPanel"
        :value="_modo"
        @cerrar="cerrarModal"
      />
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import peticionAPI from "../../service/conexion_api";
import Swal from "sweetalert2";
import CrearPanel from "./CrearPanel.vue";
import PanelGestion from "./PanelGestion.vue";
import { useObservatorioStore } from "@/stores/observatorioStore";
import { usePanelStore } from "@/stores/panelStore";
import { useUserStore } from "@/stores/userStore";
import { esAdminObservatorios } from "@/utils/roles";

const userStore = useUserStore();
const panelStore = usePanelStore();
const observatorioStore = useObservatorioStore();
const router = useRouter();
const route = useRoute();
const search = ref("");
const paneles = ref([]);
const cargando = ref(false);
const esAdministrador = computed(() => esAdminObservatorios(userStore.user?.role));

const headers = ref([
  { title: "Nombre", key: "nombre", align: "center" },
  { title: "Estado", key: "activo", align: "center" },
  { title: "Acciones", key: "acciones", sortable: false, align: "center" },
]);

const filteredObservatories = computed(() => {
  const panelesVisibles = esAdministrador.value
    ? paneles.value
    : paneles.value.filter((panel) => panel.activo !== false);

  if (!search.value) return panelesVisibles;
  return panelesVisibles.filter((obs) =>
    obs.nombre.toLowerCase().includes(search.value.toLowerCase())
  );
});

const _crearPanel = ref(false);
const _gestionPanel = ref(false);
const _modo = ref(false);

const datosPanel = ref({});

const traerPaneles = () => {
  cargando.value = true;
  peticionAPI("dashboards/", "GET", null, {
    observatorio: observatorioStore.observatorio?.id,
  })
    .then((data) => {
      paneles.value = data;
      cargando.value = false;
    })
    .catch((error) => console.error(error));
};

const cerrarModal = () => {
  setTimeout(() => {
    traerPaneles();
  }, 2000);
  _gestionPanel.value = false;
  _crearPanel.value = false;
};

const crearPanel = () => {
  if (!esAdministrador.value) return;
  _crearPanel.value = true;
};

const verPanel = (item) => {
  _gestionPanel.value = true;
  _modo.value = false;
  datosPanel.value = item.raw;
};

const editarPanel = (item) => {
  if (!esAdministrador.value) return;

  _gestionPanel.value = true;
  _modo.value = true;
  datosPanel.value = item.raw;
};

const reactivarPanel = async (item) => {
  if (!esAdministrador.value) return;

  let id = item.raw.id;
  let nombre = item.raw.nombre;
  const resultado = await Swal.fire({
    title: "Reactivar Panel",
    html: `¿Desea reactivar el panel <b> ${nombre} </b> ?`,
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

    peticionAPI(`dashboards/${id}/`, "PUT", { activo: true })
      .then((data) => {
        Swal.fire({
          title: "¡Guardado!",
          text: "El panel se ha actualizado correctamente.",
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
          traerPaneles();
        }, 1000);
      })
      .catch((error) => console.error(error));
  }
};
const eliminarPanel = async (item) => {
  if (!esAdministrador.value) return;

  let id = item.raw.id;
  let nombre = item.raw.nombre;

  const resultado = await Swal.fire({
    title: "Deshabilitar Panel",
    html: `¿Desea inhabilitar la panel <b> ${nombre} </b> ? `,
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

    peticionAPI(`dashboards/${id}/`, "DELETE", data)
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
          traerPaneles();
        }, 1000);
      })
      .catch((error) => console.error(error));
  }
};
const diriguirsePanel = (item) => {
  panelStore.setPanel({
    id: item.raw.id,
    nombreCaracteristica: item.raw.nombre,
    descripcion: item.raw.descripcion,
    nombreFactor: observatorioStore.observatorio.nombre,
    observatorio: item.raw.observatorio,
    columnas: item.raw.columnas,
  });
  router.push({
    name: route.params.proceso_id ? "factorPanelPrincipal" : "panelPrincipal",
    params: route.params.proceso_id
      ? { proceso_id: route.params.proceso_id, factor_id: route.params.factor_id }
      : { factor_id: route.params.factor_id },
  });
};
onMounted(() => {
  traerPaneles();
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
.paneles {
  width: 90%;
  margin: 1px auto;
}
.accionesContainer{
  display: flex;
  justify-content: center;
}
</style>
