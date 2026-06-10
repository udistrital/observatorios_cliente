<template>
  <v-card>
    <v-card-title class="titulo-modal">Agregar Registro</v-card-title>

    <v-card-text>
      <v-form @submit.prevent="crearRegistro">
        <v-file-input
          label="Archivo"
          variant="outlined"
          density="comfortable"
          accept="*/*"
          v-model="archivoSeleccionado"
          @change="onFileChange"
          required
        ></v-file-input>
        <v-text-field
          v-for="(campo, index) in camposFiltrados"
          :key="index"
          v-model="form[campo.nombre]"
          :label="campo.nombre"
          variant="outlined"
          density="comfortable"
          :required="campo.obligatorio"
        ></v-text-field>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn variant="outlined" color="primary" @click="cerrar">Cerrar</v-btn>
      <v-btn variant="flat" color="primary" @click="crearRegistro">Crear</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, computed } from "vue";
import peticionAPI from "@/service/conexion_api";
import Swal from "sweetalert2";
import { environment } from "@/environments/environment";

let baseURL = environment.MAIN_BACKEND;
let observatoriosMidURL = '';
const idTipoDocumentoGestorDocumental = environment.ID_TIPO_DOCUMENTO_GESTOR_DOCUMENTAL;

const archivoSeleccionado = ref(null);
const fileName = ref("");
const fileBase64 = ref("");

const props = defineProps({
  campos: Array,
  idEstructura: String,
});

const emit = defineEmits(["cerrar", "crear"]);

const form = ref({});

const camposFiltrados = computed(() =>
  props.campos.filter(c => !c.nombre.toLowerCase().includes("hash"))
);

onMounted(() => {
  props.campos.forEach(campo => {
    form.value[campo.nombre] = "";
  });
});

const onFileChange = (event) => {
  const file = event?.target?.files?.[0] || event?.[0];

  if (!file) {
    console.warn("No se recibió archivo en onFileChange");
    return;
  }

  fileName.value = file.name;

  const reader = new FileReader();
  reader.onload = () => {
    fileBase64.value = reader.result.split(",")[1];
  };
  reader.readAsDataURL(file);
};

const crearRegistro = async () => {
  if (!fileBase64.value) {
    return Swal.fire("Error", "Debe adjuntar un archivo", "warning");
  }
  const datosBody = {};
  for (const [key, value] of Object.entries(form.value)) {
    datosBody[key] = value;
  }
  const metadatos = { ...datosBody };
  const body = [
    {
      "Archivo": {
        "IdTipoDocumento": idTipoDocumentoGestorDocumental,
        "nombre": fileName.value,
        "metadatos": metadatos,
        "descripcion": "Archivo cargado desde Observatorios",
        "file": fileBase64.value
      },
      "IdEstructuraArchivosDatos": props.idEstructura,
      "DatosArchivo": datosBody
    }
  ];

  try {
    const resp = await fetch(observatoriosMidURL + "/documento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!resp.ok) {
      throw new Error("Error en observatorios_mid al crear documento");
    }

    Swal.fire({
      title: "¡Creado!",
      text: "El archivo fue enviado y registrado correctamente.",
      icon: "success",
    });

    emit("cerrar");

  } catch (error) {
    console.error("❌ Error creando archivo:", error);
    Swal.fire("Error", "No se pudo crear el registro", "error");
  }
};

const cerrar = () => emit("cerrar");
</script>
