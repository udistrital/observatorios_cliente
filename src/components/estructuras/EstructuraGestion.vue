<template>
  <v-card>
    <v-card-title class="titulo-modal">
      {{ isEditing ? 'Modificar Estructura' : 'Ver Estructura' }}
    </v-card-title>
    <v-card-text>
      <v-form  @submit.prevent="guardarEstructura">
        <v-text-field
          v-model="estructura.nombre"
          label="Nombre de la estructura"
          variant="outlined"
          density="comfortable"
          required
        ></v-text-field>
        <div class="subcabecera">
          <h3 class="subtitulo-modal">Campos</h3>
          <v-btn v-if="isEditing" icon color="primary" density="compact" @click="agregarCampo">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
        <div class="contenedor-campos">
          <div v-for="(campo, index) in estructura.mapeo" :key="index" class="d-flex align-center mb-2">
            <v-text-field
              v-model="campo.nombre"
              label="Nombre del Campo"
              class="mr-2 campos__field"
              variant="outlined"
              density="comfortable"
              required
              hide-details="true"
              :disabled="!isEditing"
            ></v-text-field>
            <v-select
              :disabled="!isEditing"
              hide-details="true"
              v-model="campo.tipo"
              :items="tiposDeDato"
              item-value="nombre"
              label="Tipo de dato"
              variant="outlined"
              density="comfortable"
              required
              max-height="20%"
              class="campos__field"
               style="width: 50%;"
            >
              <template v-slot:item="{ props, item }">
                <div class="select__tipos" v-bind="props" :title="item.raw.descripcion">
                  {{ item.raw.nombre_espanol }} ({{ item.raw.nombre }})
                </div>
              </template>
              <template v-slot:selection="{ item }">
                {{ item.raw.nombre_espanol }} ({{ item.raw.nombre }})
              </template>
            </v-select>
            <v-btn v-if="isEditing" icon variant="plain" density="comfortable" color="primary" @click="eliminarCampo(index)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </div>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn variant="outlined" color="primary" text @click="cancelar">Cancelar</v-btn>
      <v-btn v-if="isEditing" variant="flat" color="primary" @click="guardarEstructura">Modificar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, defineEmits, defineProps, onMounted } from "vue";
import peticionAPI from "@/service/conexion_api";
import Swal from "sweetalert2";

const props = defineProps({
  value: Boolean,
  estructuraData: Object,
});
const emit = defineEmits(["cerrar", "guardar"]);

const isEditing = ref(props.value);
const estructura = ref({ ...props.estructuraData });
const tiposDeDato = ref([""]);

onMounted(() => {
  peticionAPI("campos/tipos", "GET")
    .then((data) => {
      tiposDeDato.value = Object.values(data);
    })
    .catch((error) => console.error(error));
});

const agregarCampo = () => {
  estructura.value.mapeo.push({ nombre: "", tipo: "" });
};

const eliminarCampo = (index) => {
  estructura.value.mapeo.splice(index, 1);
};

const habilitarEdicion = () => {
  isEditing.value = true;
};

const guardarEstructura = () => {
  peticionAPI(`/campos/estructuras/${estructura.value.id}/`, "PUT", estructura.value)
    .then((data) => {
      Swal.fire({
        title: "¡Modificada!",
        text: "La estructura se modificó correctamente.",
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
.select__tipos{
  padding: 5px;
  cursor: pointer;
}
.select__tipos:hover{
  background-color: var(--color-claro);
}
</style>
