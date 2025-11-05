<template>
  <div class="paneles">
    <div class="cabecera">
      <h1 class="titulo__cabecera">Paneles</h1>
      <v-spacer />
      <v-btn
        v-if="roleUsuario.includes('ADMIN_OBSERVATORIOS')"
        color="primary"
        prepend-icon="mdi-plus"
        @click="crearPanel"
        >Crear Panel</v-btn
      >
    </div>
    <v-card>
      <div class="cabecera__tabla">
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h5">Paneles</span>
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
              v-if="roleUsuario.includes('ADMIN_OBSERVATORIOS')"
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
              v-if="roleUsuario.includes('ADMIN_OBSERVATORIOS')"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <div v-if="roleUsuario.includes('ADMIN_OBSERVATORIOS')" class="">
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
  <!-- <router-view></router-view> -->
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import peticionAPI from "../../service/conexion_api";
import Swal from "sweetalert2";
import CrearPanel from "./CrearPanel.vue";
import PanelGestion from "./PanelGestion.vue";
import { useObservatorioStore } from "@/stores/observatorioStore";
import { usePanelStore } from "@/stores/panelStore";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
const panelStore = usePanelStore();
const observatorioStore = useObservatorioStore();
const router = useRouter();
const search = ref("");
const paneles = ref([]);
const cargando = ref(false);
const roleUsuario = ref("");

const headers = ref([
  { title: "Nombre", key: "nombre", align: "center" },
  { title: "Estado", key: "activo", align: "center" },
  { title: "Acciones", key: "acciones", sortable: false, align: "center" },
]);

const filteredObservatories = computed(() => {
  if (!search.value) return paneles.value;
  return paneles.value.filter((obs) =>
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
  _crearPanel.value = true;
};

const verPanel = (item) => {
  _gestionPanel.value = true;
  _modo.value = false;
  datosPanel.value = item.raw;
};

const editarPanel = (item) => {
  console.log("item :", item.raw);
  _gestionPanel.value = true;
  _modo.value = true;
  datosPanel.value = item.raw;
  console.log("datosPanel.value :", datosPanel.value);
};

const reactivarPanel = async (item) => {
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
  let id = item.raw.id;
  let nombre = item.raw.nombre;
  console.log("id :", id);
  console.log("nombre :", nombre);

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
  console.log("item.raw :", item.raw);
  console.log("item.raw.id :", item.raw.id);
  console.log("item.raw.nombre :", item.raw.nombre);
  console.log("item.raw.descripcion :", item.raw.descripcion);
  console.log("item.raw.observatorio :", item.raw.observatorio);
  console.log("item.raw.columnas :", item.raw.columnas);
  panelStore.setPanel({
    id: item.raw.id,
    nombre: item.raw.nombre,
    descripcion: item.raw.descripcion,
    observatorio: item.raw.observatorio,
    columnas: item.raw.columnas,
  });

  router.push(`panel/principal`);
};
onMounted(() => {
  traerPaneles();
  roleUsuario.value = userStore.user.role;
});
</script>

<style scoped>
.paneles {
  width: 90%;
  margin: 40px auto;
}
.accionesContainer{
  display: flex;
  justify-content: center;
}
</style>