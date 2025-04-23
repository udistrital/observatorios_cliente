<template>
  <div>
    <ApexCharts
      type="pie"
      :width="width"
      :height="height"
      :series="series"
      :options="chartOptions"
      @dataPointSelection="handleDataPointClick"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import ApexCharts from "vue3-apexcharts";

const props = defineProps({
  data: {
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

const series = computed(() => props.data.metrica ?? []);

const labels = computed(() => {
  const str = props.data.etiquetas_as_string ?? [];
  const hasStr = str.some((e) => e !== null && e !== undefined);
  return hasStr
    ? str.map((e) => e ?? "Sin nombre")
    : props.data.etiquetas ?? [];
});

const chartOptions = computed(() => ({
  chart: {
    type: "pie",
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: true,
        customIcons: [],
      },
    },
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150,
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350,
      },
    },
    events: {
      dataPointSelection: (event, chartContext, config) => {
        console.log("Data point clicked:", config);
      },
    },
  },
  labels: labels.value,
  title: {
    text: props.title,
    align: "center",
    style: {
      fontSize: "20px",
      fontWeight: "bold",
    },
  },
  legend: {
    show: true,
    position: "bottom",
    fontSize: "14px",
    labels: {
      colors: undefined,
      useSeriesColors: false,
    },
    markers: {
      width: 12,
      height: 12,
    },
    itemMargin: {
      horizontal: 10,
      vertical: 5,
    },
  },
  tooltip: {
    enabled: true,
    y: {
      formatter: (val) => `${val.toFixed(2)} unidades`,
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (val, opts) => {
      const total = opts.w.globals.seriesTotals.reduce((a, b) => a + b, 0);
      const percentage = ((val / total) * 100).toFixed(1);
      return `${percentage}%`;
    },
    style: {
      fontSize: "14px",
      fontWeight: "bold",
    },
  },
  fill: {
    type: "gradient",
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["#fff"],
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 300,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
  yaxis: {
    title: {
      text: "Volor",
    },
    labels: {
      formatter: (val) => {
        return Number.isInteger(val) ? val : val.toFixed(3);
      },
      style: {
        fontSize: "12px",
      },
    },
  },

  colors: props.colors,
}));

const handleDataPointClick = (event, chartContext, config) => {
  const index = config.dataPointIndex;
  const label = labels.value[index];
  const value = series.value[index];
  console.log(`Se hizo clic en: ${label} (${value})`);
};
</script>
