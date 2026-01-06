<template>
    <div>
        <apexchart
            type="heatmap"
            :options="chartOptions"
            :series="series"
            :width="width"
            :height="height"
        />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
    metadata : {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    width: {
      type: [String, Number],
      default: 600,
    },
    height: {
      type: [String, Number],
      default: 400,
    },
    colors: {
      type: Array,
      default: () => ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0"],
    },
  });

const series = computed(() => {
    return props.data?.series
  });

  
const chartOptions = ref({
    chart: {
        toolbar: { show: false }
    },
    dataLabels: {
        enabled: false
    },
    colors: props.colors,
    title: {
        text: 'Simple HeatMap'
    }
})
</script>

<script>
export default {
    components: {
        apexchart: VueApexCharts
    }
}
</script>
