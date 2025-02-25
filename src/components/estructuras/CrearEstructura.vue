<template>
  <v-card>
    <v-card-title class="titulo-modal"> Crear Estructura </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="crearEstructura">
        <v-text-field
          v-model="nombreEstructura"
          label="Nombre de la estructura"
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
        <div class="subcabecera">
          <h3 class="subtitulo-modal">Campos</h3>

          <v-btn icon color="primary" density="compact" @click="agregarCampo">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
        <div class="contenedor-campos">
          <div
            v-for="(campo, index) in campos"
            :key="index"
            class="d-flex align-center mb-2"
          >
            <v-text-field
              hide-details="true"
              v-model="campo.nombre"
              label="Nombre del Campo"
              class="mr-2"
              variant="outlined"
              density="comfortable"
              required
            ></v-text-field>
            <v-select
              hide-details="true"
              v-model="campo.tipo"
              :items="tiposDeDato"
              label="Tipo de dato"
              variant="outlined"
              density="comfortable"
              required
            ></v-select>
            <v-btn
              icon
              variant="plain"
              density="comfortable"
              color="primary"
              @click="eliminarCampo(index)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </div>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn variant="outlined" color="primary" text @click="cancelar"
        >Cancelar</v-btn
      >
      <v-btn variant="flat" color="primary" @click="crearEstructura"
        >Crear</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, defineEmits, defineProps } from "vue";

const props = defineProps({
  value: Boolean,
});
const emit = defineEmits(["cerrar", "crear"]);

const dialog = ref(props.value);
const nombreEstructura = ref("");
const descripcion = ref("");
const tiposDeDato = ref(["String", "Number", "Boolean", "Date"]);
const campos = ref([{ nombre: "", tipo: "String" }]);

const agregarCampo = () => {
  campos.value.push({ nombre: "", tipo: "String" });
};

const eliminarCampo = (index) => {
  campos.value.splice(index, 1);
};

const crearEstructura = () => {
  const estructura = {
    nombre: nombreEstructura.value,
    descripcion: descripcion.value,
    campos: campos.value,
  };
  emit("crear", estructura);
  emit("cerrar");
};

const cancelar = () => {
  emit("cerrar");
};
</script>

<style scoped>
.contenedor-campos {
  padding: 15px 5px;
  border-radius: 8px;
  max-height: 30vh;
  overflow-y: auto;
}
</style>
