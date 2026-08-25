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
              <v-icon size="24">mdi-sitemap-outline</v-icon>
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
        <h2>Procesos institucionales</h2>
      </div>

      <div class="section-header__actions">
        <v-chip size="small" color="primary" variant="tonal" class="section-header__chip">
          {{ procesosActivos.length }} activos
        </v-chip>

        <v-text-field
          v-model="search"
          class="buscador__procesos"
          append-inner-icon="mdi-magnify"
          label="Buscar proceso"
          variant="outlined"
          density="compact"
          hide-details
        />

        <v-btn
          v-if="esAdministrador"
          color="primary"
          prepend-icon="mdi-plus"
          @click="abrirCrearProceso"
        >
          Crear Proceso
        </v-btn>
      </div>
    </div>

    <v-skeleton-loader v-if="cargando" type="card, card, card" class="mt-4" />

    <v-alert
      v-if="!cargando && procesosFiltrados.length === 0"
      type="info"
      variant="tonal"
      class="mt-4"
    >
      No se encontraron procesos activos.
      <span v-if="esAdministrador">Puede crear un proceso desde este panel.</span>
    </v-alert>

    <div v-if="!cargando && procesosFiltrados.length > 0" class="espacios-grid">
      <article
        v-for="(proceso, index) in procesosFiltrados"
        :key="proceso.proceso_id || proceso.id || index"
        class="espacio-card"
        :class="{ 'espacio-card--inactive': proceso.activo === false }"
        @click="proceso.activo !== false && dirigirseProceso(proceso)"
      >
        <div class="espacio-card__top">
          <div class="espacio-card__icon">
            <v-icon size="30">mdi-clipboard-text-outline</v-icon>
          </div>

          <v-chip
            size="x-small"
            :color="proceso.activo === false ? 'error' : 'success'"
            variant="tonal"
          >
            {{ proceso.activo === false ? "Inactivo" : "Activo" }}
          </v-chip>
        </div>

        <div class="espacio-card__content">
          <span class="espacio-card__label">{{ obtenerEtiquetaProceso(proceso, index) }}</span>
          <h3>{{ proceso.nombre }}</h3>
          <p>{{ obtenerDescripcionProceso(proceso) }}</p>
        </div>

        <div v-if="proceso.dependencia_responsable || proceso.fecha_inicio || proceso.fecha_fin" class="espacio-card__meta">
          <span v-if="proceso.dependencia_responsable">
            <v-icon size="14">mdi-domain</v-icon>
            {{ proceso.dependencia_responsable }}
          </span>
          <span v-if="proceso.fecha_inicio || proceso.fecha_fin">
            <v-icon size="14">mdi-calendar-range</v-icon>
            {{ proceso.fecha_inicio || "Sin inicio" }} - {{ proceso.fecha_fin || "Sin fin" }}
          </span>
        </div>

        <div class="espacio-card__footer" @click.stop>
          <div v-if="esAdministrador" class="espacio-card__crud">
            <v-btn variant="text" icon size="small" color="primary" title="Ver proceso" @click="verProceso(proceso)">
              <v-icon>mdi-eye</v-icon>
            </v-btn>
            <v-btn variant="text" icon size="small" color="primary" title="Editar proceso" @click="editarProceso(proceso)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              v-if="proceso.activo !== false"
              variant="text"
              icon
              size="small"
              color="primary"
              title="Desactivar proceso"
              @click="desactivarProceso(proceso)"
            >
              <v-icon>mdi-cancel</v-icon>
            </v-btn>
            <v-btn
              v-else
              variant="text"
              icon
              size="small"
              color="primary"
              title="Reactivar proceso"
              @click="reactivarProceso(proceso)"
            >
              <v-icon>mdi-sync</v-icon>
            </v-btn>
          </div>

          <v-btn
            v-if="proceso.activo !== false"
            variant="text"
            color="primary"
            append-icon="mdi-arrow-right"
            @click="dirigirseProceso(proceso)"
          >
            Factores
          </v-btn>
        </div>
      </article>
    </div>

    <ProcesoFormDialog
      ref="procesoFormDialogRef"
      :puede-editar-orden="esAdministrador"
      @proceso-guardado="traerProcesos"
    />
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { ordenarPorOrden } from "@/utils/orden";

import ProcesoFormDialog from "@/components/procesos/ProcesoFormDialog.vue";
import { procesosService } from "@/service/procesos.service";
import { useUserStore } from "@/stores/userStore";
import { esAdminObservatorios, normalizarRoles } from "@/utils/roles";

const router = useRouter();
const userStore = useUserStore();

const procesos = ref([]);
const roleUsuario = ref([]);
const cargando = ref(false);
const procesoFormDialogRef = ref(null);
const search = ref("");

const esAdministrador = computed(() => esAdminObservatorios(roleUsuario.value));

const procesosActivos = computed(() => procesos.value.filter((proceso) => proceso.activo !== false));

const procesosVisibles = computed(() => {
  if (esAdministrador.value) return procesos.value;
  return procesosActivos.value;
});

const procesosFiltrados = computed(() => {
  const visibles = procesosVisibles.value;

  const filtrados = search.value
    ? visibles.filter((proceso) => {
        const textoBusqueda = search.value.toLowerCase();

        return (
          proceso.nombre?.toLowerCase().includes(textoBusqueda) ||
          proceso.descripcion?.toLowerCase().includes(textoBusqueda) ||
          proceso.dependencia_responsable?.toLowerCase().includes(textoBusqueda) ||
          String(proceso.proceso_id || proceso.id || "")
            .toLowerCase()
            .includes(textoBusqueda)
        );
      })
    : visibles;

  return ordenarPorOrden(filtrados);
});

const mostrarCargandoProcesos = () => {
  Swal.fire({
    title: "Cargando procesos",
    text: "Consultando los procesos institucionales...",
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

const cerrarCargandoProcesos = () => {
  Swal.close();
};

const traerProcesos = async () => {
  cargando.value = true;
  procesos.value = [];
  mostrarCargandoProcesos();

  try {
    const data = await procesosService.listar();
    procesos.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error al cargar procesos:", error?.response?.data || error);
    procesos.value = [];
    cerrarCargandoProcesos();

    await Swal.fire({
      title: "Error",
      text: "No fue posible cargar los procesos institucionales.",
      icon: "error",
      width: "340px",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
      },
      buttonsStyling: false,
    });
  } finally {
    cargando.value = false;
    cerrarCargandoProcesos();
  }
};

const obtenerProcesoId = (proceso) => proceso.proceso_id || proceso.id;

const dirigirseProceso = (proceso) => {
  const procesoId = obtenerProcesoId(proceso);
  if (!procesoId) return;

  router.push({
    name: "procesoFactores",
    params: {
      proceso_id: procesoId,
    },
  });
};

const obtenerEtiquetaProceso = (proceso, index) => {
  return proceso.proceso_id || proceso.id || `Proceso ${index + 1}`;
};

const obtenerDescripcionProceso = (proceso) => {
  if (proceso.descripcion) return proceso.descripcion;

  const totalFactores = Array.isArray(proceso.factores) ? proceso.factores.length : 0;
  if (totalFactores > 0) return `${totalFactores} factor(es) asociado(s) a este proceso.`;

  return "Consultar los factores y evidencias asociados a este proceso.";
};

const abrirCrearProceso = () => {
  if (!esAdministrador.value) return;
  procesoFormDialogRef.value?.abrir("crear");
};

const verProceso = (proceso) => {
  procesoFormDialogRef.value?.abrir("ver", proceso);
};

const editarProceso = (proceso) => {
  if (!esAdministrador.value) return;
  procesoFormDialogRef.value?.abrir("editar", proceso);
};

const cambiarEstadoProceso = async (proceso, activo) => {
  if (!esAdministrador.value) return;

  const id = obtenerProcesoId(proceso);
  if (!id) return;

  const accion = activo ? "reactivar" : "desactivar";
  const resultado = await Swal.fire({
    title: activo ? "Reactivar Proceso" : "Desactivar Proceso",
    html: `¿Desea ${accion} el proceso <b>${proceso.nombre}</b>?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar",
    width: "350px",
    customClass: {
      popup: "popup-personalizado",
      title: "titulo-alerta-personalizado",
      confirmButton: "confirmacion-alerta-personalizado",
      cancelButton: "cancelacion-alerta-personalizado",
    },
    buttonsStyling: false,
  });

  if (!resultado.isConfirmed) return;

  try {
    if (activo) {
      await procesosService.actualizarParcial(id, { activo: true });
    } else {
      await procesosService.desactivar(id);
    }

    await traerProcesos();

    await Swal.fire({
      title: activo ? "¡Activado!" : "¡Desactivado!",
      text: activo
        ? "El proceso se ha reactivado correctamente."
        : "El proceso se ha desactivado correctamente.",
      icon: "success",
      width: "300px",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
      },
      buttonsStyling: false,
    });
  } catch (error) {
    console.error("Error al cambiar estado del proceso:", error?.response?.data || error);

    Swal.fire({
      title: "Error",
      text: "No fue posible actualizar el estado del proceso.",
      icon: "error",
      width: "350px",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
      },
      buttonsStyling: false,
    });
  }
};

const desactivarProceso = (proceso) => cambiarEstadoProceso(proceso, false);
const reactivarProceso = (proceso) => cambiarEstadoProceso(proceso, true);

watch(
  () => userStore.user?.role,
  (nuevoRol) => {
    if (Array.isArray(nuevoRol) && nuevoRol.length) {
      roleUsuario.value = normalizarRoles(nuevoRol);
    }
  },
  { immediate: true }
);

onMounted(() => {
  traerProcesos();
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

.hero-card__header h1 {
  margin: 0;
  font-size: 26px;
  font-weight: 900;
  line-height: 1.25;
  overflow-wrap: anywhere;
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

.info-card__label,
.section-header__label,
.espacio-card__label {
  color: #607d9a;
}

.info-card p {
  margin: 0;
  color: #37474f;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.48;
  overflow-wrap: anywhere;
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
  overflow-wrap: anywhere;
}

.section-header > div:first-child {
  min-width: 0;
}

.section-header__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  min-width: 0;
}

.section-header__chip {
  font-size: 11px;
  font-weight: 800;
}

.buscador__procesos {
  max-width: 320px;
  min-width: 240px;
}

.espacios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(275px, 1fr));
  gap: 16px;
  margin-top: 14px;
}

.espacio-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
  min-height: 250px;
  padding: 16px;
  border: 1px solid #d7e1ef;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 6px 18px rgba(25, 55, 90, 0.08);
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.espacio-card:hover {
  transform: translateY(-3px);
  border-color: #9ebbd6;
  box-shadow: 0 10px 24px rgba(25, 55, 90, 0.14);
}

.espacio-card--inactive {
  cursor: default;
  opacity: 0.74;
}

.espacio-card__top,
.espacio-card__footer,
.espacio-card__crud,
.espacio-card__meta span {
  display: flex;
  align-items: center;
}

.espacio-card__top,
.espacio-card__footer {
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
}

.espacio-card__icon {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 16px;
  background: #e7f1fa;
  color: #315f99;
}

.espacio-card__content {
  margin-top: 16px;
  min-width: 0;
  overflow: hidden;
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
  overflow-wrap: anywhere;
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
  overflow-wrap: anywhere;
}

.espacio-card__meta {
  display: grid;
  gap: 6px;
  margin-top: 14px;
  min-width: 0;
  overflow: hidden;
  color: #607d8b;
  font-size: 12px;
  font-weight: 700;
}

.espacio-card__meta span {
  gap: 6px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.espacio-card__footer {
  flex-wrap: wrap;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
}

.espacio-card__crud {
  flex: 0 1 auto;
  flex-wrap: wrap;
  gap: 2px;
}

.espacio-card .v-chip {
  max-width: 100%;
}

.espacio-card .v-btn {
  min-width: 0;
}

@media (max-width: 900px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .section-header__actions,
  .buscador__procesos {
    width: 100%;
    max-width: none;
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
