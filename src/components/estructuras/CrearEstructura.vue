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
              class="mr-2 campos__field"
              variant="outlined"
              density="comfortable"
              required
            ></v-text-field>

            <v-select
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
               style="width: 50%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
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
import { ref, defineEmits, defineProps, onMounted } from "vue";
import peticionAPI from "@/service/conexion_api";
import Swal from "sweetalert2";

const props = defineProps({
  value: Boolean,
});
const emit = defineEmits(["cerrar", "crear"]);

const dialog = ref(props.value);
const nombreEstructura = ref("");
const tiposDeDato = ref([""]);
const campos = ref([{ nombre: "", tipo: "" }]);

const agregarCampo = () => {
  campos.value.push({ nombre: "", tipo: "" });
};

const eliminarCampo = (index) => {
  campos.value.splice(index, 1);
};

const crearEstructura = () => {
  console.log('entra');
  
  const estructura = {
    nombre: nombreEstructura.value,
    observatorio: localStorage.getItem('observatorio'),
    mapeo: campos.value,
  };

  peticionAPI("/campos/estructuras/", "POST", estructura)
    .then((data) => {
      Swal.fire({
        title: "¡Creado!",
        text: "La estructura se creó correctamente.",
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
const traerCampos = () => {
  peticionAPI("campos/tipos", "GET")
    .then((data) => {
      tiposDeDato.value = Object.values(data);
      console.log(tiposDeDato.value);
    })
    .catch((error) => console.error(error));
};
onMounted(() => {
  traerCampos();
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
.select__tipos{
  padding: 5px;
  cursor: pointer;
}
.select__tipos:hover{
  background-color: var(--color-claro);
}
.campos__field{
  max-width: 50%;
}
</style>
