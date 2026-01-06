
<template>
    <div class="grafica-container">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h5">Gráficas de Observatorios</span>
        </v-card-title>
  
        <v-card-subtitle>Puntuación por Edad</v-card-subtitle>
        <BarChart :data="puntuacionEdadData" />
  
        <v-card-subtitle>Estado de los Observatorios</v-card-subtitle>
        <DoughnutChart :data="estadoData" />
      </v-card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { Bar, Doughnut } from "vue-chartjs";
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from "chart.js";
  import peticionAPI from "../../../service/conexion_api";
  
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

  const puntuacionEdadData = ref({
    labels: [],
    datasets: [
      {
        label: 'Promedio de Puntuación',
        backgroundColor: '#42A5F5',
        data: [],
      }
    ]
  });

  const estadoData = ref({
    labels: ['Activo', 'Inactivo'],
    datasets: [
      {
        label: 'Estado',
        data: [0, 0],
        backgroundColor: ['#66BB6A', '#EF5350'],
        hoverOffset: 4,
      }
    ]
  });
  
  onMounted(() => {
    fetchGraficaData();
  });
  
  const fetchGraficaData = async () => {
    try {
      const response = await peticionAPI("agregaciones/observatorios", "GET");
      const data = response.data;

      puntuacionEdadData.value.labels = Object.keys(data.age_groups);
      puntuacionEdadData.value.datasets[0].data = Object.values(data.age_groups);
  
      estadoData.value.datasets[0].data = [data.status.activo, data.status.inactivo];
    } catch (error) {
      console.error("Error al obtener los datos de las agregaciones:", error);
    }
  };
  </script>
  
  <script>
  export default {
    components: {
      BarChart: Bar,
      DoughnutChart: Doughnut,
    }
  };
  </script>
  
  <style scoped>
  .grafica-container {
    width: 100%;
    margin-top: 30px;
  }
  
  .v-card {
    padding: 20px;
  }
  </style>