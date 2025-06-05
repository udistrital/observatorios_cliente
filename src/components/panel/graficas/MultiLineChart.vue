<template>
    <div>
      <ApexCharts
        type="line"
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
    return props.data?.metrica
  });
  
  const categories = computed(() => {
    return  props.data?.etiquetas;
  });
  
  const chartOptions = computed(() => ({
    chart: {
      type: "line",
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
        },
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 700,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 300,
        },
      },
    },
    title: {
      text: props.title,
      align: "center",
      style: {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
    xaxis: {
      categories: categories.value,
      labels: {
        style: {
          fontSize: "12px",
        },
      },
      title: {
        text: "Categorías",
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => (Number.isInteger(val) ? val : val.toFixed(2)),
        style: {
          fontSize: "12px",
        },
      },
      title: {
        text: "Valores",
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val) => `${val.toFixed(2)} unidades`,
      },
    },
    legend: {
      show: true,
      position: "bottom",
      fontSize: "14px",
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    markers: {
      size: 5,
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
            position: "bottom",
          },
        },
      },
    ],
  }));
  
  const handleDataPointClick = (event, chartContext, config) => {
    const seriesIndex = config.seriesIndex;
    const dataIndex = config.dataPointIndex;
    const label = categories.value[dataIndex];
    const value = series.value[seriesIndex]?.data?.[dataIndex];
    console.log(`Click en: ${label} (${value})`);
  };
  </script>