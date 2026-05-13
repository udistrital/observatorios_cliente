<template>
  <div class="factores">
    <div class="cabecera">
      <h1 class="titulo__cabecera">Administración de Factores</h1>

      <v-spacer />

      <v-btn color="primary" prepend-icon="mdi-plus" @click="abrirCrearFactor">
        Crear Factor
      </v-btn>
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
            color="primary"
            title="Desactivar factor"
          >
            <v-icon>mdi-trash-can</v-icon>
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
            <v-text-field
              v-model="formulario.nombre"
              label="Nombre"
              variant="outlined"
              density="comfortable"
              :readonly="modo === 'ver'"
              :rules="[reglas.requerido]"
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
              v-model="formulario.calificacion"
              label="Calificación"
              variant="outlined"
              density="comfortable"
              :readonly="modo === 'ver'"
            />

            <v-switch
              v-model="formulario.activo"
              label="Activo"
              color="primary"
              :disabled="modo === 'ver'"
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

import { factoresService } from "../../service/factores.service";
import { FactorModel } from "../../model/factor.model";

const router = useRouter();

const factorStore = useFactorStore();

const search = ref("");
const factores = ref([]);
const cargando = ref(false);
const guardando = ref(false);

const modalFactor = ref(false);
const modo = ref("crear");
const factorSeleccionado = ref(null);
const formRef = ref(null);

const formulario = ref({
  id: null,
  factor_id: null,
  nombre: "",
  descripcion: "",
  calificacion: "",
  activo: true,
  numero: null,
  caracteristicas: [],
});

const headers = ref([
  { title: "ID del Factor", key: "factor_id", align: "center" },
  { title: "Nombre", key: "nombre", align: "center" },
  { title: "Estado", key: "activo", align: "center" },
  { title: "Acciones", key: "acciones", sortable: false, align: "center" },
]);

const reglas = {
  requerido: (value) => !!value || "Este campo es obligatorio",
};

const tituloModal = computed(() => {
  if (modo.value === "crear") return "Crear Factor";
  if (modo.value === "editar") return "Editar Factor";
  return "Ver Factor";
});

const factoresFiltrados = computed(() => {
  if (!search.value) return factores.value;

  const textoBusqueda = search.value.toLowerCase();

  return factores.value.filter((factor) => {
    return (
      factor.nombre?.toLowerCase().includes(textoBusqueda) ||
      factor.factor_id?.toLowerCase().includes(textoBusqueda) ||
      String(factor.numero || "").includes(textoBusqueda)
    );
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
    nombre: "",
    descripcion: "",
    calificacion: "",
    activo: true,
    numero: null,
    caracteristicas: [],
  };

  factorSeleccionado.value = null;
};

const abrirCrearFactor = () => {
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
    nombre: factor.nombre || "",
    descripcion: factor.descripcion || "",
    calificacion: factor.calificacion || "",
    activo: factor.activo !== false,
    numero: factor.numero || null,
    caracteristicas: Array.isArray(factor.caracteristicas)
      ? factor.caracteristicas
      : [],
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
    nombre: factor.nombre || "",
    descripcion: factor.descripcion || "",
    calificacion: factor.calificacion || "",
    imagen: null,
    activo: factor.activo !== false,
    numero: factor.numero || null,
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
    const factor = new FactorModel({
      nombre: formulario.value.nombre,
      descripcion: formulario.value.descripcion,
      calificacion: formulario.value.calificacion || "",
      activo: formulario.value.activo,
      caracteristicas: formulario.value.caracteristicas || [],
    });

    if (modo.value === "editar") {
      const id = formulario.value.factor_id || formulario.value.id;

      await factoresService.actualizar(id, factor);

      await Swal.fire({
        title: "¡Actualizado!",
        text: "El factor se ha actualizado correctamente.",
        icon: "success",
        width: "300px",
        customClass: {
          popup: "popup-personalizado",
          title: "titulo-alerta-personalizado",
          confirmButton: "confirmacion-alerta-personalizado",
        },
        buttonsStyling: false,
      });
    } else {
      await factoresService.crear(factor);

      await Swal.fire({
        title: "¡Creado!",
        text: "El factor se ha creado correctamente.",
        icon: "success",
        width: "300px",
        customClass: {
          popup: "popup-personalizado",
          title: "titulo-alerta-personalizado",
          confirmButton: "confirmacion-alerta-personalizado",
        },
        buttonsStyling: false,
      });
    }

    cerrarModal();
    await traerFactores();
  } catch (error) {
    console.error(error);

    Swal.fire({
      title: "Error",
      text: "No fue posible guardar el factor.",
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
    title: "Deshabilitar Factor",
    html: `¿Desea inhabilitar el factor <b>${nombre}</b>? No podrá acceder a este espacio después de hacerlo.`,
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
      title: "¡Eliminado!",
      text: "El factor ha sido deshabilitado correctamente.",
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
    nombre: factor.nombre,
    descripcion: factor.descripcion,
    calificacion: factor.calificacion,
    imagen: factor.imagen,
    activo: factor.activo,
    numero: factor.numero,
  });

  router.push({
    name: "estructuras",
    params: {
      factor_id: id,
    },
  });
};

onMounted(() => {
  traerFactores();
});
</script>

<style scoped>
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
</style>
