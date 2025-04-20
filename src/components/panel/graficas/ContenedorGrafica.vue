<template>
    <div class="grafico-contenedor">
      <div v-if="cargando" class="loader">Cargando gráfico...</div>
  
      <div v-else-if="error" class="error">
        Error al cargar el gráfico: {{ error }}
      </div>
  
      <div v-else class="grafico-datos">
        <PieChart v-if="tipo == 'pie'" :data="datosGrafica.data" :title="nombreGrafica" />
        <BarChart v-if="tipo == 'barras'" :data="datosGrafica.data" :title="nombreGrafica"/>
        <LineChart v-if="tipo == 'linea'" :data="datosGrafica.data" :title="nombreGrafica" :metadata="datosGrafica.grafico_metadata"/>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import peticionAPI from "@/service/conexion_api";
  import PieChart from "./PieChart.vue";
  import BarChart from "./BarChart.vue";
  import LineChart from "./LineChart.vue";
  
  const props = defineProps({
    dashboardId: {
      type: String,
      required: true,
    },
    graficoId: {
      type: String,
      required: true,
    },
    tipo : {
      type: String,
      required: true,
    },
    nombreGrafica: {
      type: String,
      default: 'Gráfico',
    },	
  });
  
  const cargando = ref(true);
  const error = ref(null);
  const datosGrafica = ref({});
  
  onMounted(async () => {
    try {
      const response = await peticionAPI(`/graficos/${props.dashboardId}/${props.graficoId}/construir`);
      datosGrafica.value = response;
    } catch (err) {
      console.error(err);
      error.value = err.message || 'Error desconocido';
    } finally {
      cargando.value = false;
    }
  });
  </script>
  
  <style scoped>
  .grafico-contenedor {
    /* border: 1px solid #ccc; */
    padding: 10px;
  }
  .loader {
    color: #888;
  }
  .error {
    color: red;
  }
  </style>