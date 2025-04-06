<template>
  <v-card>
    <v-card-title class="titulo-modal">Filtrar</v-card-title>
    <v-card-text>
      <v-form
        @submit.prevent="crearEstructura"
        v-if="Object.keys(campos).length > 0"
      >
        <v-text-field
          v-for="(campo, index) in Object.keys(campos)"
          :key="index"
          v-model="campos[`${campo}`]"
          :label="campo"
          variant="outlined"
          density="comfortable"
          required
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn variant="flat" color="primary" @click="crearEstructura"
        >Filtrar</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, defineEmits, defineProps, onMounted } from "vue";
import peticionAPI from "@/service/conexion_api";
import Swal from "sweetalert2";

const props = defineProps({
  campos: Object,
  idEstructura: String,
});
const emit = defineEmits(["cerrar", "crear", "filtrar"]);
const campos = ref({});

const armarFormulario = () => {
  for (const element of props.campos) {
    campos.value[`${element.nombre}`] = "";
  }
};
const crearEstructura = () => {
  emit("filtrar", campos.value);
};
onMounted(() => {
  armarFormulario();
});
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
.select__tipos {
  padding: 5px;
  cursor: pointer;
}
.select__tipos:hover {
  background-color: var(--color-claro);
}
.campos__field {
  max-width: 50%;
}
</style>
 