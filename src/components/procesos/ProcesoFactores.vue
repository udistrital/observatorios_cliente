<template>
  <section class="proceso-factores">
    <div class="flow-nav">
      <v-btn
        variant="tonal"
        color="primary"
        prepend-icon="mdi-arrow-left"
        class="return-button"
        @click="volverProcesos"
      >
        Regresar a procesos
      </v-btn>
    </div>

    <article class="hero-card">
      <div class="hero-card__header">
        <span class="hero-card__label">Proceso seleccionado</span>
        <h1>{{ procesoActual?.nombre || "Factores del proceso" }}</h1>
      </div>

      <div class="hero-card__body">
        <div class="info-grid">
          <section class="info-card">
            <div class="info-card__icon">
              <v-icon size="24">mdi-format-list-bulleted</v-icon>
            </div>

            <div>
              <span class="info-card__label">Factores</span>
              <p>
                {{ procesoActual?.descripcion || "Consulta los factores asociados al proceso y continúa hacia sus características, aspectos, estructuras y evidencias." }}
              </p>
            </div>
          </section>

          <section class="info-card">
            <div class="info-card__icon info-card__icon--success">
              <v-icon size="24">mdi-shield-check-outline</v-icon>
            </div>

            <div>
              <span class="info-card__label">Gestión</span>
              <p>
                Los administradores pueden crear y mantener factores; los demás usuarios consultan la información activa del proceso.
              </p>
            </div>
          </section>
        </div>
      </div>
    </article>

    <div class="section-header">
      <div>
        <span class="section-header__label">Listado</span>
        <h2>Factores asociados</h2>
      </div>

      <div class="section-header__actions">
        <v-chip size="small" color="primary" variant="tonal" class="section-header__chip">
          {{ factoresActivosDelProceso.length }} activos
        </v-chip>

        <v-btn
          v-if="esAdministrador"
          color="primary"
          prepend-icon="mdi-plus"
          @click="abrirCrearFactor"
        >
          Crear Factor
        </v-btn>

        <v-text-field
          v-model="search"
          class="buscador__factores"
          append-inner-icon="mdi-magnify"
          label="Buscar factor"
          variant="outlined"
          density="compact"
          hide-details
        />
      </div>
    </div>

    <v-skeleton-loader v-if="cargando" type="card, card, card" class="mt-4" />

    <v-alert
      v-if="!cargando && factoresFiltrados.length === 0"
      type="info"
      variant="tonal"
      class="mt-4"
    >
      No se encontraron factores para este proceso.
    </v-alert>

    <div v-if="!cargando && factoresFiltrados.length > 0" class="factores-grid">
      <article
        v-for="(factor, index) in factoresFiltrados"
        :key="factor.factor_id || factor.id || index"
        class="factor-card"
        :class="{ 'factor-card--inactive': factor.activo === false }"
        @click="factor.activo !== false && dirigirseFactor(factor)"
      >
        <div class="factor-card__top">
          <div class="factor-card__icon">
            <v-icon size="30">mdi-format-list-bulleted</v-icon>
          </div>

          <v-chip
            size="x-small"
            :color="factor.activo === false ? 'error' : 'success'"
            variant="tonal"
          >
            {{ factor.activo === false ? "Inactivo" : "Activo" }}
          </v-chip>
        </div>

        <div class="factor-card__content">
          <span class="factor-card__label">
            Orden: {{ factor.orden ?? "-" }} · Id: {{ obtenerEtiquetaFactor(factor, index) }}
          </span>

          <h3>{{ factor.nombre }}</h3>

          <p>{{ obtenerDescripcionFactor(factor) }}</p>
        </div>

        <div v-if="factor.calificacion" class="factor-card__meta">
          <span>
            <v-icon size="14">mdi-star-outline</v-icon>
            Calificación: {{ factor.calificacion }}
          </span>
        </div>

        <div class="factor-card__footer" @click.stop>
          <div class="factor-card__crud">
            <v-btn variant="text" icon size="small" color="primary" title="Ver factor" @click="verFactor(factor)">
              <v-icon>mdi-eye</v-icon>
            </v-btn>

            <template v-if="esAdministrador">
              <v-btn variant="text" icon size="small" color="primary" title="Editar factor" @click="editarFactor(factor)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>

              <v-btn
                v-if="factor.activo !== false"
                variant="text"
                icon
                size="small"
                color="warning"
                title="Desactivar factor"
                @click="desactivarFactor(factor)"
              >
                <v-icon>mdi-cancel</v-icon>
              </v-btn>

              <v-btn
                v-else
                variant="text"
                icon
                size="small"
                color="primary"
                title="Reactivar factor"
                @click="reactivarFactor(factor)"
              >
                <v-icon>mdi-sync</v-icon>
              </v-btn>
            </template>
          </div>

          <v-btn
            v-if="factor.activo !== false"
            variant="text"
            color="primary"
            append-icon="mdi-arrow-right"
            @click="dirigirseFactor(factor)"
          >
            Estructuras
          </v-btn>
        </div>
      </article>
    </div>

    <v-dialog v-model="modalFactor" scrollable max-width="600px" transition="dialog-transition" max-height="85vh">
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between">
          <span>{{ tituloModal }}</span>

          <v-btn icon variant="text" @click="cerrarModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider />

        <v-card-text>
          <v-form ref="formRef" @submit.prevent="guardarFactor">
            <v-text-field
              :model-value="procesoActual?.nombre || procesoId"
              label="Proceso"
              variant="outlined"
              density="comfortable"
              readonly
            />

            <v-text-field
              v-model="formulario.nombre"
              label="Nombre"
              variant="outlined"
              density="comfortable"
              :readonly="modo === 'ver'"
              :rules="[reglas.requerido]"
            />

            <v-text-field
              v-if="esAdministrador || formulario.orden !== null"
              v-model.number="formulario.orden"
              label="Orden"
              type="number"
              min="0"
              variant="outlined"
              density="comfortable"
              :readonly="modo === 'ver' || !esAdministrador"
              :rules="[reglas.enteroNoNegativo]"
            />

            <v-textarea
              v-model="formulario.descripcion"
              label="Descripción"
              variant="outlined"
              density="comfortable"
              rows="5"
              :readonly="modo === 'ver'"
              :rules="[reglas.requerido]"
            />

            <v-text-field
              :model-value="formulario.calificacion"
              label="Calificación"
              type="text"
              inputmode="decimal"
              variant="outlined"
              density="comfortable"
              :readonly="modo === 'ver'"
              :rules="[reglas.float]"
              @update:model-value="actualizarCalificacion"
              @keydown="bloquearEntradaNoFloat"
              @paste="bloquearPegadoNoFloat"
            />

            <v-switch v-model="formulario.activo" label="Activo" color="primary" :disabled="modo === 'ver'" />
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn variant="text" @click="cerrarModal">Cancelar</v-btn>

          <v-btn v-if="modo !== 'ver'" color="primary" :loading="guardando" @click="guardarFactor">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";

import { factoresService } from "@/service/factores.service";
import { procesosService } from "@/service/procesos.service";
import { FactorModel } from "@/model/factor.model";
import { useFactorStore } from "@/stores/factorStore";
import { useUserStore } from "@/stores/userStore";
import { esAdminObservatorios, normalizarRoles } from "@/utils/roles";
import { ordenarPorOrden, validarOrdenNoNegativo } from "@/utils/orden";

const route = useRoute();
const router = useRouter();
const factorStore = useFactorStore();
const userStore = useUserStore();

const procesoId = computed(() => route.params.proceso_id);
const procesoActual = ref(null);
const factores = ref([]);
const search = ref("");
const cargando = ref(false);
const guardando = ref(false);
const modalFactor = ref(false);
const modo = ref("crear");
const factorSeleccionado = ref(null);
const formRef = ref(null);
const roleUsuario = ref([]);

const formulario = ref({
  id: null,
  factor_id: null,
  proceso_id: "",
  nombre: "",
  descripcion: "",
  calificacion: "",
  orden: null,
  caracteristicas: [],
  activo: true,
});

const reglas = {
  requerido: (value) => !!value || "Este campo es obligatorio",
  float: (value) =>
    value === "" ||
    value === null ||
    value === undefined ||
    /^\d+(\.\d+)?$/.test(String(value)) ||
    "La calificación debe ser un número decimal.",
  enteroNoNegativo: validarOrdenNoNegativo,
};

const limpiarValorFloat = (value) => {
  const texto = String(value ?? "").replace(/[^\d.]/g, "");
  const partes = texto.split(".");

  if (partes.length <= 1) return partes[0];

  return `${partes[0]}.${partes.slice(1).join("")}`;
};

const actualizarCalificacion = (value) => {
  formulario.value.calificacion = limpiarValorFloat(value);
};

const bloquearEntradaNoFloat = (event) => {
  const teclasPermitidas = [
    "Backspace",
    "Delete",
    "Tab",
    "Escape",
    "Enter",
    "ArrowLeft",
    "ArrowRight",
    "Home",
    "End",
  ];

  if (teclasPermitidas.includes(event.key) || event.ctrlKey || event.metaKey) {
    return;
  }

  const valor = event.target.value || "";
  const seleccionInicio = event.target.selectionStart || 0;
  const seleccionFin = event.target.selectionEnd || 0;
  const siguienteValor =
    valor.slice(0, seleccionInicio) + event.key + valor.slice(seleccionFin);

  if (!/^\d*(\.\d*)?$/.test(siguienteValor)) {
    event.preventDefault();
  }
};

const bloquearPegadoNoFloat = (event) => {
  const texto = event.clipboardData?.getData("text") || "";

  if (!/^\d+(\.\d+)?$/.test(texto.trim())) {
    event.preventDefault();
  }
};

const esAdministrador = computed(() => esAdminObservatorios(roleUsuario.value));

const tituloModal = computed(() => {
  if (modo.value === "crear") return "Crear Factor";
  if (modo.value === "editar") return "Editar Factor";
  return "Ver Factor";
});

const obtenerRaw = (item) => item?.raw || item;

const obtenerEtiquetaFactor = (factor, index) => {
  if (factor.factor_id || factor.id) {
    return factor.factor_id || factor.id;
  }

  return `Factor ${index + 1}`;
};

const obtenerDescripcionFactor = (factor) => {
  if (factor.descripcion) return factor.descripcion;

  const totalCaracteristicas = Array.isArray(factor.caracteristicas)
    ? factor.caracteristicas.length
    : 0;

  if (totalCaracteristicas > 0) {
    return `${totalCaracteristicas} característica(s) asociada(s) a este factor.`;
  }

  return "Consultar las características, aspectos y estructuras asociadas a este factor.";
};

const factoresDelProceso = computed(() => {
  return factores.value.filter((factor) => {
    const perteneceProceso = String(factor.proceso_id) === String(procesoId.value);
    if (!perteneceProceso) return false;
    if (esAdministrador.value) return true;
    return factor.activo !== false;
  });
});

const factoresActivosDelProceso = computed(() => {
  return factores.value.filter((factor) => {
    return (
      String(factor.proceso_id) === String(procesoId.value) &&
      factor.activo !== false
    );
  });
});

const factoresFiltrados = computed(() => {
  const visibles = factoresDelProceso.value;

  const filtrados = search.value
    ? visibles.filter((factor) => {
        const textoBusqueda = search.value.toLowerCase();

        return (
          factor.nombre?.toLowerCase().includes(textoBusqueda) ||
          factor.descripcion?.toLowerCase().includes(textoBusqueda) ||
          String(factor.factor_id || factor.id || "")
            .toLowerCase()
            .includes(textoBusqueda)
        );
      })
    : visibles;

  return ordenarPorOrden(filtrados);
});

const traerProceso = async () => {
  try {
    procesoActual.value = await procesosService.obtener(procesoId.value);
  } catch (error) {
    console.error("Error al cargar proceso:", error?.response?.data || error);
    procesoActual.value = null;
  }
};

const traerFactores = async () => {
  cargando.value = true;
  factores.value = [];

  try {
    const data = await factoresService.listar();
    factores.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error al cargar factores:", error?.response?.data || error);

    Swal.fire({
      title: "Error",
      text: "No fue posible cargar los factores del proceso.",
      icon: "error",
      width: "350px",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
      },
      buttonsStyling: false,
    });
  } finally {
    cargando.value = false;
  }
};

const limpiarFormulario = () => {
  formulario.value = {
    id: null,
    factor_id: null,
    proceso_id: procesoId.value,
    nombre: "",
    descripcion: "",
    calificacion: "",
    orden: null,
    caracteristicas: [],
    activo: true,
  };

  factorSeleccionado.value = null;
};

const abrirCrearFactor = () => {
  if (!esAdministrador.value) return;
  limpiarFormulario();
  modo.value = "crear";
  modalFactor.value = true;
};

const cargarFactorEnFormulario = (factor) => {
  formulario.value = {
    id: factor.id || null,
    factor_id: factor.factor_id || factor.id || null,
    proceso_id: factor.proceso_id || procesoId.value,
    nombre: factor.nombre || "",
    descripcion: factor.descripcion || "",
    calificacion: factor.calificacion || "",
    orden: factor.orden ?? null,
    caracteristicas: Array.isArray(factor.caracteristicas)
      ? factor.caracteristicas
      : [],
    activo: factor.activo !== false,
  };
};

const verFactor = (item) => {
  const factor = obtenerRaw(item);
  modo.value = "ver";
  factorSeleccionado.value = factor;
  cargarFactorEnFormulario(factor);
  modalFactor.value = true;
};

const editarFactor = (item) => {
  if (!esAdministrador.value) return;
  const factor = obtenerRaw(item);
  modo.value = "editar";
  factorSeleccionado.value = factor;
  cargarFactorEnFormulario(factor);
  modalFactor.value = true;
};

const cerrarModal = () => {
  modalFactor.value = false;
  limpiarFormulario();
};

const guardarFactor = async () => {
  if (modo.value === "ver" || !esAdministrador.value) return;

  const validacion = await formRef.value?.validate();
  if (validacion && validacion.valid === false) return;

  guardando.value = true;

  try {
    const factor = new FactorModel({
      proceso_id: procesoId.value,
      nombre: formulario.value.nombre,
      descripcion: formulario.value.descripcion,
      calificacion: formulario.value.calificacion || "",
      orden:
        formulario.value.orden === "" ||
        formulario.value.orden === null ||
        formulario.value.orden === undefined
          ? null
          : Number(formulario.value.orden),
      caracteristicas: formulario.value.caracteristicas || [],
      activo: formulario.value.activo,
    });

    if (modo.value === "editar") {
      const id = formulario.value.factor_id || formulario.value.id;
      await factoresService.actualizar(id, factor);
    } else {
      await factoresService.crear(factor);
    }

    cerrarModal();
    await traerFactores();

    await Swal.fire({
      title: modo.value === "editar" ? "¡Actualizado!" : "¡Creado!",
      text: modo.value === "editar"
        ? "El factor se ha actualizado correctamente."
        : "El factor se ha creado correctamente.",
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
    console.error("Error al guardar factor:", error?.response?.data || error);

    await Swal.fire({
      title: "Error",
      text:
        error?.response?.data?.detalle ||
        error?.response?.data?.error ||
        "No fue posible guardar el factor.",
      icon: "error",
      width: "350px",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
      },
      buttonsStyling: false,
    });
  } finally {
    guardando.value = false;
  }
};

const cambiarEstadoFactor = async (item, activo) => {
  if (!esAdministrador.value) return;

  const factor = obtenerRaw(item);
  const id = factor.factor_id || factor.id;
  const accion = activo ? "reactivar" : "desactivar";

  const resultado = await Swal.fire({
    title: activo ? "Reactivar Factor" : "Desactivar Factor",
    html: `¿Desea ${accion} el factor <b>${factor.nombre}</b>?`,
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
      await factoresService.actualizarParcial(id, { activo: true });
    } else {
      await factoresService.desactivar(id);
    }

    await traerFactores();
  } catch (error) {
    console.error("Error al cambiar estado del factor:", error?.response?.data || error);
    Swal.fire({
      title: "Error",
      text: "No fue posible actualizar el estado del factor.",
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

const desactivarFactor = (item) => cambiarEstadoFactor(item, false);
const reactivarFactor = (item) => cambiarEstadoFactor(item, true);

const dirigirseFactor = (item) => {
  const factor = obtenerRaw(item);
  const id = factor.factor_id || factor.id;

  factorStore.setFactor({
    id: factor.id,
    factor_id: factor.factor_id || factor.id,
    proceso_id: factor.proceso_id,
    nombre: factor.nombre,
    descripcion: factor.descripcion,
    calificacion: factor.calificacion,
    orden: factor.orden ?? null,
    activo: factor.activo,
  });

  router.push({
    name: "factorEstructurasGestion",
    params: {
      proceso_id: procesoId.value,
      factor_id: id,
    },
  });
};

const volverProcesos = () => {
  router.push({ name: "procesos" });
};

watch(
  () => userStore.user?.role,
  (nuevoRol) => {
    if (Array.isArray(nuevoRol) && nuevoRol.length) {
      roleUsuario.value = normalizarRoles(nuevoRol);
    }
  },
  { immediate: true }
);

onMounted(async () => {
  await Promise.all([traerProceso(), traerFactores()]);
});
</script>

<style scoped>
.proceso-factores {
  width: 94%;
  max-width: 1280px;
  margin: 16px auto 48px;
  font-family: Arial, Helvetica, sans-serif;
  color: #263238;
}

.flow-nav {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 12px;
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
.info-card__label,
.section-header__label,
.factor-card__label {
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
.factor-card__label {
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

.buscador__factores {
  max-width: 320px;
  min-width: 240px;
}

.factores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(275px, 1fr));
  gap: 16px;
  margin-top: 14px;
}

.factor-card {
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

.factor-card:hover {
  transform: translateY(-3px);
  border-color: #9ebbd6;
  box-shadow: 0 10px 24px rgba(25, 55, 90, 0.14);
}

.factor-card--inactive {
  cursor: default;
  opacity: 0.74;
}

.factor-card__top,
.factor-card__footer,
.factor-card__crud,
.factor-card__meta span {
  display: flex;
  align-items: center;
}

.factor-card__top,
.factor-card__footer {
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
}

.factor-card__icon {
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

.factor-card__content {
  margin-top: 16px;
  min-width: 0;
  overflow: hidden;
}

.factor-card h3 {
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

.factor-card p {
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

.factor-card__meta {
  display: grid;
  gap: 6px;
  margin-top: 14px;
  min-width: 0;
  overflow: hidden;
  color: #607d8b;
  font-size: 12px;
  font-weight: 700;
}

.factor-card__meta span {
  gap: 6px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.factor-card__footer {
  flex-wrap: wrap;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
}

.factor-card__crud {
  flex: 0 1 auto;
  flex-wrap: wrap;
  gap: 2px;
}

.factor-card .v-chip {
  max-width: 100%;
}

.factor-card .v-btn {
  min-width: 0;
}

@media (max-width: 700px) {
  .section-header {
    align-items: stretch;
    flex-direction: column;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .section-header__actions,
  .buscador__factores {
    width: 100%;
    max-width: none;
  }

  .factores-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .proceso-factores {
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
}
</style>
