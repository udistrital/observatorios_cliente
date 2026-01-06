<template>
  <div class="intro">
    <h1>¿ Qué es el Sistema de Evidencias de la Autoevaluación Institucional ?</h1>
    <div class="intro-box">
      <p>Es una herramienta que permite organizar de manera conjunta documentos, registros, datos, indicadores, estadísticas y demás pruebas que recopila la Universidad
      para analizar y sistematizar la autoevaluación institucional y posteriormente demostrar el cumplimiento de los estándares de calidad establecidos en el Acuerdo 01de
      2025 del CESU.</p>
    </div>
    
    <h1>¿ Cuáles son las funciones del Sistema de Evidencias de la Autoevaluación Institucional ?</h1>
    <div class="intro-box">
      <p>
        1. Respaldar la autoevaluación: garantiza que los juicios de valor de la institución se basan en pruebas verificables.<br>
        2. Servir de insumo de los procesos de autoevaluación de programas: provee información sistematizad del orden institucional requerida en los análisis que realizan los
        programas en sus procesos de autoevaluación.<br>
        3. Facilitar la verificación externa: sirve como fuente de consulta para los pares evaluadores o agencias acreditadoras.<br>
        4. Organizar la información institucional: centraliza documentos clave (estatutos, planes estratégicos, informes financieros, actas, encuestas de estudiantes y egresados, etc.).<br>
        5. Dar transparencia: muestra la coherencia entre la misión, la gestión académica/administrativa y los resultados.
      </p>
    </div>
  </div>

  <div class="main-espacios">
    <div
      class="espacio elevation-5"
      @click="verAdministracion"
      v-if="roleUsuario.includes('ADMIN_OBSERVATORIOS')"
    >
      <div class="espacio__item"></div>
      <figure class="espacio__img">
        <img src="../assets/img/logo-admin.png" alt="administracion" />
      </figure>
      <h4 class="espacio__titulo">Administración</h4>
    </div>
    <div v-for="(espacio, index) in espacios" :key="index">
      <div
        v-if="espacio.activo"
        class="espacio elevation-5"
        @click="diriguirseObservatorio(espacio)"
      >
        <figure class="espacio__img">
          <img :src="espacio.imagen" alt="administracion" />
        </figure>
        <h4 class="espacio__titulo">{{ espacio.nombre }}</h4>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import espaciosData from "../data_prueba.json";
import { useRouter } from "vue-router";
import peticionAPI from "@/service/conexion_api";
import { useObservatorioStore } from "@/stores/observatorioStore";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
const observatorioStore = useObservatorioStore();
const router = useRouter();
const espacios = ref([]);
const observatorios = ref();
const roleUsuario = ref([""]);

const verAdministracion = () => {
  router.push("/administracion/observatorios");
};

const traerObservatorios = () => {
  espacios.value = [];
  peticionAPI("observatorios/", "GET")
    .then((data) => {
      espacios.value = data;
      localStorage.setItem(
        "observatorios_espacios",
        JSON.stringify(espacios.value)
      );
    })
    .catch((error) => console.error(error));
};

const diriguirseObservatorio = (item) => {
  observatorioStore.setObservatorio({
    id: item.id,
    nombre: item.nombre,
    descripcion: item.descripcion,
    observatorio_id: item.observatorio_id,
    imagen: item.imagen,
  });
  if (roleUsuario.value.includes('ADMIN_OBSERVATORIOS')) {
    router.push(`/${item.observatorio_id}/estructuras`);
  }else{
    router.push({
      name: "estructurasVista",
      params: { observatorio_id: item.observatorio_id },
    });
  }
};
watch(
  () => userStore.user?.role,
  (nuevoRol) => {
    if (nuevoRol?.length) {
      roleUsuario.value = nuevoRol;
    }
  },
  { immediate: true }
);
onMounted(() => {
  espacios.value = espaciosData.espacios;
  traerObservatorios();
});
</script>

<style scoped>
.intro {
  background-color: #335f97;
  color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 15px;
  margin-top: 15px;
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
.main-espacios {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-top: 0px;
  padding-bottom: 20px;
}
.espacio {
  height: 150px;
  width: 150px;
  border-radius: 8px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px;
  cursor: pointer;
}
.espacio__img img {
  height: 60px;
  width: 60px;
  border-radius: 50%;
}
.espacio__titulo {
  text-align: center;
  width: 90%;
}
</style>