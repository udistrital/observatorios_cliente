<template>
  <v-card>
    <v-card-title class="titulo-modal"> Crear Panel </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="crearPanel">
        <v-text-field
          v-model="nombrePanel"
          label="Nombre del panel"
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
        <v-text-field
          v-model="columnas"
          type="number"
          label="Columnas"
          :min="1"
          :max="4"
          outlined
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn variant="outlined" color="primary" text @click="cancelar"
        >Cancelar</v-btn
      >
      <v-btn variant="flat" color="primary" @click="crearPanel"
        >Crear</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, defineEmits, defineProps, onMounted } from "vue";
import peticionAPI from "@/service/conexion_api";
import Swal from "sweetalert2";
import { useObservatorioStore } from "@/stores/observatorioStore";

const observatorioStore = useObservatorioStore();
const props = defineProps({
  value: Boolean,
});
const emit = defineEmits(["cerrar", "crear"]);

const nombrePanel = ref("");
const descripcion = ref("");
const columnas = ref(1)


const crearPanel = () => {
  const panel = {
    nombre: nombrePanel.value,
    descripcion: descripcion.value,
    observatorio: observatorioStore.observatorio?.id,
    columnas: columnas.value
  };
  peticionAPI("dashboards/", "POST", panel)
    .then((data) => {
      Swal.fire({
        title: "¡Creado!",
        text: "El panel se creó correctamente.",
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

onMounted(() => {
});
const cancelar = () => {
  emit("cerrar");
};
</script>

<style scoped>

.select__tipos{
  padding: 5px;
  cursor: pointer;
}
.select__tipos:hover{
  background-color: var(--color-claro);
}

</style>
   