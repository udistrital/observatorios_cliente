<template>
  <v-card>
    <v-card-title class="titulo-modal">
      {{ isEditing ? "Modificar Panel" : "Ver Panel" }}
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="guardarPanel">
        <v-text-field
          v-model="panel.nombre"
          label="Nombre de la panel"
          variant="outlined"
          density="comfortable"
          :disabled="!isEditing"
          required
        ></v-text-field>
        <v-textarea
          :disabled="!isEditing"
          v-model="panel.descripcion"
          label="Descripción"
          variant="outlined"
          density="comfortable"
          required
        ></v-textarea>
        <v-text-field
          :disabled="!isEditing"
          v-model="panel.columnas"
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
        >Cerrar</v-btn
      >
      <v-btn
        v-if="isEditing"
        variant="flat"
        color="primary"
        @click="guardarPanel"
        >Modificar</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, defineEmits, defineProps, onMounted } from "vue";
import peticionAPI from "@/service/conexion_api";
import Swal from "sweetalert2";

const props = defineProps({
  value: Boolean,
  panelData: Object,
});
const emit = defineEmits(["cerrar", "guardar"]);

const isEditing = ref(props.value);
const panel = ref({ ...props.panelData });
const tiposDeDato = ref([""]);

onMounted(() => {
  // console.log(props);
});

const agregarCampo = () => {
  panel.value.mapeo.push({ nombre: "", tipo: "" });
};

const eliminarCampo = (index) => {
  panel.value.mapeo.splice(index, 1);
};

const habilitarEdicion = () => {
  isEditing.value = true;
};

const guardarPanel = () => {
  peticionAPI(`dashboards/${panel.value.id}/`, "PUT", panel.value)
    .then((data) => {
      Swal.fire({
        title: "¡Modificada!",
        text: "El panel se modificó correctamente.",
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

<style scoped>
.contenedor-campos {
  padding: 15px 5px;
  border-radius: 8px;
  max-height: 30vh;
  overflow-y: auto;
}
.campos__field {
  max-width: 50%;
}
.select__tipos {
  padding: 5px;
  cursor: pointer;
}
.select__tipos:hover {
  background-color: var(--color-claro);
}
</style>
 