<template>
    <v-card>
      <v-card-title class="titulo-modal">
        {{ isEditing ? 'Modificar Observatorio' : 'Ver Observatorio' }}
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="guardarObservatorio">
          <v-text-field :disabled="!isEditing" v-model="nombre" label="Nombre del Observatorio" outlined required variant="outlined"
          density="comfortable"/>
          <v-textarea :disabled="!isEditing" v-model="descripcion" label="Descripción" outlined variant="outlined"
          density="comfortable" required/>
          <v-file-input v-if="isEditing" label="Cambiar Imagen" outlined @change="cargarImagen" variant="outlined"
          density="comfortable"/>
        </v-form>
        <div v-if="imagenUrl" class="mt-4 text-center">
          <v-img :src="imagenUrl" alt="Imagen observatorio" contain max-height="200" max-width="100%"></v-img>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="outlined" color="primary" text @click="cancelar">Cancelar</v-btn>
        <v-btn variant="flat" v-if="isEditing" color="primary" @click="guardarObservatorio">Modificar</v-btn>
      </v-card-actions>
    </v-card>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps } from 'vue';

const props = defineProps({
  value: Boolean,
  observatorio: Object,
  modo: Boolean
});
const emit = defineEmits(['cerrar', 'update:value', 'guardar']);

const dialog = ref(props.value);
const isEditing = ref(props.modo);
const nombre = ref(props.observatorio?.nombre || '');
const descripcion = ref(props.observatorio?.descripcion || '');
const imagen = ref(null);
const imagenUrl = ref(props.observatorio?.imagenUrl || null);

watch(() => props.value, (val) => {
  dialog.value = val;
});

watch(dialog, (val) => {
  emit('update:value', val);
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

const habilitarEdicion = () => {
  isEditing.value = true;
};

const guardarObservatorio = () => {
  const formData = new FormData();
  formData.append('nombre', nombre.value);
  formData.append('descripcion', descripcion.value);
  if (imagen.value) {
    formData.append('imagen', imagen.value);
  }
  console.log('Datos guardados', Object.fromEntries(formData));
  emit('guardar', {
    nombre: nombre.value,
    descripcion: descripcion.value,
    imagenUrl: imagenUrl.value
  });
  isEditing.value = false;
};

const cancelar = () => {
  emit('cerrar');
};
</script>

<style>
  /* Personalización si se requiere */
</style>
