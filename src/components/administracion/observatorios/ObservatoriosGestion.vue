<template>
  <v-card v-if="observatorio">
    <v-card-title class="titulo-modal">
      {{ isEditing ? "Modificar Observatorio" : "Ver Observatorio" }}
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="guardarObservatorio">
        <v-text-field
          :disabled="!isEditing"
          v-model="nombre"
          label="Nombre del Observatorio"
          outlined
          required
          variant="outlined"
          density="comfortable"
        />
        <v-textarea
          :disabled="!isEditing"
          v-model="descripcion"
          label="Descripción"
          outlined
          variant="outlined"
          density="comfortable"
          required
        />
        <v-file-input
          v-if="isEditing"
          label="Cambiar Imagen"
          outlined
          @change="cargarImagen"
          variant="outlined"
          density="comfortable"
          accept=".jpg,.jpeg,.png,.webp,.svg"
        />
      </v-form>
      <div v-if="imagenUrl" class="mt-4 text-center">
        <v-img
          :src="imagenUrl"
          alt="Imagen cargada"
          contain
          max-height="200"
          max-width="100%"
        ></v-img>
      </div>
      <div v-else class="mt-4 text-center">
        <v-img
          :src="imageSrc"
          alt="Imagen observatorio"
          contain
          max-height="200"
          max-width="100%"
        ></v-img>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn variant="outlined" color="primary" text @click="cancelar"
        >Cerrar</v-btn
      >
      <v-btn
        variant="flat"
        v-if="isEditing"
        color="primary"
        @click="guardarObservatorio"
        >Modificar</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps, onMounted } from "vue";
import peticionAPI from "../../../service/conexion_api";
import Swal from "sweetalert2";

const props = defineProps({
  value: Boolean,
  observatorio: Object,
  modo: Boolean,
});
const emit = defineEmits(["cerrar", "update:value", "guardar"]);

const dialog = ref(props.value);
const isEditing = ref(props.modo);
const nombre = ref(props.observatorio?.nombre || "");
const descripcion = ref(props.observatorio?.descripcion || "");
const imagen = ref(null);
const imagenUrl = ref(props.observatorio?.imagenUrl || null);
const imageSrc = ref("");
const imageFormats = {
  "/9j/": "jpeg",
  iVBORw0KG: "png",
  R0lGOD: "gif",
  UklGR: "webp",
};

function detectImageFormat(base64) {
  const firstChars = base64.substring(0, 10);
  for (const prefix in imageFormats) {
    if (firstChars.startsWith(prefix)) {
      return imageFormats[prefix];
    }
  }
  return "jpeg";
}

watch(
  () => props.value,
  (val) => {
    dialog.value = val;
  }
);

watch(dialog, (val) => {
  emit("update:value", val);
});

const cargarImagen = (event) => {
  const file = event.target.files[0];
  if (file) {
    imagen.value = file;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      imagenUrl.value = reader.result;
    };
  }
};

const guardarObservatorio = () => {
  const formData = new FormData();
  formData.append("nombre", nombre.value);
  formData.append("descripcion", descripcion.value);
  if (imagen.value) {
    formData.append("imagen", imagen.value);
  }
  peticionAPI(`/observatorios/${props.observatorio.observatorio_id}/`, "PUT", formData)
    .then((data) => {
      Swal.fire({
        title: "¡Actualizado!",
        text: "El observatorio se modificó correctamente.",
        icon: "success",
        width: "300px",
        customClass: {
          popup: "popup-personalizado",
          title: "titulo-alerta-personalizado",
          confirmButton: "confirmacion-alerta-personalizado",
        },
        showConfirmButton: false,
        timer: 1500
      });
      setTimeout(() => {
        emit("cerrar");
      }, 1000);
    })
    .catch((error) => console.error(error));
};

const cancelar = () => {
  emit("cerrar");
};

onMounted(() => {
  const data = props.observatorio.imagen;

  if (!data || typeof data !== "string") {
    console.error("La imagen en Base64 no es válida");
    return;
  }

  if (data.startsWith("data:image/")) {
    imageSrc.value = data;
  } else {
    const format = detectImageFormat(data);
    imageSrc.value = `data:image/${format};base64,${data}`;
  }
});
</script>

<style>
/* Personalización si se requiere */
</style>
