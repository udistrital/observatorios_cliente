<template>
  <div class="paneles">
    <v-card>
      <div class="cabecera__tabla">
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
  { title: "Acciones", key: "acciones", sortable: false, align: "center" },
]);

const filteredObservatories = computed(() => {
  if (!search.value) return paneles.value;
  return paneles.value.filter((obs) =>
    obs.nombre.toLowerCase().includes(search.value.toLowerCase())
  );
});

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

const diriguirsePanel = (item) => {
  console.log("item.raw :", item.raw);
  console.log("item.raw.id :", item.raw.id);
  console.log("item.raw.nombre :", item.raw.nombre);
  console.log("item.raw.descripcion :", item.raw.descripcion);
  console.log("item.raw.observatorio :", item.raw.observatorio);
  console.log("item.raw.columnas :", item.raw.columnas);
  panelStore.setPanel({
    id: item.raw.id,
    nombreCaracteristica: item.raw.nombre,
    descripcion: item.raw.descripcion,
    nombreFactor: observatorioStore.observatorio.nombre,
    observatorio: item.raw.observatorio,
    columnas: item.raw.columnas,
  });
  //ESTABA ESTA 
  router.push(`panel/principal`);
  //router.push(`/${observatorioStore.observatorio?.observatorio_id}/caracteristica`);
};
onMounted(() => {
  traerPaneles();
  roleUsuario.value = userStore.user.role;
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