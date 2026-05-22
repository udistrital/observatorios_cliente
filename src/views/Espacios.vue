<template>
  <section class="espacios-page">
    <article class="hero-card">
      <div class="hero-card__header">
        <span class="hero-card__label">Sistema de evidencias</span>
        <h1>Autoevaluación Institucional</h1>
      </div>

      <div class="hero-card__body">
        <div class="info-grid">
          <section class="info-card">
            <div class="info-card__icon">
              <v-icon size="24">mdi-information-outline</v-icon>
            </div>

            <div>
              <span class="info-card__label">¿Qué es?</span>
              <p>
                Es una herramienta que permite organizar documentos, registros,
                datos, indicadores, estadísticas y demás evidencias recopiladas
                por la Universidad para analizar y sistematizar la autoevaluación
                institucional.
              </p>
            </div>
          </section>

          <section class="info-card">
            <div class="info-card__icon info-card__icon--success">
              <v-icon size="24">mdi-shield-check-outline</v-icon>
            </div>

            <div>
              <span class="info-card__label">¿Para qué sirve?</span>
              <p>
                Permite respaldar los juicios de valor, organizar la información
                institucional, facilitar la verificación externa y demostrar el
                cumplimiento de estándares de calidad.
              </p>
            </div>
          </section>
        </div>
      </div>
    </article>

    <div class="section-header">
      <div>
        <span class="section-header__label">Listado</span>
        <h2>Factores de evaluación</h2>
      </div>

      <v-chip
        size="small"
        color="primary"
        variant="tonal"
        class="section-header__chip"
      >
        {{ factoresActivos.length }} activos
      </v-chip>
    </div>

    <v-skeleton-loader
      v-if="cargando"
      type="card, card, card"
      class="mt-4"
    />

    <v-alert
      v-if="!cargando && factoresActivos.length === 0"
      type="info"
      variant="tonal"
      class="mt-4"
    >
      No se encontraron factores activos.
    </v-alert>

    <div
      v-if="!cargando && factoresActivos.length > 0"
      class="espacios-grid"
    >
      <article
        v-if="esAdministrador"
        class="espacio-card espacio-card--admin"
        @click="verAdministracion"
      >
        <div class="espacio-card__top">
          <div class="espacio-card__icon espacio-card__icon--admin">
            <img src="../assets/img/logo-admin.png" alt="administración" />
          </div>

          <v-chip
            size="x-small"
            color="primary"
            variant="tonal"
          >
            Admin
          </v-chip>
        </div>

        <div class="espacio-card__content">
          <span class="espacio-card__label">Gestión</span>
          <h3>Administración</h3>
          <p>
            Gestionar factores, características, aspectos y estructuras de
            evidencias.
          </p>
        </div>

        <div class="espacio-card__footer">
          <span>Entrar</span>
          <v-icon size="18">mdi-arrow-right</v-icon>
        </div>
      </article>

      <article
        v-for="(factor, index) in factoresActivos"
        :key="factor.factor_id || factor.id || index"
        class="espacio-card"
        @click="dirigirseFactor(factor)"
      >
        <div class="espacio-card__top">
          <div class="espacio-card__icon">
            <v-icon size="30">mdi-format-list-bulleted</v-icon>
          </div>

          <v-chip
            size="x-small"
            color="success"
            variant="tonal"
          >
            Activo
          </v-chip>
        </div>

        <div class="espacio-card__content">
          <span class="espacio-card__label">
            {{ obtenerEtiquetaFactor(factor, index) }}
          </span>

          <h3>{{ factor.nombre }}</h3>

          <p>
            {{ obtenerDescripcionFactor(factor) }}
          </p>
        </div>

        <div class="espacio-card__footer">
          <span>Consultar</span>
          <v-icon size="18">mdi-arrow-right</v-icon>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

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

const mostrarCargandoFactores = () => {
  Swal.fire({
    title: "Cargando factores",
    text: "Consultando los factores de evaluación…",
    allowOutsideClick: false,
    allowEscapeKey: false,
    width: "340px",
    customClass: {
      popup: "popup-personalizado",
      title: "titulo-alerta-personalizado",
    },
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

const cerrarCargandoFactores = () => {
  Swal.close();
};

const esAdministrador = computed(() => {
  return roleUsuario.value.includes(ROL_ADMIN);
});

const factoresActivos = computed(() => {
  return factores.value.filter((factor) => factor.activo);
});

const verAdministracion = () => {
  router.push("/administracion/factores");
};

const traerFactores = async () => {
  cargando.value = true;
  factores.value = [];

  mostrarCargandoFactores();

  try {
    const data = await factoresService.listar();
    factores.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error al cargar factores:", error);
    factores.value = [];

    cerrarCargandoFactores();

    await Swal.fire({
      title: "Error",
      text: "No fue posible cargar los factores de evaluación.",
      icon: "error",
      width: "340px",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
      },
      buttonsStyling: false,
    });

    return;
  } finally {
    cargando.value = false;
    cerrarCargandoFactores();
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

const obtenerEtiquetaFactor = (factor, index) => {
  if (factor.numero) {
    return `Factor ${factor.numero}`;
  }

  const nombre = factor.nombre || "";

  const coincidencia = nombre.match(/factor\s*\d+/i);

  if (coincidencia) {
    return coincidencia[0];
  }

  return `Factor ${index + 1}`;
};

const obtenerDescripcionFactor = (factor) => {
  if (factor.descripcion) {
    return factor.descripcion;
  }

  const totalCaracteristicas = Array.isArray(factor.caracteristicas)
    ? factor.caracteristicas.length
    : 0;

  if (totalCaracteristicas > 0) {
    return `${totalCaracteristicas} característica(s) asociada(s) a este factor.`;
  }

  return "Consultar la información asociada a este factor de evaluación.";
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
.espacios-page {
  width: 94%;
  max-width: 1280px;
  margin: 16px auto 48px;
  font-family: Arial, Helvetica, sans-serif;
  color: #263238;
}

.hero-card {
  overflow: hidden;
  border: 1px solid #d7e1ef;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 6px 18px rgba(25, 55, 90, 0.08);
}

.hero-card__header {
  padding: 20px 24px;
  background: linear-gradient(135deg, #244f84 0%, #376aa3 100%);
  color: #ffffff;
}

.hero-card__label,
.section-header__label,
.info-card__label,
.espacio-card__label {
  display: block;
  margin-bottom: 4px;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-card__label {
  opacity: 0.86;
}

.hero-card__header h1 {
  margin: 0;
  font-size: 26px;
  font-weight: 900;
  line-height: 1.25;
}

.hero-card__body {
  padding: 16px;
  background: #ffffff;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.info-card {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  gap: 12px;
  min-height: 112px;
  padding: 14px 16px;
  border: 1px solid #d7e1ef;
  border-left: 5px solid #315f99;
  border-radius: 12px;
  background: #f7fbff;
}

.info-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 14px;
  background: #e7f1fa;
  color: #315f99;
}

.info-card__icon--success {
  background: #e6f5f0;
  color: #2e8b74;
}

.info-card__label {
  color: #607d9a;
}

.info-card p {
  margin: 0;
  color: #37474f;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.48;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 22px 0 12px;
  padding: 14px 18px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #f5f7fb;
}

.section-header h2 {
  margin: 0;
  color: #2f4774;
  font-size: 24px;
  font-weight: 900;
}

.section-header__label {
  color: #607d9a;
}

.section-header__chip {
  font-size: 11px;
  font-weight: 800;
}

.espacios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(245px, 1fr));
  gap: 16px;
  margin-top: 14px;
}

.espacio-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 210px;
  padding: 16px;
  border: 1px solid #d7e1ef;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 6px 18px rgba(25, 55, 90, 0.08);
  cursor: pointer;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
}

.espacio-card:hover {
  transform: translateY(-3px);
  border-color: #9ebbd6;
  box-shadow: 0 10px 24px rgba(25, 55, 90, 0.14);
}

.espacio-card--admin {
  border-left: 5px solid #315f99;
  background: #f7fbff;
}

.espacio-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.espacio-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 16px;
  background: #e7f1fa;
  color: #315f99;
}

.espacio-card__icon--admin {
  background: #ffffff;
  border: 1px solid #cfe0ef;
}

.espacio-card__icon--admin img {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.espacio-card__content {
  margin-top: 16px;
  min-width: 0;
}

.espacio-card__label {
  color: #607d9a;
}

.espacio-card h3 {
  display: -webkit-box;
  min-height: 44px;
  margin: 0 0 8px;
  overflow: hidden;
  color: #2f4774;
  font-size: 17px;
  font-weight: 900;
  line-height: 1.3;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.espacio-card p {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  color: #455a64;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.45;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.espacio-card__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
  color: #315f99;
  font-size: 12px;
  font-weight: 900;
}

@media (max-width: 900px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .espacios-grid {
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  }
}

@media (max-width: 600px) {
  .espacios-page {
    width: 92%;
  }

  .hero-card__header {
    padding: 18px;
  }

  .hero-card__header h1 {
    font-size: 22px;
  }

  .info-card {
    grid-template-columns: 1fr;
  }

  .espacios-grid {
    grid-template-columns: 1fr;
  }
}
</style>
