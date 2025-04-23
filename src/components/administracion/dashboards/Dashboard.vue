
<template>
    <div class="grafica-container">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h5">Gráficas de Observatorios</span>
        </v-card-title>
  
        <!-- Gráfico de barras: Puntuación por Edad -->
        <v-card-subtitle>Puntuación por Edad</v-card-subtitle>
        <BarChart :data="puntuacionEdadData" />
  
        <!-- Gráfico de pastel: Estado de los Observatorios (Activo/Inactivo) -->
        <v-card-subtitle>Estado de los Observatorios</v-card-subtitle>
        <DoughnutChart :data="estadoData" />
      </v-card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { Bar, Doughnut } from "vue-chartjs";
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from "chart.js";
  import peticionAPI from "../../../service/conexion_api"; // Asegúrate de que peticionAPI esté bien configurado
  
  // Registra los tipos de gráfico y los elementos de Chart.js
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);
  
  // Datos de ejemplo para las gráficas (inicializados vacíos)
  const puntuacionEdadData = ref({
    labels: [], // Rango de edades (vacío inicialmente)
    datasets: [
      {
        label: 'Promedio de Puntuación',
        backgroundColor: '#42A5F5', // Azul claro
        data: [], // Ejemplo de puntuaciones por grupo de edad (vacío inicialmente)
      }
    ]
  });
  
  const estadoData = ref({
    labels: ['Activo', 'Inactivo'],
    datasets: [
      {
        label: 'Estado',
        data: [0, 0], // 60% activo, 40% inactivo (vacío inicialmente)
        backgroundColor: ['#66BB6A', '#EF5350'], // Verde para activo, rojo para inactivo
        hoverOffset: 4,
      }
    ]
  });
  
  onMounted(() => {
    // Al montarse el componente, obtenemos los datos de la API
    fetchGraficaData();
  });
  
  // Función para hacer la petición a la API y obtener los datos
  const fetchGraficaData = async () => {
    try {
      const response = await peticionAPI("agregaciones/observatorios", "GET"); // Asegúrate de que la ruta sea correcta
      const data = response.data; // Suponemos que la respuesta tiene un formato similar al JSON mostrado anteriormente
  
      // Procesar los datos para el gráfico de barras (Puntuación por Edad)
      puntuacionEdadData.value.labels = Object.keys(data.age_groups); // Extrae los grupos de edad
      puntuacionEdadData.value.datasets[0].data = Object.values(data.age_groups); // Extrae las puntuaciones
  
      // Procesar los datos para el gráfico de pastel (Estado de los Observatorios)
      estadoData.value.datasets[0].data = [data.status.activo, data.status.inactivo]; // Asume que el estado tiene claves 'activo' e 'inactivo'
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