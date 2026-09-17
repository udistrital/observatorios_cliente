<template>
  <div class="factores">
    <div class="cabecera">
      <h1 class="titulo__cabecera">Administración de Factores</h1>

      <v-spacer />

      <div class="acciones-cabecera">
        <v-btn
          color="primary"
          variant="tonal"
          prepend-icon="mdi-clipboard-text-outline"
          @click="abrirCrearProceso"
        >
          Crear Proceso
        </v-btn>

        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="abrirCrearFactor"
        >
          Crear Factor
        </v-btn>
      </div>
    </div>

    <v-card>
      <div class="cabecera__tabla">
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h5">Factores</span>
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
        :items="factoresFiltrados"
        :loading="cargando"
        item-value="factor_id"
        class="elevation-1"
        no-data-text="No se encontraron datos"
        items-per-page-text="Elementos por página:"
      >
        <template #loading>
          <v-skeleton-loader type="table" />
        </template>

        <template v-slot:[`item.factor_id`]="{ item }">
          {{ obtenerRaw(item).factor_id || obtenerRaw(item).id }}
        </template>

        <template v-slot:[`item.proceso_id`]="{ item }">
          {{ obtenerNombreProceso(obtenerRaw(item).proceso_id) }}
        </template>

        <template v-slot:[`item.activo`]="{ item }">
          <v-chip :color="obtenerRaw(item).activo ? 'green' : 'red'" dark>
            {{ obtenerRaw(item).activo ? "Activo" : "Inactivo" }}
          </v-chip>
        </template>

        <template v-slot:[`item.acciones`]="{ item }">
          <v-btn
            variant="text"
            icon
            size="small"
            @click="verFactor(item)"
            color="primary"
            title="Ver factor"
          >
            <v-icon>mdi-eye</v-icon>
          </v-btn>

          <v-btn
            variant="text"
            icon
            size="small"
            @click="editarFactor(item)"
            color="primary"
            title="Editar factor"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>

          <v-btn
            v-if="obtenerRaw(item).activo"
            variant="text"
            icon
            size="small"
            @click="desactivarFactor(item)"
            color="warning"
            title="Desactivar factor"
          >
            <v-icon>mdi-cancel</v-icon>
          </v-btn>

          <v-btn
            v-else
            variant="text"
            icon
            size="small"
            @click="reactivarFactor(item)"
            color="primary"
            title="Reactivar factor"
          >
            <v-icon>mdi-sync</v-icon>
          </v-btn>

          <v-btn
            v-if="obtenerRaw(item).activo"
            variant="text"
            icon
            size="small"
            @click="dirigirseFactor(item)"
            color="primary"
            title="Ir al factor"
          >
            <v-icon>mdi-arrow-top-right-thick</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <ProcesoFormDialog
      ref="procesoFormDialogRef"
      :puede-editar-orden="esAdministrador"
      @proceso-creado="alCrearProceso"
    />

    <!-- Modal crear / editar / ver -->
    <v-dialog
      v-model="modalFactor"
      scrollable
      max-width="600px"
      transition="dialog-transition"
      max-height="85vh"
    >
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
            <v-select
              v-model="formulario.proceso_id"
              :items="procesosSelectItems"
              item-title="etiqueta"
              item-value="id"
              label="Proceso"
              variant="outlined"
              density="comfortable"
              no-data-text="No hay procesos activos"
              :readonly="modo === 'ver'"
              :disabled="modo === 'ver'"
              :rules="[reglas.requerido]"
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

            <v-switch
              v-model="formulario.activo"
              label="Activo"
              color="primary"
              :disabled="modo === 'ver'"
            />

            <v-text-field
              v-if="modo !== 'crear'"
              v-model="formulario.fecha_creacion"
              label="Fecha creación"
              variant="outlined"
              density="comfortable"
              readonly
            />

            <v-text-field
              v-if="modo !== 'crear'"
              v-model="formulario.fecha_modificacion"
              label="Fecha modificación"
              variant="outlined"
              density="comfortable"
              readonly
            />
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn variant="text" @click="cerrarModal">
            Cancelar
          </v-btn>

          <v-btn
            v-if="modo !== 'ver'"
            color="primary"
            :loading="guardando"
            @click="guardarFactor"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useFactorStore } from "@/stores/factorStore";

import ProcesoFormDialog from "@/components/procesos/ProcesoFormDialog.vue";
import { procesosService } from "@/service/procesos.service";

import { factoresService } from "../../service/factores.service";
import { FactorModel } from "../../model/factor.model";

import { useUserStore } from "@/stores/userStore";
import { esAdminObservatorios } from "@/utils/roles";
import { ordenarPorOrden } from "@/utils/orden";

const router = useRouter();

const factorStore = useFactorStore();

const userStore = useUserStore();

const esAdministrador = computed(() =>
  esAdminObservatorios(userStore.user?.role)
);

const search = ref("");
const factores = ref([]);
const cargando = ref(false);
const guardando = ref(false);

const procesos = ref([]);
const cargandoProcesos = ref(false);
const procesoFormDialogRef = ref(null);

const modalFactor = ref(false);
const modo = ref("crear");
const factorSeleccionado = ref(null);
const formRef = ref(null);

const formulario = ref({
  id: null,
  factor_id: null,
  proceso_id: "",
  nombre: "",
  descripcion: "",
  calificacion: "",
  caracteristicas: [],
  orden: null,
  activo: true,
  fecha_creacion: "",
  fecha_modificacion: "",
});

const headers = ref([
  { title: "ID del Factor", key: "factor_id", align: "center" },
  { title: "Proceso", key: "proceso_id", align: "center" },
  { title: "Nombre", key: "nombre", align: "center" },
  { title: "Orden", key: "orden", align: "center" },
  { title: "Estado", key: "activo", align: "center" },
  { title: "Acciones", key: "acciones", sortable: false, align: "center" },
]);

const reglas = {
  requerido: (value) => !!value || "Este campo es obligatorio",
  float: (value) =>
    value === "" ||
    value === null ||
    value === undefined ||
    /^\d+(\.\d+)?$/.test(String(value)) ||
    "La calificación debe ser un número decimal.",
  enteroNoNegativo: (value) =>
    value === "" ||
    value === null ||
    value === undefined ||
    /^\d+$/.test(String(value)) ||
    "El orden debe ser un número entero mayor o igual a cero.",
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

const tituloModal = computed(() => {
  if (modo.value === "crear") return "Crear Factor";
  if (modo.value === "editar") return "Editar Factor";
  return "Ver Factor";
});

const obtenerNombreProceso = (procesoId) => {
  if (!procesoId) return "Sin proceso";

  const proceso = procesos.value.find((item) => {
    const id = item.proceso_id || item.id;
    return id === procesoId;
  });

  return proceso?.nombre || procesoId;
};

const traerProcesos = async () => {
  cargandoProcesos.value = true;
  procesos.value = [];

  try {
    const data = await procesosService.listar();
    procesos.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error al cargar procesos:", error?.response?.data || error);

    Swal.fire({
      title: "Error",
      text: "No fue posible cargar los procesos.",
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
    cargandoProcesos.value = false;
  }
};

const factoresFiltrados = computed(() => {
  const filtrados = search.value
    ? factores.value.filter((factor) => {
        const item = obtenerRaw(factor);
        const texto = search.value.toLowerCase();

        return (
          item.nombre?.toLowerCase().includes(texto) ||
          item.descripcion?.toLowerCase().includes(texto) ||
          String(item.factor_id || item.id || "").toLowerCase().includes(texto)
        );
      })
    : factores.value;

  return ordenarPorOrden(filtrados.map((item) => obtenerRaw(item)));
});

const procesosActivos = computed(() => {
  return procesos.value.filter((proceso) => proceso.activo !== false);
});

const procesosSelectItems = computed(() => {
  return procesosActivos.value.map((proceso) => {
    const id = proceso.proceso_id || proceso.id;

    return {
      ...proceso,
      id,
      etiqueta: proceso.nombre || id,
    };
  });
});

const obtenerRaw = (item) => {
  return item?.raw || item;
};

const traerFactores = async () => {
  cargando.value = true;
  factores.value = [];

  try {
    const data = await factoresService.listar();

    factores.value = data;

    localStorage.setItem("factores_espacios", JSON.stringify(factores.value));
  } catch (error) {
    console.error(error);

    Swal.fire({
      title: "Error",
      text: "No fue posible cargar los factores.",
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
    proceso_id: "",
    nombre: "",
    descripcion: "",
    calificacion: "",
    caracteristicas: [],
    orden: null,
    activo: true,
    fecha_creacion: "",
    fecha_modificacion: "",
  };

  factorSeleccionado.value = null;
};

const abrirCrearProceso = () => {
  procesoFormDialogRef.value?.abrir();
};

const alCrearProceso = async (procesoCreado) => {
  await traerProcesos();

  if (procesoCreado) {
    formulario.value.proceso_id =
      procesoCreado.proceso_id || procesoCreado.id || "";
  }
};

const abrirCrearFactor = async () => {
  if (procesos.value.length === 0) {
    await traerProcesos();
  }

  limpiarFormulario();
  modo.value = "crear";
  modalFactor.value = true;
};

const cerrarModal = () => {
  modalFactor.value = false;
  limpiarFormulario();
};

const verFactor = (item) => {
  const factor = obtenerRaw(item);

  modo.value = "ver";
  factorSeleccionado.value = factor;

  formulario.value = {
    id: factor.id || null,
    factor_id: factor.factor_id || factor.id || null,
    proceso_id: factor.proceso_id || "",
    nombre: factor.nombre || "",
    descripcion: factor.descripcion || "",
    calificacion: factor.calificacion || "",
    caracteristicas: Array.isArray(factor.caracteristicas)
      ? factor.caracteristicas
      : [],
    orden: factor.orden ?? null,
    activo: factor.activo !== false,
    fecha_creacion: factor.fecha_creacion || "",
    fecha_modificacion: factor.fecha_modificacion || "",
  };

  modalFactor.value = true;
};

const editarFactor = (item) => {
  const factor = obtenerRaw(item);

  modo.value = "editar";
  factorSeleccionado.value = factor;

  formulario.value = {
    id: factor.id || null,
    factor_id: factor.factor_id || factor.id || null,
    proceso_id: factor.proceso_id || "",
    nombre: factor.nombre || "",
    descripcion: factor.descripcion || "",
    calificacion: factor.calificacion || "",
    caracteristicas: Array.isArray(factor.caracteristicas)
      ? factor.caracteristicas
      : [],
    orden: factor.orden ?? null,
    activo: factor.activo !== false,
    fecha_creacion: factor.fecha_creacion || "",
    fecha_modificacion: factor.fecha_modificacion || "",
  };

  modalFactor.value = true;
};

const guardarFactor = async () => {
  if (modo.value === "ver") return;

  const validacion = await formRef.value?.validate();

  if (validacion && validacion.valid === false) {
    return;
  }

  guardando.value = true;

  try {
    const datosFactor = {
      proceso_id: formulario.value.proceso_id,
      nombre: formulario.value.nombre,
      descripcion: formulario.value.descripcion,
      calificacion: formulario.value.calificacion || "",
      caracteristicas: formulario.value.caracteristicas || [],
      activo: formulario.value.activo,
    };

    if (esAdministrador.value) {
      datosFactor.orden =
        formulario.value.orden === "" ? null : formulario.value.orden;
    }

    const factor = new FactorModel(datosFactor);

    let mensajeExito = "";

    if (modo.value === "editar") {
      const id = formulario.value.factor_id || formulario.value.id;

      await factoresService.actualizar(id, factor);

      mensajeExito = "El factor se ha actualizado correctamente.";
    } else {
      await factoresService.crear(factor);

      mensajeExito = "El factor se ha creado correctamente.";
    }

    guardando.value = false;
    cerrarModal();

    await Promise.all([
      traerFactores(),
      traerProcesos(),
    ]);

    await Swal.fire({
      title: modo.value === "editar" ? "¡Actualizado!" : "¡Creado!",
      text: mensajeExito,
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

const reactivarFactor = async (item) => {
  const factor = obtenerRaw(item);
  const id = factor.factor_id || factor.id;
  const nombre = factor.nombre;

  const resultado = await Swal.fire({
    title: "Reactivar Factor",
    html: `¿Desea reactivar el factor <b>${nombre}</b>?`,
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
    await factoresService.actualizarParcial(id, {
      activo: true,
    });

    await Swal.fire({
      title: "¡Activado!",
      text: "El factor se ha reactivado correctamente.",
      icon: "success",
      width: "300px",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
      },
      buttonsStyling: false,
    });

    await traerFactores();
  } catch (error) {
    console.error("Error al reactivar factor:", error?.response?.data || error);

    Swal.fire({
      title: "Error",
      text: "No fue posible reactivar el factor.",
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

const desactivarFactor = async (item) => {
  const factor = obtenerRaw(item);
  const id = factor.factor_id || factor.id;
  const nombre = factor.nombre;

  const resultado = await Swal.fire({
    title: "Desactivar Factor",
    html: `¿Desea desactivar el factor <b>${nombre}</b>? No podrá acceder a este espacio después de hacerlo.`,
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
    await factoresService.desactivar(id);

    await Swal.fire({
      title: "¡Desactivado!",
      text: "El factor ha sido desactivado correctamente.",
      icon: "success",
      width: "300px",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
      },
      buttonsStyling: false,
    });

    await traerFactores();
  } catch (error) {
    console.error(error);

    Swal.fire({
      title: "Error",
      text: "No fue posible desactivar el factor.",
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
    name: factor.proceso_id ? "factorEstructurasGestion" : "estructuras",
    params: {
      ...(factor.proceso_id ? { proceso_id: factor.proceso_id } : {}),
      factor_id: id,
    },
  });
};

onMounted(async () => {
  await Promise.all([
    traerProcesos(),
    traerFactores(),
  ]);
});
</script>

<style scoped>
.cabecera {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
}

.acciones-cabecera {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.factores {
  width: 90%;
  margin: 40px auto;
}

.v-card-title {
  background-color: #ffffff;
}

.contenedor-imagen {
  margin-top: 12px;
}

.preview-imagen {
  width: 100%;
  max-height: 220px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
  background-color: #f5f5f5;
}

.preview-imagen img {
  width: 100%;
  max-height: 220px;
  object-fit: contain;
  display: block;
}

@media (max-width: 700px) {
  .cabecera {
    align-items: flex-start;
    flex-direction: column;
  }

  .acciones-cabecera {
    width: 100%;
  }
}
</style>
