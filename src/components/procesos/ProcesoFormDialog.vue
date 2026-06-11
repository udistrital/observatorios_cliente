<template>
  <v-dialog
    v-model="modalProceso"
    scrollable
    max-width="650px"
    transition="dialog-transition"
    max-height="85vh"
  >
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span>{{ tituloModal }}</span>

        <v-btn icon variant="text" @click="cerrar">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text>
        <v-form ref="formRef" @submit.prevent="guardarProceso">
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
            rows="4"
            :readonly="modo === 'ver'"
            :rules="[reglas.requerido]"
          />

          <v-text-field
            v-model="formulario.dependencia_responsable"
            label="Dependencia responsable"
            variant="outlined"
            density="comfortable"
            :readonly="modo === 'ver'"
          />

          <v-textarea
            v-model="formulario.objetivo"
            label="Objetivo"
            variant="outlined"
            density="comfortable"
            rows="3"
            :readonly="modo === 'ver'"
          />

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formulario.fecha_inicio"
                label="Fecha inicio"
                type="date"
                variant="outlined"
                density="comfortable"
                :readonly="modo === 'ver'"
                :rules="[reglas.requerido]"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formulario.fecha_fin"
                label="Fecha fin"
                type="date"
                variant="outlined"
                density="comfortable"
                :readonly="modo === 'ver'"
                :rules="[reglas.requerido]"
              />
            </v-col>
          </v-row>

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

        <v-btn variant="text" @click="cerrar">
          Cancelar
        </v-btn>

        <v-btn
          v-if="modo !== 'ver'"
          color="primary"
          :loading="guardando"
          @click="guardarProceso"
        >
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref, defineEmits, defineExpose } from "vue";
import Swal from "sweetalert2";

import { procesosService } from "@/service/procesos.service";
import { ProcesoModel } from "@/model/proceso.model";

const emit = defineEmits(["proceso-creado", "proceso-actualizado", "proceso-guardado"]);

const modalProceso = ref(false);
const guardando = ref(false);
const formRef = ref(null);
const modo = ref("crear");
const procesoSeleccionado = ref(null);

const formulario = ref({
  nombre: "",
  descripcion: "",
  dependencia_responsable: "",
  objetivo: "",
  factores: [],
  fecha_inicio: "",
  fecha_fin: "",
  activo: true,
});

const reglas = {
  requerido: (value) => !!value || "Este campo es obligatorio",
};

const tituloModal = computed(() => {
  if (modo.value === "editar") return "Editar Proceso";
  if (modo.value === "ver") return "Ver Proceso";
  return "Crear Proceso";
});

const limpiarFormulario = () => {
  formulario.value = {
    nombre: "",
    descripcion: "",
    dependencia_responsable: "",
    objetivo: "",
    factores: [],
    fecha_inicio: "",
    fecha_fin: "",
    activo: true,
  };

  procesoSeleccionado.value = null;
};

const cargarFormulario = (proceso = {}) => {
  formulario.value = {
    nombre: proceso.nombre || "",
    descripcion: proceso.descripcion || "",
    dependencia_responsable: proceso.dependencia_responsable || "",
    objetivo: proceso.objetivo || "",
    factores: Array.isArray(proceso.factores) ? proceso.factores : [],
    fecha_inicio: proceso.fecha_inicio || "",
    fecha_fin: proceso.fecha_fin || "",
    activo: proceso.activo !== false,
  };
};

const abrir = (nuevoModo = "crear", proceso = null) => {
  modo.value = nuevoModo;
  procesoSeleccionado.value = proceso;

  if (proceso) {
    cargarFormulario(proceso);
  } else {
    limpiarFormulario();
  }

  modalProceso.value = true;
};

const cerrar = () => {
  modalProceso.value = false;
  limpiarFormulario();
};

const guardarProceso = async () => {
  if (modo.value === "ver") return;

  const validacion = await formRef.value?.validate();

  if (validacion && validacion.valid === false) {
    return;
  }

  guardando.value = true;

  try {
    const proceso = new ProcesoModel({
      nombre: formulario.value.nombre,
      descripcion: formulario.value.descripcion,
      dependencia_responsable: formulario.value.dependencia_responsable,
      objetivo: formulario.value.objetivo,
      factores: [],
      fecha_inicio: formulario.value.fecha_inicio,
      fecha_fin: formulario.value.fecha_fin,
      activo: formulario.value.activo,
    });

    let procesoGuardado = null;
    let mensajeExito = "El proceso se ha creado correctamente.";

    if (modo.value === "editar") {
      const id = procesoSeleccionado.value?.proceso_id || procesoSeleccionado.value?.id;
      procesoGuardado = await procesosService.actualizar(id, proceso);
      mensajeExito = "El proceso se ha actualizado correctamente.";
      emit("proceso-actualizado", procesoGuardado);
    } else {
      procesoGuardado = await procesosService.crear(proceso);
      emit("proceso-creado", procesoGuardado);
    }

    guardando.value = false;
    cerrar();

    emit("proceso-guardado", procesoGuardado);

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
    console.error("Error al guardar proceso:", error?.response?.data || error);

    await Swal.fire({
      title: "Error",
      text:
        error?.response?.data?.detalle ||
        error?.response?.data?.error ||
        "No fue posible guardar el proceso.",
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

defineExpose({
  abrir,
});
</script>
