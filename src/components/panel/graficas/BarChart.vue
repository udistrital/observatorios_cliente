<template>
  <div>
    <ApexCharts
      type="bar"
      :width="width"
      :height="height"
      :series="series"
      :options="chartOptions"
      @dataPointSelection="handleBarClick"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ApexCharts from 'vue3-apexcharts'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  width: {
    type: [Number, String],
    default: 700,
  },
  height: {
    type: [Number, String],
    default: 450,
  },
  colors: {
    type: Array,
    default: () => ['#008FFB'],
  },
  seriesName: {
    type: String,
    default: 'Valor',
  },
  horizontal: {
    type: Boolean,
    default: false,
  },
})

const categories = computed(() => {
  const str = props.data.etiquetas_as_string ?? []
  const hasStr = str.some(e => e !== null && e !== undefined)
  return hasStr ? str.map(e => e ?? 'Sin nombre') : props.data.etiquetas ?? []
})

const series = computed(() => [
  {
    name: props.seriesName,
    data: props.data.metrica ?? [],
  },
])

const decimalFormatter = val => {
  return Number.isInteger(val) ? val : Number(val).toFixed(3)
}

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: {
      show: true,
    },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 500,
    },
    events: {
      dataPointSelection: (event, chartContext, config) => {
        console.log('Bar clicked:', config)
      },
    },
  },
  title: {
    text: props.title,
    align: 'center',
    style: {
      fontSize: '20px',
      fontWeight: 'bold',
    },
  },
  xaxis: {
    categories: props.horizontal ? undefined : categories.value,
    title: {
      text: props.horizontal ? 'Valor' : 'Categorías',
    },
    labels: props.horizontal
      ? {
          formatter: decimalFormatter,
        }
      : {},
  },
  yaxis: {
    title: {
      text: props.horizontal ? 'Categorías' : 'Valor',
    },
    labels: !props.horizontal
      ? {
          formatter: decimalFormatter,
        }
      : {},
  },
  tooltip: {
    enabled: true,
    y: {
      formatter: val => `${decimalFormatter(val)} unidades`,
    },
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: props.horizontal,
      dataLabels: {
        position: props.horizontal ? 'right' : 'top',
      },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: val => decimalFormatter(val),
    style: {
      fontSize: '12px',
      colors: ['#333'],
    },
  },
  legend: {
    show: true,
    position: 'top',
  },
  colors: props.colors,
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 300,
        },
        legend: {
          position: 'bottom',
        },
      },
    },
  ],
}))
  
// Evento clic
const handleBarClick = (event, chartContext, config) => {
  const index = config.dataPointIndex
  const label = categories.value[index]
  const value = props.data.metrica[index]
  console.log(`Barra clickeada: ${label} (${value})`)
}
</script>
