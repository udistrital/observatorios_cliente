<template>
  <div class="pie-chart-container">
    <apexchart
      type="pie"
      height="350"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

const series = ref([44, 55, 13, 43, 22]);
const chartOptions = ref({
  chart: {
    type: 'pie',
    foreColor: 'var(--color-primario)',
  },
  labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
  colors: [
    'var(--color-primario)',
    'var(--color-secundario)',
    'var(--color-acentuado)',
    'var(--color-claro)',
    'var(--color-oscuro)'
  ],
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: '100%'
      },
      legend: {
        position: 'bottom'
      }
    }
  }],
  tooltip: {
    theme: 'dark',
    y: {
      formatter: function(value) {
        return value + '%';
      }
    }
  }
});
</script>

<style scoped>
.pie-chart-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-claro);
  border-radius: 4px;
  padding: 1rem;
}
</style>