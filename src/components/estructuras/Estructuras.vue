<template>
  <section class="factor-page">
    <!-- FACTOR -->
    <article class="factor-card">
      <div class="factor-card__header">
        <span class="factor-card__label">Factor de evaluación</span>
        <h1 class="factor-card__title">
          {{ nombreFactor }}
        </h1>
      </div>

      <div class="factor-card__content">
        <div class="content-grid">
          <div class="description-box description-box--factor">
            <span class="box-title">Descripción del factor</span>
            <p>
              {{ descripcionFactor }}
            </p>
          </div>

          <div class="rating-box rating-box--factor">
            <span class="box-title">Calificación del factor</span>
            <strong>
              {{ calificacionFactor }}
            </strong>
          </div>
        </div>
      </div>
    </article>

    <!-- CABECERA CARACTERÍSTICAS -->
    <div class="section-header">
      <div>
        <span class="section-header__label">Listado</span>
        <h2>Características</h2>
      </div>

      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        class="btn-main"
        @click="crearEstructura"
      >
        Crear Característica
      </v-btn>
    </div>

    <v-skeleton-loader
      v-if="cargando"
      type="article, article, article"
      class="mt-4"
    />

    <v-alert
      v-if="!cargando && filteredEstructuras.length === 0"
      type="info"
      variant="tonal"
      class="mt-4"
    >
      No se encontraron características registradas.
    </v-alert>

    <!-- LISTA DE CARACTERÍSTICAS -->
    <article
      v-for="(estructura, index) in filteredEstructuras"
      :key="claveCaracteristica(estructura, index)"
      class="caracteristica-card"
    >
      <header
        class="caracteristica-card__header"
        @click="toggleCaracteristica(claveCaracteristica(estructura, index))"
      >
        <div class="caracteristica-card__title">
          <span class="caracteristica-card__number">
            {{ index + 1 }}
          </span>

          <div>
            <span class="caracteristica-card__label">Característica</span>
            <h3>{{ estructura.nombre }}</h3>
          </div>
        </div>

        <v-btn
          icon
          variant="text"
          color="white"
          size="small"
          class="btn-toggle"
          @click.stop="toggleCaracteristica(claveCaracteristica(estructura, index))"
        >
          <v-icon>
            {{
              caracteristicaEstaAbierta(claveCaracteristica(estructura, index))
                ? "mdi-minus"
                : "mdi-plus"
            }}
          </v-icon>
        </v-btn>
      </header>

      <v-expand-transition>
        <div
          v-if="caracteristicaEstaAbierta(claveCaracteristica(estructura, index))"
          class="caracteristica-card__content"
        >
          <div class="content-grid">
            <div class="description-box">
              <span class="box-title">Descripción</span>
              <p>
                {{ obtenerDescripcionCaracteristica(estructura) }}
              </p>
            </div>

            <div class="rating-box">
              <span class="box-title">Calificación</span>
              <strong>
                {{ obtenerCalificacionCaracteristica(estructura) }}
              </strong>
            </div>
          </div>

          <div class="actions-bar">
            <span class="actions-bar__title">Acciones de la característica</span>

            <div class="actions-bar__buttons">
              <v-btn
                variant="tonal"
                icon
                size="small"
                color="primary"
                title="Ver característica"
                @click="verEstructura(estructura)"
              >
                <v-icon>mdi-eye</v-icon>
              </v-btn>

              <v-btn
                variant="tonal"
                icon
                size="small"
                color="primary"
                title="Editar característica"
                @click="editarEstructura(estructura)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>

              <v-btn
                v-if="estructura.activo"
                variant="tonal"
                icon
                size="small"
                color="error"
                title="Eliminar característica"
                @click="eliminarEstructura(estructura)"
              >
                <v-icon>mdi-trash-can</v-icon>
              </v-btn>

              <v-btn
                v-else
                variant="tonal"
                icon
                size="small"
                color="success"
                title="Reactivar característica"
                @click="reactivarEstructura(estructura)"
              >
                <v-icon>mdi-sync</v-icon>
              </v-btn>

              <v-btn
                variant="tonal"
                icon
                size="small"
                color="primary"
                title="Ir a los datos"
                @click="diriguirseEstructura(estructura)"
              >
                <v-icon>mdi-database</v-icon>
              </v-btn>

              <v-btn
                variant="tonal"
                icon
                size="small"
                color="success"
                title="Ir a los archivos"
                @click="diriguirseArchivos(estructura)"
              >
                <v-icon>mdi-file-document-outline</v-icon>
              </v-btn>
            </div>
          </div>

          <!-- ASPECTOS -->
          <section class="aspectos-section">
            <div class="aspectos-section__header">
              <div>
                <span class="aspectos-section__label">Detalle</span>
                <h4>Aspectos a evaluar</h4>
              </div>

              <v-btn
                color="primary"
                variant="tonal"
                prepend-icon="mdi-plus"
                size="small"
                class="btn-aspecto"
                @click="crearAspecto(estructura)"
              >
                Crear Aspecto
              </v-btn>
            </div>

            <div
              v-for="(aspecto, aspectoIndex) in obtenerAspectos(estructura)"
              :key="claveAspecto(estructura, index, aspectoIndex)"
              class="aspecto-card"
            >
              <header
                class="aspecto-card__header"
                @click="toggleAspecto(claveAspecto(estructura, index, aspectoIndex))"
              >
                <div class="aspecto-card__title">
                  <span class="aspecto-card__number">
                    {{ aspectoIndex + 1 }}
                  </span>

                  <p>
                    {{ aspecto }}
                  </p>
                </div>

                <v-btn
                  icon
                  variant="text"
                  size="small"
                  color="primary"
                  @click.stop="toggleAspecto(claveAspecto(estructura, index, aspectoIndex))"
                >
                  <v-icon>
                    {{
                      aspectoEstaAbierto(claveAspecto(estructura, index, aspectoIndex))
                        ? "mdi-chevron-up"
                        : "mdi-chevron-down"
                    }}
                  </v-icon>
                </v-btn>
              </header>

              <v-expand-transition>
                <div
                  v-if="aspectoEstaAbierto(claveAspecto(estructura, index, aspectoIndex))"
                  class="aspecto-card__content"
                >
                  <div class="evidencias-title">
                    Evidencias asociadas
                  </div>

                  <div class="evidencias-table">
                    <div class="evidencias-table__header">
                      <span>Número</span>
                      <span>Tipo de evidencia</span>
                      <span>Nombre</span>
                      <span>Formato</span>
                      <span>Acciones</span>
                    </div>

                    <div class="evidencias-table__row">
                      <span>1.</span>
                      <span>Documental</span>
                      <span>Sin evidencias cargadas desde esta vista</span>
                      <span>-</span>
                      <span class="evidencias-actions">
                        <v-btn
                          variant="tonal"
                          icon
                          size="small"
                          color="success"
                          title="Ir a los archivos"
                          @click="diriguirseArchivos(estructura)"
                        >
                          <v-icon>mdi-file-document-outline</v-icon>
                        </v-btn>
                      </span>
                    </div>
                  </div>
                </div>
              </v-expand-transition>
            </div>
          </section>
        </div>
      </v-expand-transition>
    </article>

    <!-- MODAL CREAR -->
    <v-dialog
      v-model="_crearEstructura"
      scrollable
      max-width="500px"
      max-height="70vh"
      transition="dialog-transition"
    >
      <CrearEstructura @cerrar="cerrarModal" />
    </v-dialog>

    <!-- MODAL VER / EDITAR -->
    <v-dialog
      v-model="_gestionEstructura"
      scrollable
      max-width="500px"
      max-height="70vh"
      transition="dialog-transition"
    >
      <EstructuraGestion
        :estructuraData="datosEstructura"
        :value="_modo"
        @cerrar="cerrarModal"
      />
    </v-dialog>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import peticionAPI from "../../service/conexion_api";
import Swal from "sweetalert2";
import CrearEstructura from "./CrearEstructura.vue";
import EstructuraGestion from "./EstructuraGestion.vue";
import { useEstructuraStore } from "@/stores/estructuraStore";
import { useObservatorioStore } from "@/stores/observatorioStore";

const observatorioStore = useObservatorioStore();
const estructuraStore = useEstructuraStore();

const router = useRouter();
const route = useRoute();

const search = ref("");
const estructuras = ref([]);
const cargando = ref(false);

const _crearEstructura = ref(false);
const _gestionEstructura = ref(false);
const _modo = ref(false);
const datosEstructura = ref({});

const caracteristicasAbiertas = ref([]);
const aspectosAbiertos = ref([]);

const observatorioId = computed(() => {
  return (
    observatorioStore.observatorio?.observatorio_id ||
    route.params.observatorio_id ||
    route.params.id
  );
});

const nombreFactor = computed(() => {
  return (
    observatorioStore.observatorio?.nombre ||
    "FACTOR 1. Identidad Institucional."
  );
});

const descripcionFactor = computed(() => {
  return (
    observatorioStore.observatorio?.descripcion ||
    "Una institución de alta calidad tiene unos valores declarados coherentes con los principios rectores de la alta calidad y un proyecto educativo institucional, o lo que haga sus veces, socializados y apropiados por la comunidad."
  );
});

const calificacionFactor = computed(() => {
  return observatorioStore.observatorio?.calificacion || "4.5";
});

const filteredEstructuras = computed(() => {
  if (!search.value) return estructuras.value;

  return estructuras.value.filter((estructura) =>
    estructura.nombre?.toLowerCase().includes(search.value.toLowerCase())
  );
});

const claveCaracteristica = (estructura, index) => {
  return estructura.id || `caracteristica-${index}`;
};

const claveAspecto = (estructura, estructuraIndex, aspectoIndex) => {
  return `${claveCaracteristica(estructura, estructuraIndex)}-aspecto-${aspectoIndex}`;
};

const caracteristicaEstaAbierta = (clave) => {
  return caracteristicasAbiertas.value.includes(clave);
};

const aspectoEstaAbierto = (clave) => {
  return aspectosAbiertos.value.includes(clave);
};

const toggleCaracteristica = (clave) => {
  if (caracteristicasAbiertas.value.includes(clave)) {
    caracteristicasAbiertas.value = caracteristicasAbiertas.value.filter(
      (item) => item !== clave
    );
    return;
  }

  caracteristicasAbiertas.value.push(clave);
};

const toggleAspecto = (clave) => {
  if (aspectosAbiertos.value.includes(clave)) {
    aspectosAbiertos.value = aspectosAbiertos.value.filter(
      (item) => item !== clave
    );
    return;
  }

  aspectosAbiertos.value.push(clave);
};

const obtenerDescripcionCaracteristica = (estructura) => {
  return (
    estructura.descripcion ||
    "La unidad académica actúa de manera coherente y pertinente con el medio social, cultural y ambiental, de acuerdo con la identidad y el proyecto educativo institucional."
  );
};

const obtenerCalificacionCaracteristica = (estructura) => {
  if (estructura.calificacion && estructura.calificacion_descripcion) {
    return `${estructura.calificacion} ${estructura.calificacion_descripcion}`;
  }

  if (estructura.calificacion) {
    return estructura.calificacion;
  }

  return "4.5 Se cumple en alto grado";
};

const obtenerAspectos = (estructura) => {
  if (Array.isArray(estructura.aspectos) && estructura.aspectos.length > 0) {
    return estructura.aspectos.map((aspecto) => {
      if (typeof aspecto === "string") return aspecto;
      return aspecto.descripcion || aspecto.nombre || "Aspecto sin descripción";
    });
  }

  if (Array.isArray(estructura.mapeo) && estructura.mapeo.length > 0) {
    return estructura.mapeo.map((campo) => campo.nombre);
  }

  return [
    "Demuestra a través de los propósitos y las declaraciones académico-administrativas su coherencia con el proyecto educativo institucional.",
  ];
};

const traerEstructuras = async () => {
  cargando.value = true;

  Swal.fire({
    title: "Cargando estructuras",
    text: "Por favor espera…",
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const data = await peticionAPI(
      "campos/estructuras/",
      "GET",
      null,
      { observatorio: observatorioId.value }
    );

    estructuras.value = data.map((item) => ({
      ...item,
      tieneDatos: item.mapeo?.length > 0,
      tieneArchivos: item.mapeo_archivos?.length > 0,
    }));
  } catch (error) {
    console.error(error);
    Swal.fire(
      "Error",
      "No fue posible cargar las estructuras",
      "error"
    );
  } finally {
    cargando.value = false;
    Swal.close();
  }
};

const cerrarModal = () => {
  _gestionEstructura.value = false;
  _crearEstructura.value = false;

  setTimeout(() => {
    traerEstructuras();
  }, 1000);
};

const crearEstructura = () => {
  _crearEstructura.value = true;
};

const crearAspecto = (item) => {
  const estructura = obtenerItem(item);

  _gestionEstructura.value = true;
  _modo.value = true;
  datosEstructura.value = estructura;
};

const obtenerItem = (item) => {
  return item?.raw || item;
};

const verEstructura = (item) => {
  const estructura = obtenerItem(item);

  _gestionEstructura.value = true;
  _modo.value = false;
  datosEstructura.value = estructura;
};

const editarEstructura = (item) => {
  const estructura = obtenerItem(item);

  _gestionEstructura.value = true;
  _modo.value = true;
  datosEstructura.value = estructura;
};

const reactivarEstructura = async (item) => {
  const estructura = obtenerItem(item);
  const id = estructura.id;
  const nombre = estructura.nombre;

  const resultado = await Swal.fire({
    title: "Reactivar Estructura",
    html: `¿Desea reactivar la estructura <b>${nombre}</b>?`,
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

  if (resultado.isConfirmed) {
    peticionAPI(`/campos/estructuras/${id}/`, "PUT", { activo: true })
      .then(() => {
        Swal.fire({
          title: "¡Activado!",
          text: "La estructura ha sido reactivada correctamente.",
          icon: "success",
          width: "300px",
          customClass: {
            popup: "popup-personalizado",
            title: "titulo-alerta-personalizado",
            confirmButton: "confirmacion-alerta-personalizado",
          },
          buttonsStyling: false,
        });

        setTimeout(() => {
          traerEstructuras();
        }, 1000);
      })
      .catch((error) => console.error(error));
  }
};

const eliminarEstructura = async (item) => {
  const estructura = obtenerItem(item);
  const id = estructura.id;
  const nombre = estructura.nombre;

  const resultado = await Swal.fire({
    title: "Deshabilitar Estructura",
    html: `¿Desea inhabilitar la estructura <b>${nombre}</b>?`,
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

  if (resultado.isConfirmed) {
    peticionAPI(`/campos/estructuras/${id}/`, "DELETE", {
      confirmacion: true,
    })
      .then(() => {
        Swal.fire({
          title: "¡Deshabilitado!",
          text: "El elemento ha sido deshabilitado correctamente.",
          icon: "success",
          width: "300px",
          customClass: {
            popup: "popup-personalizado",
            title: "titulo-alerta-personalizado",
            confirmButton: "confirmacion-alerta-personalizado",
          },
          buttonsStyling: false,
        });

        setTimeout(() => {
          traerEstructuras();
        }, 1000);
      })
      .catch((error) => console.error(error));
  }
};

const diriguirseEstructura = (item) => {
  const estructura = obtenerItem(item);

  estructuraStore.setEstructura({
    id: estructura.id,
    nombre: estructura.nombre,
    mapeo: estructura.mapeo,
  });

  router.push(`/${observatorioId.value}/tablero`);
};

const diriguirseArchivos = (item) => {
  const estructura = obtenerItem(item);

  estructuraStore.setEstructura({
    id: estructura.id,
    nombre: estructura.nombre,
    mapeo: estructura.mapeo,
    id_archivos: estructura.id_archivos,
    mapeo_archivos: estructura.mapeo_archivos,
  });

  router.push(`/${observatorioId.value}/archivos`);
};

onMounted(async () => {
  await traerEstructuras();
});
</script>

<style scoped>
.factor-page {
  width: 94%;
  max-width: 1280px;
  margin: 16px auto 48px;
  font-family: Arial, Helvetica, sans-serif;
  color: #263238;
}

/* FACTOR */

.factor-card {
  overflow: hidden;
  border: 1px solid #d7e1ef;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 6px 18px rgba(25, 55, 90, 0.08);
}

.factor-card__header {
  padding: 18px 22px;
  background: linear-gradient(135deg, #244f84 0%, #376aa3 100%);
  color: #ffffff;
}

.factor-card__label,
.section-header__label,
.caracteristica-card__label,
.aspectos-section__label {
  display: block;
  margin-bottom: 4px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.85;
}

.factor-card__title {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  line-height: 1.25;
}

.factor-card__content {
  padding: 16px;
  background: #ffffff;
}

.description-box--factor {
  border-left-color: #244f84;
}

.rating-box--factor {
  border-left-color: #244f84;
  background: #f3f7fc;
}

.rating-box--factor strong {
  font-size: 16px;
}

/* CABECERA */

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

.btn-main,
.btn-aspecto {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.search-field {
  margin-bottom: 16px;
}

/* CARACTERÍSTICAS */

.caracteristica-card {
  overflow: hidden;
  margin-bottom: 16px;
  border: 1px solid #ccd9ea;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 5px 16px rgba(25, 55, 90, 0.07);
}

.caracteristica-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 13px 16px;
  background: #315f99;
  color: #ffffff;
  cursor: pointer;
}

.caracteristica-card__title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.caracteristica-card__number {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #ffffff;
  color: #315f99;
  font-size: 14px;
  font-weight: 900;
}

.caracteristica-card__label {
  margin-bottom: 2px;
  font-size: 10px;
}

.caracteristica-card__title h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  line-height: 1.25;
}

.btn-toggle {
  flex: 0 0 auto;
}

.caracteristica-card__content {
  padding: 16px;
  background: #ffffff;
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 14px;
  align-items: stretch;
}

.description-box,
.rating-box {
  border: 1px solid #d7e1ef;
  border-radius: 12px;
  background: #f8fafc;
}

.description-box {
  padding: 14px 16px;
  border-left: 5px solid #315f99;
}

.description-box p {
  margin: 0;
  color: #37474f;
  font-size: 13px;
  line-height: 1.5;
}

.rating-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 14px 16px;
  border-left: 5px solid #7a95c9;
}

.rating-box strong {
  color: #244f84;
  font-size: 14px;
  line-height: 1.4;
}

.box-title {
  display: block;
  margin-bottom: 6px;
  color: #607d9a;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.actions-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 12px;
  padding: 10px 12px;
  border: 1px dashed #c9d7ea;
  border-radius: 12px;
  background: #fbfdff;
}

.actions-bar__title {
  color: #546e7a;
  font-size: 12px;
  font-weight: 800;
}

.actions-bar__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

/* ASPECTOS */

.aspectos-section {
  position: relative;
  margin-top: 18px;
  margin-left: 34px;
  padding: 16px;
  border: 1px solid #b9d8ce;
  border-left: 6px solid #2e8b74;
  border-radius: 14px;
  background: #f1faf7;
}

.aspectos-section::before {
  content: "";
  position: absolute;
  top: -12px;
  left: 22px;
  width: 2px;
  height: 12px;
  background: #2e8b74;
}

.aspectos-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
  padding: 12px 14px;
  border: 1px solid #c7e4da;
  border-radius: 12px;
  background: #e6f5f0;
}

.aspectos-section__header h4 {
  margin: 0;
  color: #1f6f5d;
  font-size: 18px;
  font-weight: 900;
}

.aspectos-section__label {
  color: #2e8b74;
}

.aspecto-card {
  overflow: hidden;
  margin-bottom: 10px;
  border: 1px solid #b9d8ce;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 3px 10px rgba(46, 139, 116, 0.08);
}

.aspecto-card:last-child {
  margin-bottom: 0;
}

.aspecto-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 11px 12px;
  cursor: pointer;
  background: #ffffff;
  border-left: 5px solid #2e8b74;
  transition: background-color 0.2s ease;
}

.aspecto-card__header:hover {
  background: #edf8f4;
}

.aspecto-card__title {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.aspecto-card__number {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  margin-top: 1px;
  border-radius: 8px;
  background: #2e8b74;
  color: #ffffff;
  font-size: 12px;
  font-weight: 900;
}

.aspecto-card__title p {
  margin: 0;
  color: #29443d;
  font-size: 13px;
  line-height: 1.45;
  font-weight: 600;
}

.aspecto-card__content {
  padding: 0 12px 12px 45px;
  background: #fbfefd;
}

.evidencias-title {
  margin-bottom: 8px;
  color: #2e8b74;
  font-size: 12px;
  font-weight: 900;
}

/* EVIDENCIAS */

.evidencias-table {
  overflow: hidden;
  border: 1px solid #bed3e6;
  border-radius: 10px;
}

.evidencias-table__header,
.evidencias-table__row {
  display: grid;
  grid-template-columns: 0.7fr 1.4fr 2.2fr 1fr 1fr;
}

.evidencias-table__header span {
  padding: 9px 10px;
  background: #e5f0f6;
  color: #263238;
  font-size: 12px;
  font-weight: 900;
  border-right: 1px solid #bed3e6;
}

.evidencias-table__row span {
  padding: 9px 10px;
  color: #37474f;
  font-size: 12px;
  border-top: 1px solid #bed3e6;
  border-right: 1px solid #bed3e6;
  background: #ffffff;
}

.evidencias-table__header span:last-child,
.evidencias-table__row span:last-child {
  border-right: none;
}

.evidencias-actions {
  display: flex;
  align-items: center;
}

/* RESPONSIVE */

@media (max-width: 900px) {
  .factor-card__footer,
  .section-header,
  .aspectos-section__header,
  .actions-bar {
    align-items: flex-start;
    flex-direction: column;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .evidencias-table__header,
  .evidencias-table__row {
    grid-template-columns: 1fr;
  }

  .evidencias-table__header span,
  .evidencias-table__row span {
    border-right: none;
  }
}
</style>


<!--
<template>
  <div>
    <h1>nombre factor</h1>
    <p>descripción factor</p>
    <p>califiación del factor: 4.5</p>
  </div>
  <div>
    <h1>caracteristicas</h1>
    <!-- listas de caracteristicas que al final tenga un más para desplegar lo que tiene la caracteristica
     <p>caracterica 1</p><p>+</p>
     <p>caracterica 2</p><p>+</p>
  </div>


  <div class="intro">
    <h1>{{ observatorioStore.observatorio?.nombre }}</h1>
    <h1>11111111111111111111</h1>
    <div class="intro-box">
      <p>{{ observatorioStore.observatorio?.descripcion }}</p>
    </div>
  </div>

  <div class="estructuras">
    <div class="cabecera">
      <h1 class="titulo__cabecera">Características</h1>
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="crearEstructura"
        >Crear Característica</v-btn
      >
    </div>
    <v-card>
      <div class="cabecera__tabla">
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h5">Características</span>
        </v-card-title>
        <v-spacer />

        <v-text-field
          class="buscador__tabla"
          v-model="search"
          append-inner-icon="mdi-magnify"
          label="Buscar"
          variant="underlined"
        />
      </div>

      <v-data-table
        :headers="headers"
        :items="filteredObservatories"
        :loading="cargando"
        item-value="id"
        class="elevation-1"
        no-data-text="No se encontraron datos"
        items-per-page-text="Elementos por página:"
      >
      <template #loading>
          <v-skeleton-loader type="table" />
        </template>
        <template v-slot:item.activo="{ item }">
          <v-chip :color="item.columns.activo ? 'green' : 'red'" dark>
            {{ item.columns.activo ? "Activo" : "Inactivo" }}
          </v-chip>
        </template>

        <template v-slot:[`item.acciones_datos`]="{ item }">
          <v-btn
            variant="text"
            icon
            size="small"
            @click="verEstructura(item)"
            color="primary"
            title="Ver característica"
          >
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn
            variant="text"
            icon
            size="small"
            @click="editarEstructura(item)"
            color="primary"
            title="Editar característica"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            v-if="item.columns.activo"
            variant="text"
            icon
            size="small"
            @click="eliminarEstructura(item)"
            color="primary"
            title="Eliminar característica"
          >
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
          <v-btn
            v-else
            variant="text"
            icon
            size="small"
            @click="reactivarEstructura(item)"
            color="primary"
            title="Reactivar característica"
          >
            <v-icon> mdi-sync</v-icon>
          </v-btn>
          <v-btn
            variant="text"
            icon
            size="small"
            @click="diriguirseEstructura(item)"
            color="primary"
            title="Ir a los datos"
          >
            <v-icon>mdi-database</v-icon>
          </v-btn>
        </template>

        <template v-slot:[`item.acciones_archivos`]="{ item }">
                    <v-btn
            variant="text"
            icon
            size="small"
            @click="verEstructuraArchivos(item)"
            color="green"
            title="Ver característica"
          >
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn
            variant="text"
            icon
            size="small"
            @click="editarEstructuraArchivos(item)"
            color="green"
            title="Editar característica"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            v-if="item.columns.activo"
            variant="text"
            icon
            size="small"
            @click="eliminarEstructura(item)"
            color="green"
            title="Eliminar característica"
          >
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
          <v-btn
            v-else
            variant="text"
            icon
            size="small"
            @click="reactivarEstructura(item)"
            color="green"
            title="Reactivar característica"
          >
            <v-icon> mdi-sync</v-icon>
          </v-btn>
          <v-btn
            variant="text"
            icon
            size="small"
            @click="diriguirseArchivos(item)"
            color="green"
            title="Ir a los archivos"
          >
            <v-icon>mdi-file-document-outline</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="_crearEstructura"
      scrollable
      max-width="500px"
      max-height="70vh"
      transition="dialog-transition"
    >
      <CrearEstructura @cerrar="cerrarModal" />
    </v-dialog>
    <v-dialog
      v-model="_gestionEstructura"
      scrollable
      max-width="500px"
      max-height="70vh"
      transition="dialog-transition"
    >
      <EstructuraGestion
        :estructuraData="datosEstructura"
        :value="_modo"
        @cerrar="cerrarModal"
      />
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import peticionAPI from "../../service/conexion_api";
import Swal from "sweetalert2";
import CrearEstructura from "./CrearEstructura.vue";
import EstructuraGestion from "./EstructuraGestion.vue";
import { useEstructuraStore } from "@/stores/estructuraStore";
import { useObservatorioStore } from "@/stores/observatorioStore";

const observatorioStore = useObservatorioStore();
const estructuraStore = useEstructuraStore();
const router = useRouter();
const search = ref("");
const estructuras = ref([]);
const cargando = ref(false);

const headers = ref([
  { title: "Nombre", key: "nombre", align: "center" },
  { title: "Estado", key: "activo", align: "center" },
  { title: "Acciones datos", key: "acciones_datos", sortable: false, align: "center" },
  { title: "Acciones archivos", key: "acciones_archivos", sortable: false, align: "center" },
]);

const filteredObservatories = computed(() => {
  if (!search.value) return estructuras.value;
  return estructuras.value.filter((obs) =>
    obs.nombre.toLowerCase().includes(search.value.toLowerCase())
  );
});

const _crearEstructura = ref(false);
const _gestionEstructura = ref(false);
const _modo = ref(false);

const datosEstructura = ref({});

const traerEstructuras = async () => {
  cargando.value = true;

  Swal.fire({
    title: "Cargando estructuras",
    text: "Por favor espera…",
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const data = await peticionAPI(
      "campos/estructuras/",
      "GET",
      null,
      { observatorio: observatorioStore.observatorio?.observatorio_id }
    );

    estructuras.value = data.map((item) => ({
      ...item,
      tieneDatos: item.mapeo?.length > 0,
      tieneArchivos: item.mapeo_archivos?.length > 0,
    }));
  } catch (error) {
    console.error(error);
    Swal.fire(
      "Error",
      "No fue posible cargar las estructuras",
      "error"
    );
  } finally {
    cargando.value = false;
    Swal.close();
  }
};

const cerrarModal = () => {
  setTimeout(() => {
    traerEstructuras();
  }, 2000);
  _gestionEstructura.value = false;
  _crearEstructura.value = false;
};

const crearEstructura = () => {
  _crearEstructura.value = true;
};

const verEstructura = (item) => {
  _gestionEstructura.value = true;
  _modo.value = false;
  datosEstructura.value = item.raw;
};

const verEstructuraArchivos = (item) => {
  _gestionEstructura.value = true;
  _modo.value = false;

  datosEstructura.value = {
    ...item.raw,
    tipo: 'archivos',
    mapeo_archivos: item.raw.mapeo_archivos
  };
};

const editarEstructura = (item) => {
  _gestionEstructura.value = true;
  _modo.value = true;
  datosEstructura.value = item.raw;
};

const editarEstructuraArchivos = (item) => {
  _gestionEstructura.value = true;
  _modo.value = true;

  datosEstructura.value = {
    ...item.raw,
    tipo: "archivos",
    mapeo_archivos: item.raw.mapeo_archivos
  };
};

const reactivarEstructura = async (item) => {
  let id = item.raw.id;
  let nombre = item.raw.nombre;
  const resultado = await Swal.fire({
    title: "Reactivar Estructura",
    html: `¿Desea reactivar la estructura <b> ${nombre} </b> ?`,
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

  if (resultado.isConfirmed) {
    const data = { confirmacion: true };

    peticionAPI(`/campos/estructuras/${id}/`, "PUT", { activo: true })
      .then((data) => {
        Swal.fire({
          title: "¡Activado!",
          text: "La estructura se ha sido reactivado correctamente.",
          icon: "success",
          width: "300px",
          customClass: {
            popup: "popup-personalizado",
            title: "titulo-alerta-personalizado",
            confirmButton: "confirmacion-alerta-personalizado",
          },
          buttonsStyling: false,
        });
        setTimeout(() => {
          traerEstructuras();
        }, 1000);
      })
      .catch((error) => console.error(error));
  }
};
const eliminarEstructura = async (item) => {
  let id = item.raw.id;
  let nombre = item.raw.nombre;

  const resultado = await Swal.fire({
    title: "Deshabilitar Estructura",
    html: `¿Desea inhabilitar la estructura <b> ${nombre} </b> ? `,
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

  if (resultado.isConfirmed) {
    const data = { confirmacion: true };

    peticionAPI(`/campos/estructuras/${id}/`, "DELETE", data)
      .then((data) => {
        Swal.fire({
          title: "¡Deshabilitado!",
          text: "El elemento ha sido deshabilitado correctamente.",
          icon: "success",
          width: "300px",
          customClass: {
            popup: "popup-personalizado",
            title: "titulo-alerta-personalizado",
            confirmButton: "confirmacion-alerta-personalizado",
          },
          buttonsStyling: false,
        });
        setTimeout(() => {
          traerEstructuras();
        }, 1000);
      })
      .catch((error) => console.error(error));
  }
};
const diriguirseEstructura = (item) => {
  estructuraStore.setEstructura({
    id: item.raw.id,
    nombre: item.raw.nombre,
    mapeo: item.raw.mapeo,
  });
  router.push(`/${observatorioStore.observatorio?.observatorio_id}/tablero`);
};
const diriguirseArchivos = (item) => {
  estructuraStore.setEstructura({
    id: item.raw.id,
    nombre: item.raw.nombre,
    mapeo: item.raw.mapeo,
    id_archivos: item.raw.id_archivos,
    mapeo_archivos: item.raw.mapeo_archivos
  });
  router.push(`/${observatorioStore.observatorio?.observatorio_id}/archivos`);
};
onMounted(async () => {
  await traerEstructuras();
});
</script>

<style scoped>
.intro {
  background-color: #335f97;
  color: #ffffff;
  padding: 8px;
  border-radius: 8px;
  margin-bottom: 8px;
  margin-top: 8px;
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
.estructuras {
  width: 90%;
  margin: 40px auto;
}
</style>

-->