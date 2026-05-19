<template>
  <v-card>
    <v-card-title class="titulo-modal">
      {{ esVer ? "Ver registro" : "Editar registro" }}
    </v-card-title>

    <v-card-text>
      <v-form
        ref="formRef"
        @submit.prevent="guardarCambios"
        v-if="camposNormalizados.length > 0"
      >
        <div
          v-for="campo in camposNormalizados"
          :key="campo.nombre_campo"
          class="campo-form"
        >
          <v-text-field
            v-if="esTexto(campo.tipo_campo)"
            v-model="formulario[campo.nombre_campo]"
            :label="campo.nombre_campo"
            :disabled="esVer"
            variant="outlined"
            density="comfortable"
            clearable
          />

          <v-text-field
            v-else-if="esEntero(campo.tipo_campo)"
            v-model="formulario[campo.nombre_campo]"
            :label="campo.nombre_campo"
            :rules="[validarCampo(campo)]"
            :disabled="esVer"
            type="number"
            variant="outlined"
            density="comfortable"
            clearable
          />

          <v-text-field
            v-else-if="esDecimal(campo.tipo_campo)"
            v-model="formulario[campo.nombre_campo]"
            :label="campo.nombre_campo"
            :rules="[validarCampo(campo)]"
            :disabled="esVer"
            type="number"
            step="any"
            variant="outlined"
            density="comfortable"
            clearable
          />

          <v-select
            v-else-if="campo.tipo_campo === 'boolean'"
            v-model="formulario[campo.nombre_campo]"
            :label="campo.nombre_campo"
            :items="opcionesBooleanas"
            item-title="label"
            item-value="value"
            :disabled="esVer"
            variant="outlined"
            density="comfortable"
            clearable
          />

          <v-text-field
            v-else-if="esFecha(campo.tipo_campo)"
            v-model="formulario[campo.nombre_campo]"
            :label="campo.nombre_campo"
            :rules="[validarCampo(campo)]"
            :disabled="esVer"
            type="date"
            variant="outlined"
            density="comfortable"
            clearable
          />

          <v-textarea
            v-else
            v-model="formulario[campo.nombre_campo]"
            :label="`${campo.nombre_campo} (${campo.tipo_campo})`"
            :rules="[validarCampo(campo)]"
            :disabled="esVer"
            variant="outlined"
            density="comfortable"
            rows="3"
            auto-grow
            clearable
          />
        </div>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer />

      <v-btn
        variant="outlined"
        color="primary"
        @click="cancelar"
      >
        Cerrar
      </v-btn>

      <v-btn
        v-if="!esVer"
        variant="flat"
        color="primary"
        :loading="guardando"
        @click="guardarCambios"
      >
        Guardar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import Swal from "sweetalert2";

import { camposService } from "@/service/campos.service";

const props = defineProps({
  esVer: {
    type: Boolean,
    default: false,
  },
  idEstructura: {
    type: String,
    required: true,
  },
  campos: {
    type: Array,
    default: () => [],
  },
  registro: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["cerrar"]);

const formRef = ref(null);
const guardando = ref(false);
const formulario = reactive({});

const opcionesBooleanas = [
  { label: "Verdadero", value: true },
  { label: "Falso", value: false },
];

const camposNormalizados = computed(() => {
  return props.campos
    .filter((campo) => campo?.nombre_campo)
    .map((campo) => ({
      nombre_campo: campo.nombre_campo,
      tipo_campo: campo.tipo_campo || "text",
    }));
});

watch(
  () => props.registro,
  () => {
    Object.keys(formulario).forEach((key) => {
      delete formulario[key];
    });

    camposNormalizados.value.forEach((campo) => {
      formulario[campo.nombre_campo] =
        props.registro?.[campo.nombre_campo] ?? null;
    });
  },
  {
    immediate: true,
    deep: true,
  }
);

const esTexto = (tipo) => {
  return [
    "text",
    "keyword",
    "constant_keyword",
    "token_count",
    "binary",
  ].includes(tipo);
};

const esEntero = (tipo) => {
  return ["long", "integer", "short", "byte"].includes(tipo);
};

const esDecimal = (tipo) => {
  return [
    "double",
    "float",
    "half_float",
    "scaled_float",
  ].includes(tipo);
};

const esFecha = (tipo) => {
  return ["date", "date_nanos"].includes(tipo);
};

const validarCampo = (campo) => {
  return (valor) => {
    if (valor === null || valor === undefined || valor === "") {
      return true;
    }

    if (esEntero(campo.tipo_campo)) {
      return /^-?\d+$/.test(String(valor)) || "Debe ser un número entero.";
    }

    if (esDecimal(campo.tipo_campo)) {
      return !Number.isNaN(Number(valor)) || "Debe ser un número.";
    }

    if (
      [
        "object",
        "nested",
        "flattened",
        "geo_point",
        "geo_shape",
        "shape",
        "integer_range",
        "float_range",
        "long_range",
        "double_range",
        "date_range",
        "ip_range",
      ].includes(campo.tipo_campo)
    ) {
      try {
        JSON.parse(valor);
        return true;
      } catch {
        return "Debe ser un JSON válido.";
      }
    }

    return true;
  };
};

const convertirValor = (campo) => {
  const valor = formulario[campo.nombre_campo];

  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  if (esEntero(campo.tipo_campo)) {
    return parseInt(valor, 10);
  }

  if (esDecimal(campo.tipo_campo)) {
    return Number(valor);
  }

  if (campo.tipo_campo === "boolean") {
    return valor === true;
  }

  if (
    [
      "object",
      "nested",
      "flattened",
      "geo_point",
      "geo_shape",
      "shape",
      "integer_range",
      "float_range",
      "long_range",
      "double_range",
      "date_range",
      "ip_range",
    ].includes(campo.tipo_campo)
  ) {
    return JSON.parse(valor);
  }

  return valor;
};

const construirPayload = () => {
  const payload = {};

  camposNormalizados.value.forEach((campo) => {
    payload[campo.nombre_campo] = convertirValor(campo);
  });

  return payload;
};

const obtenerMensajeError = (error) => {
  const detalle = error?.response?.data?.detalle;

  if (!detalle) {
    return "No fue posible actualizar el registro.";
  }

  if (typeof detalle === "string") {
    return detalle;
  }

  return Object.entries(detalle)
    .map(([campo, mensaje]) => `${campo}: ${mensaje}`)
    .join("<br>");
};

const guardarCambios = async () => {
  if (props.esVer) {
    cancelar();
    return;
  }

  const validacion = await formRef.value?.validate();

  if (validacion && !validacion.valid) {
    return;
  }

  guardando.value = true;

  try {
    await camposService.actualizarRegistro(
      props.idEstructura,
      props.registro.id,
      construirPayload()
    );

    await Swal.fire({
      title: "¡Actualizado!",
      text: "El registro se actualizó correctamente.",
      icon: "success",
      width: "300px",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
      },
      buttonsStyling: false,
    });

    emit("cerrar", { id: props.idEstructura });
  } catch (error) {
    await Swal.fire({
      title: "Error de validación",
      html: obtenerMensajeError(error),
      icon: "error",
      width: "420px",
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

const cancelar = () => {
  emit("cerrar");
};
</script>

<style scoped>
.campo-form {
  margin-bottom: 12px;
}
</style>
