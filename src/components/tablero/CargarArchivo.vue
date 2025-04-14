<template>
  <v-card>
    <v-card-title class="titulo-modal">Cargar Archivo</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="guardarArchivo">
        <v-file-input
          v-model="archivo"
          label="Seleccionar archivo (.json, .csv)"
          accept=".json,.csv"
          prepend-icon="mdi-paperclip"
          variant="outlined"
          density="comfortable"
          required
          @update:modelValue="detectarFormato"
        />

        <v-text-field
          v-model="formato"
          label="Formato detectado"
          outlined
          variant="outlined"
          density="comfortable"
          readonly
        ></v-text-field>
        <!-- disabled -->

        <!-- <v-btn color="primary" type="submit" class="mt-4">
          <v-icon left>mdi-upload</v-icon>
          Guardar
        </v-btn> -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="outlined" color="primary" text @click="cancelar"
            >Cancelar</v-btn
          >
          <v-btn
            variant="flat"
            type="submit"
            color="primary"
            @click="crearEstructura"
            >Cargar</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card-text>
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
const emit = defineEmits(["cerrar", "crear"]);
const campos = ref({});

const armarFormulario = () => {
  for (const element of props.campos) {
    campos.value[`${element.nombre}`] = "";
  }
};
// const crearEstructura = () => {
//   const registro = new FormData();
//   registro.append("formato", "FORM");
//   let resultados = Object.keys(campos.value).map((clave) => ({
//     clave,
//     valor: campos.value[clave],
//   }));
//   for (const campo of resultados) {
//     registro.append(campo.clave, campo.valor);
//   }

//   peticionAPI(`/datos/${props.idEstructura}/`, "POST", registro)
//     .then((data) => {
//       Swal.fire({
//         title: "¡Creado!",
//         text: "El registro se creó correctamente.",
//         icon: "success",
//         width: "300px",
//         customClass: {
//           popup: "popup-personalizado",
//           title: "titulo-alerta-personalizado",
//           confirmButton: "confirmacion-alerta-personalizado",
//         },
//         buttonsStyling: false,
//       });
//     })
//     .catch((error) => console.error(error));

//   emit("cerrar", { id: props.idEstructura });
// };

const archivo = ref(null);
const formato = ref("");

const detectarFormato = (file) => {
  const selectedFile = Array.isArray(file) ? file[0] : file;

  if (!selectedFile || !selectedFile.name) {
    formato.value = "";
    return;
  }

  const nombre = selectedFile.name.toLowerCase();

  if (nombre.endsWith(".json")) {
    formato.value = "JSON";
  } else if (nombre.endsWith(".csv")) {
    formato.value = "CSV";
  } else {
    formato.value = "";
    archivo.value = null;
    Swal.fire(
      "Formato no soportado",
      "Solo se permiten archivos .json o .csv",
      "warning"
    );
  }
};

const guardarArchivo = async () => {
  if (!archivo.value || !formato.value) return;

  const registro = new FormData();
  registro.append("archivo", archivo.value[0]);
  registro.append("formato", formato.value);
  
  peticionAPI(`datos/${props.idEstructura}/`, "POST", registro)
    .then((data) => {
      Swal.fire({
        title: "¡Creado!",
        text: "El registro se creó correctamente.",
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
    .catch((error) => {
      console.error(error);
      // Swal.fire("Error", "Ocurrió un error al subir el archivo", "error");
    });

  emit("cerrar", { id: props.idEstructura });

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
