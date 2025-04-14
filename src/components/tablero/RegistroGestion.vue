<template>
  <v-card>
    <v-card-title class="titulo-modal">
      {{ esVer ? "Ver Registro" : "Editar Registro" }}
    </v-card-title>
    <v-card-text>
      <v-form
        @submit.prevent="guardarCambios"
        v-if="Object.keys(camposForm).length > 0"
      >
        <v-text-field
          v-for="(campo, index) in Object.keys(camposForm).filter(
            (key) => key != 'formato' && key != 'id'
          )"
          :key="index"
          v-model="camposForm[campo]"
          :label="campo"
          :disabled="esVer"
          variant="outlined"
          density="comfortable"
          :required="!esVer"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn variant="outlined" color="primary" text @click="cancelar">
        Cancelar
      </v-btn>
      <v-btn
        v-if="!esVer"
        variant="flat"
        color="primary"
        @click="guardarCambios"
      >
        Guardar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted } from "vue";
import peticionAPI from "@/service/conexion_api";
import Swal from "sweetalert2";

const props = defineProps({
  campos: Object,
  idEstructura: String,
  esVer: Boolean, // true: modo ver, false: modo editar
});

const emit = defineEmits(["cerrar", "guardar"]);

const camposForm = ref({});

const armarFormulario = () => {
  camposForm.value = { ...props.campos };
};
// Cambiar a tomar del storage
const obtenerDatosEstructura = () => {
  peticionAPI(`campos/estructuras/${props.idEstructura}/`, "GET")
    .then((data) => {
      if (Array.isArray(data.mapeo)) {
        data.mapeo.forEach((item) => {
          if (!(item.nombre in camposForm.value)) {
          camposForm.value[item.nombre] = "";
          }
        });
      }
    })
    .catch((error) => console.error(error));
};

onMounted(() => {
    armarFormulario();
    obtenerDatosEstructura();

});

const guardarCambios = () => {
  if (props.esVer) {
    cancelar();
    return;
  }

  delete camposForm.value.formato;
  delete camposForm.value.id;
  camposForm.value['formato'] = "FORM"
  
  peticionAPI(
    `/datos/${props.idEstructura}/${props.campos.id}/`,
    "PUT",
    camposForm.value
  )
    .then((data) => {
      Swal.fire({
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
    })
    .catch((error) => console.error(error));

  emit("cerrar", { id: props.idEstructura });
};

const cancelar = () => {
  emit("cerrar");
};

onMounted(() => {
  armarFormulario();
});
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
