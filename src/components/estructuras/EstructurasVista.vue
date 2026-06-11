<template>
  <div class="intro">
    <h1>{{ factorStore.factor?.nombre }}</h1>
    <div class="intro-box">
      <p>{{ factorStore.factor?.descripcion }}</p>
    </div>
  </div>

  <div class="estructuras">
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

        <template v-slot:[`item.acciones`]="{ item }">
          <v-btn
            variant="text"
            icon
            size="small"
            @click="diriguirseEstructura(item)"
            color="primary"
            title="Ir a la característica"
          >
            <v-icon>mdi-arrow-top-right-thick</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Swal from "sweetalert2";
import { useEstructuraStore } from "@/stores/estructuraStore";
import { useFactorStore } from "@/stores/factorStore";
import { usePanelStore } from "@/stores/panelStore";
import { caracteristicasService } from "@/service/caracteristicas.service";
import { aspectosService } from "@/service/aspectos.service";
import { estructurasEvidenciasService } from "@/service/estructuras-evidencias.service";

const panelStore = usePanelStore();
const factorStore = useFactorStore();
const estructuraStore = useEstructuraStore();
const router = useRouter();
const route = useRoute();
const search = ref("");
const estructuras = ref([]);
const cargando = ref(false);

const headers = ref([
  { title: "Nombre", key: "nombre", align: "center" },
  { title: "Acciones", key: "acciones", sortable: false, align: "center" },
]);

const filteredObservatories = computed(() => {
  if (!search.value) return estructuras.value;
  return estructuras.value.filter((obs) =>
    obs.nombre.toLowerCase().includes(search.value.toLowerCase())
  );
});

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
    const factorId = route.params.factor_id || factorStore.factor?.factor_id || factorStore.factor?.id;
    const caracteristicas = (await caracteristicasService.listarPorFactor(factorId))
      .filter((caracteristica) => caracteristica.activo !== false);
    const aspectosPorCaracteristica = await Promise.all(
      caracteristicas.map((caracteristica) => aspectosService.listarPorCaracteristica(caracteristica.id))
    );
    const aspectos = aspectosPorCaracteristica
      .flat()
      .filter((aspecto) => aspecto.activo !== false);
    const estructurasPorAspecto = await Promise.all(
      aspectos.map((aspecto) => estructurasEvidenciasService.listarPorAspecto(aspecto.id))
    );

    estructuras.value = estructurasPorAspecto
      .flat()
      .filter((item) => item.activo !== false)
      .map((item) => ({
        ...item,
        factor: factorId,
        tieneDatos: item.tipo_evidencia === "Tabla",
        tieneArchivos: item.tipo_evidencia === "Documental",
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
};


const diriguirseEstructura = (item) => {
  estructuraStore.setEstructura({
    id: item.raw.id,
    nombre: item.raw.nombre,
    mapeo: item.raw.campos || item.raw.mapeo || [],
  });
  panelStore.setPanel({
    id: item.raw.id,
    idArchivos: item.raw.id_archivos || item.raw.id,
    nombreCaracteristica: item.columns.nombre,
    nombreFactor: factorStore.factor?.nombre,
    factor: item.raw.factor || route.params.factor_id,
  });
  router.push({
    name: route.params.proceso_id ? "factorCaracteristicaPrincipal" : "caracteristicaPrincipal",
    params: {
      ...(route.params.proceso_id ? { proceso_id: route.params.proceso_id } : {}),
      factor_id: route.params.factor_id || factorStore.factor?.factor_id || factorStore.factor?.id,
    },
  });
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
