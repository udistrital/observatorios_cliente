<template>
  <v-card>
    <v-card-title class="titulo-modal"> Crear Observatorio </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="crearObservatorio">
        <v-text-field
          v-model="nombre"
          label="Nombre del Observatorio"
          variant="outlined"
          density="comfortable"
          required
        ></v-text-field>
        <v-textarea
          v-model="descripcion"
          label="Descripción"
          variant="outlined"
          density="comfortable"
          required
        ></v-textarea>
        <v-file-input
          label="Cargar Imagen"
          outlined
          @change="cargarImagen"
          variant="outlined"
          density="comfortable"
          accept=".jpg,.jpeg,.png,.webp,.svg"
        ></v-file-input>
        <div v-if="imagenUrl" class="mt-4 text-center">
          <v-img
            :src="imagenUrl"
            alt="Imagen cargada"
            contain
            max-height="200"
            max-width="100%"
          ></v-img>
        </div>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn variant="outlined" color="primary" text @click="cancelar"
        >Cerrar</v-btn
      >
      <v-btn variant="flat" color="primary" @click="crearObservatorio"
        >Crear</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps } from "vue";
import peticionAPI from "../../../service/conexion_api";
import Swal from "sweetalert2";

const props = defineProps({
  value: Boolean,
});
const emit = defineEmits(["cerrar", "update:value"]);

const dialog = ref(props.value);
const nombre = ref("");
const descripcion = ref("");
const imagen = ref(null);
const imagenUrl = ref(null);

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

const crearObservatorio = () => {
  const formData = new FormData();
  formData.append("nombre", nombre.value);
  formData.append("descripcion", descripcion.value);
  if (imagen.value) {
    formData.append("imagen", imagen.value);
  }
  peticionAPI("/observatorios/", "POST", formData)
    .then((data) => {
      Swal.fire({
        title: "¡Creado!",
        text: "El observatorio se creó correctamente.",
        icon: "success",
        width: "300px",
        customClass: {
          popup: "popup-personalizado",
          title: "titulo-alerta-personalizado",
          confirmButton: "confirmacion-alerta-personalizado",
        },
        buttonsStyling: false,
      });
    })
    .catch((error) => console.error(error));

  emit("cerrar");
};
const cancelar = () => {
  emit("cerrar");
};
</script>

<style>
</style>
