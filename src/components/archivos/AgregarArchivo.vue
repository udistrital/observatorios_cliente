<template>
  <v-card>
    <v-card-title class="titulo-modal">Agregar Registro</v-card-title>

    <v-card-text>
      <v-form @submit.prevent="crearRegistro">
        <!-- INPUT PARA ARCHIVO -->
        <v-file-input
          label="Archivo"
          variant="outlined"
          density="comfortable"
          accept="*/*"
          v-model="archivoSeleccionado"
          @change="onFileChange"
          required
        ></v-file-input>
        <!-- CAMPOS DINÁMICOS -->
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
import { environment } from "../../eviroments";

let baseURL = environment.MAIN_BACKEND;

const archivoSeleccionado = ref(null);
const fileName = ref("");
const fileBase64 = ref("");

const props = defineProps({
  campos: Array,
  idEstructura: String,
});

const emit = defineEmits(["cerrar", "crear"]);

const form = ref({});

// Filtrar todos los campos que NO sean hash
const camposFiltrados = computed(() =>
  props.campos.filter(c => !c.nombre.toLowerCase().includes("hash"))
);

// Armar formulario dinámico
onMounted(() => {
  props.campos.forEach(campo => {
    form.value[campo.nombre] = "";
  });
});

// Crear registro
/*
const crearRegistro = async () => {
  const data = new FormData();
  data.append("formato", "FORM");

  for (const [key, value] of Object.entries(form.value)) {
    data.append(key, value);
  }

  try {
    await peticionAPI(`campos/archivos/${props.idEstructura}/`, "POST", data);

    Swal.fire({
      title: "¡Creado!",
      text: "El registro fue agregado correctamente.",
      icon: "success",
    });

    emit("cerrar");
  } catch (e) {
    console.error("❌ Error creando archivo:", e);
    Swal.fire("Error", "No se pudo crear el registro", "error");
  }
};
*/

// Convertir archivo → Base64
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
    console.log("Base64 generado:", fileBase64.value.substring(0, 40) + "...");
  };
  reader.readAsDataURL(file);
};


// Crear registro
const crearRegistro = async () => {
  if (!fileBase64.value) {
    return Swal.fire("Error", "Debe adjuntar un archivo", "warning");
  }

  // Construir "Datos" con campos dinámicos
  const datosBody = {};
  for (const [key, value] of Object.entries(form.value)) {
    datosBody[key] = value;
  }

  // Construir metadatos (si necesitas otros campos aquí se agregan)
  const metadatos = { ...datosBody };
  //const metadatos = {};

  // Construir el body FINAL EXACTO
  const body = [
    {
      "Archivo": {
        "IdTipoDocumento": 192,
        "nombre": fileName.value,
        "metadatos": metadatos,
        "descripcion": "Archivo cargado desde Observatorios",
        "file": fileBase64.value
      },
      "IdEstructuraArchivosDatos": props.idEstructura,
      "DatosArchivo": datosBody
    }
  ];

  console.log("🔥 Body enviado al Gestor Documental:", body);

  try {
    // 1️⃣ Enviar archivo al Gestor Documental
    const resp = await fetch("http://10.80.0.173:8086/v1/documento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!resp.ok) {
      throw new Error("Error en gestor documental");
    }

    // 2️⃣ Registrar datos EN TU ENDPOINT si lo deseas
    await peticionAPI(
      `campos/archivos/${props.idEstructura}/`,
      "POST",
      datosBody
    );

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
