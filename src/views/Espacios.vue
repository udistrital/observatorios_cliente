<template>
  <div class="intro">
    <h1>¿ Qué es el Sistema de Evidencias de la Autoevaluación Institucional ?</h1>

    <div class="intro-box">
      <p>
        Es una herramienta que permite organizar de manera conjunta documentos,
        registros, datos, indicadores, estadísticas y demás pruebas que recopila
        la Universidad para analizar y sistematizar la autoevaluación institucional
        y posteriormente demostrar el cumplimiento de los estándares de calidad
        establecidos en el Acuerdo 01 de 2025 del CESU.
      </p>
    </div>

    <h1>¿ Cuáles son las funciones del Sistema de Evidencias de la Autoevaluación Institucional ?</h1>

    <div class="intro-box">
      <p>
        1. Respaldar la autoevaluación: garantiza que los juicios de valor de la institución se basan en pruebas verificables.<br />
        2. Servir de insumo de los procesos de autoevaluación de programas: provee información sistematizada del orden institucional requerida en los análisis que realizan los programas en sus procesos de autoevaluación.<br />
        3. Facilitar la verificación externa: sirve como fuente de consulta para los pares evaluadores o agencias acreditadoras.<br />
        4. Organizar la información institucional: centraliza documentos clave, estatutos, planes estratégicos, informes financieros, actas, encuestas de estudiantes y egresados, entre otros.<br />
        5. Dar transparencia: muestra la coherencia entre la misión, la gestión académica/administrativa y los resultados.
      </p>
    </div>
  </div>

  <div class="main-espacios">
    <div
      class="espacio elevation-5"
      @click="verAdministracion"
      v-if="esAdministrador"
    >
      <div class="espacio__item"></div>

      <figure class="espacio__img">
        <img src="../assets/img/logo-admin.png" alt="administración" />
      </figure>

      <h4 class="espacio__titulo">Administración</h4>
    </div>

    <div v-for="(factor, index) in factores" :key="factor.factor_id || factor.id || index">
      <div
        v-if="factor.activo"
        class="espacio elevation-5"
        @click="dirigirseFactor(factor)"
      >
        <figure class="espacio__icono-factor">
          <v-icon size="48" color="primary">mdi-format-list-bulleted</v-icon>
        </figure>

        <h4 class="espacio__titulo">{{ factor.nombre }}</h4>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

import { factoresService } from "@/service/factores.service";
import { useFactorStore } from "@/stores/factorStore";
import { useUserStore } from "@/stores/userStore";

const router = useRouter();

const userStore = useUserStore();
const factorStore = useFactorStore();

const factores = ref([]);
const roleUsuario = ref([]);
const cargando = ref(false);

const ROL_ADMIN = "ADMIN_OBSERVATORIOS";

const esAdministrador = computed(() => {
  return roleUsuario.value.includes(ROL_ADMIN);
});

const verAdministracion = () => {
  router.push("/administracion/factores");
};

const traerFactores = async () => {
  cargando.value = true;
  factores.value = [];

  try {
    const data = await factoresService.listar();
    factores.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error al cargar factores:", error);
    factores.value = [];
  } finally {
    cargando.value = false;
  }
};

const dirigirseFactor = (factor) => {
  const factorId = factor.factor_id || factor.id;

  factorStore.setFactor({
    id: factor.id,
    factor_id: factorId,
    nombre: factor.nombre,
    descripcion: factor.descripcion,
    calificacion: factor.calificacion,
    activo: factor.activo,
    numero: factor.numero,
    caracteristicas: Array.isArray(factor.caracteristicas)
      ? factor.caracteristicas
      : [],
  });

  if (esAdministrador.value) {
    router.push({
      name: "estructuras",
      params: {
        factor_id: factorId,
      },
    });
  } else {
    router.push({
      name: "estructurasVista",
      params: {
        factor_id: factorId,
      },
    });
  }
};

watch(
  () => userStore.user?.role,
  (nuevoRol) => {
    if (Array.isArray(nuevoRol) && nuevoRol.length) {
      roleUsuario.value = nuevoRol;
    }
  },
  { immediate: true }
);

onMounted(() => {
  traerFactores();
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

.intro-box p {
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
  object-fit: cover;
}

.espacio__icono-factor {
  height: 60px;
  width: 60px;
  border-radius: 50%;
  background-color: #eef4fb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.espacio__titulo {
  text-align: center;
  width: 90%;
}
</style>
