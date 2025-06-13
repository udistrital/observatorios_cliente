<template>
    <div class="muestra__grafica" v-if="cargada">
        <PieChart v-if="tipoVisualizacion == 'pie'" :data="datosGrafica.data" :title="nombreGrafica" />
        <BarChart v-if="tipoVisualizacion == 'barras'" :data="datosGrafica.data" :title="nombreGrafica"/>
    </div>

</template>
<script setup>
// export default {};
import { ref, computed, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import peticionAPI from "@/service/conexion_api";
import Swal from "sweetalert2";
import { useObservatorioStore } from "@/stores/observatorioStore";
import PieChart from "./PieChart.vue";
import BarChart from "./BarChart.vue";
import { usePanelStore } from '@/stores/panelStore';

const props = defineProps({
  grafico: Number,
});


const panelStore = usePanelStore();
const observatorioStore = useObservatorioStore();
const tipoGrafica = ref("");
const nombreGrafica = ref("");
const estructuraSeleccionada = ref("");
const configuracionGrafica = ref({});
const cargando = ref(false);
const estructuras = ref([]);
const formValues = ref({});
const camposConfig = ref([]);
const campoConfigSeleccionado = ref({});
const datosGrafica = ref({})

const verificar = ref(false)
const tipoVisualizacion = ref('')
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

const traerConfiguracion = () => {
  peticionAPI("constructor_graficos/configuracion_grafico/", "GET", null, {
    tipo: tipoGrafica.value,
  })
    .then((data) => {
      configuracionGrafica.value = data;
    })
    .catch((error) => console.error(error));
};
const traerCamposSugeridos = (campoTipo) => {
  peticionAPI("constructor_graficos/campos_sugeridos", "GET", null, {
    estructura: estructuraSeleccionada.value,
    operacion: formValues.value[campoTipo],
  })
    .then((data) => {
      camposConfig.value[campoTipo] = data.campos_recomendados;
    })
    .catch((error) => console.error(error));
};
const cargarGrafica = () => {
  cargando.value = true;
  peticionAPI("campos/estructuras/", "GET", null, {
    observatorio: observatorioStore.observatorio?.id,
  })
    .then((data) => {
      estructuras.value = data;
      cargando.value = false;
    })
    .catch((error) => console.error(error));
};





onMounted(() => {
  
});
</script>

<style scoped>
.main__creargrafica {
  background-color: #f0f0f0;
  height: 70vh;
  display: flex;
  justify-content: space-between;
}
.textfield__control {
  margin: 10px 0;
}
.campos__configuracion {
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  box-shadow: inset 0px 5px 15px -3px rgba(0, 0, 0, 0.1);
}
.creargrafica__container {
  background-color: rgb(246, 246, 246);
  width: 68%;
  min-height: 20px;
}
.creargrafica__formulario {
  width: 30%;
  min-height: 20px;
}
.muestra__grafica{
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
