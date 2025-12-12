<template>
  <v-card>
    <v-card-title class="titulo-modal">
      {{ esVer ? "Ver Registro" : "Editar Registro" }}
    </v-card-title>

    <v-card-text>
      <!-- BOTONES PARA VER Y DESCARGAR ARCHIVO -->
      <div v-if="enlaceArchivo" class="mb-4 d-flex ga-3">
        <v-btn color="primary" variant="flat" @click="verArchivo" prepend-icon="mdi-open-in-new">
          Ver archivo
        </v-btn>

        <v-btn color="secondary" variant="outlined" @click="descargarArchivo" prepend-icon="mdi-download">
          Descargar
        </v-btn>
      </div>

      <!-- SI NO ES SOLO VER, PERMITIR CAMBIAR ARCHIVO -->
      <v-file-input
        v-if="!esVer"
        label="Actualizar archivo"
        variant="outlined"
        density="comfortable"
        accept="*/*"
        v-model="archivoSeleccionado"
        @change="onFileChange"
      ></v-file-input>

      <!-- FORMULARIO -->
      <v-form @submit.prevent="guardarCambios" v-if="Object.keys(camposForm).length > 0">
        <v-text-field
          v-for="(campo, index) in camposVisibles"
          :key="index"
          v-model="camposForm[campo]"
          :label="campo"
          :disabled="esVer"
          variant="outlined"
          density="comfortable"
        ></v-text-field>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn variant="outlined" color="primary" @click="cancelar">
        Cerrar
      </v-btn>

      <v-btn v-if="!esVer" variant="flat" color="primary" @click="guardarCambios">
        Guardar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, computed } from "vue";
import Swal from "sweetalert2";
import { environment } from "../../eviroments";

const props = defineProps({
  campos: Object,        // Datos existentes del documento (incluye hash, año, nombre archivo, etc.)
  idEstructura: String,  // Id de estructura del archivo
  idDato: String,        // IdDocumento (pk en ES)
  esVer: Boolean,
});

const emit = defineEmits(["cerrar"]);

const camposForm = ref({});
const archivoSeleccionado = ref(null);
const fileBase64 = ref(null);
const fileName = ref(null);

const gestorUrl = environment.GESTOR_DOCUMENTAL_URL;
const observatorios_mid_url = environment.OBSERVATORIOS_MID;

/* --------------------------------------- FORMULARIO --------------------------------------- */
const armarFormulario = () => {
  // Clonar toda la metadata recibida
  camposForm.value = { ...props.campos };
};

onMounted(() => {
  armarFormulario();
});

/* Campos visibles sin hash ni id */
const camposVisibles = computed(() =>
  Object.keys(camposForm.value).filter(
    (key) =>
      key !== "id" &&
      !key.toLowerCase().includes("hash")
  )
);

/* Hash actual */
const enlaceArchivo = computed(() => {
  const key = Object.keys(camposForm.value).find((k) =>
    k.toLowerCase().includes("hash")
  );
  return key ? camposForm.value[key] : null;
});

/* --------------------------------------- VER / DESCARGAR --------------------------------------- */
const verArchivo = () => {
  if (!enlaceArchivo.value) return;
  window.open(`${gestorUrl}/file/${enlaceArchivo.value}`, "_blank");
};

const descargarArchivo = () => {
  if (!enlaceArchivo.value) return;
  window.open(`${gestorUrl}/file/${enlaceArchivo.value}?download=true`, "_blank");
};

/* --------------------------------------- BASE64 --------------------------------------- */
const onFileChange = () => {
  const files = archivoSeleccionado.value;

  if (!files || files.length === 0) {
    console.warn("⚠ No se recibió archivo");
    return;
  }

  const file = files[0];              // ✓ OBLIGATORIO: tomar el File real

  fileName.value = file.name;         // ✓ nombre correcto del archivo

  const reader = new FileReader();
  reader.onload = () => {
    const resultado = reader.result;

    // El base64 generado SIEMPRE viene después de la coma
    fileBase64.value = resultado.split(",")[1];

    console.log("Base64 OK:", fileBase64.value.substring(0, 40) + "...");
  };

  reader.readAsDataURL(file);         // ✓ ahora sí lee el archivo real
};


/* --------------------------------------- GUARDAR --------------------------------------- */
const guardarCambios = async () => {
  if (props.esVer) return cancelar();

  // Copiar nuevos valores del formulario
  const datosBody = { ...camposForm.value };

  // Remover ID si venía desde ES
  const idDocumento = camposForm.value.id;
  delete datosBody["id"];

  /* Detectar HASH */
  const hashKey = Object.keys(camposForm.value).find((k) =>
    k.toLowerCase().includes("hash")
  );

  /* Detectar si cargaron archivo nuevo */
  const archivoNuevo = archivoSeleccionado.value ? true : false;

  /* ------------------ Armar Archivo solo si hay archivo nuevo ------------------ */
  let archivoPayload = null;

  if (archivoNuevo) {
    archivoPayload = {
      IdTipoDocumento: 192,
      nombre: fileName.value,
      metadatos: { ...datosBody },                // ✓ metadata limpia
      descripcion: "Archivo cargado desde Observatorios",
      file: fileBase64.value                      // ✓ base64 real
    };
  }

  /* ------------------ Body final EXACTO que necesita tu API ------------------ */
  const body = [
    {
      Archivo: archivoPayload,
      IdEstructuraArchivosDatos: props.idEstructura,
      IdDocumento: idDocumento,                  // ✓ pk ES correcto
      ArchivoNuevo: archivoNuevo,
      DatosArchivo: datosBody                    // ✓ metadata enviada
    }
  ];

  try {
    const resp = await fetch(`${observatorios_mid_url}/documento`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    Swal.fire("Actualizado", "Los datos fueron modificados correctamente", "success");
    emit("cerrar");
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "No se pudo actualizar el registro", "error");
  }
};

/* --------------------------------------- CERRAR --------------------------------------- */
const cancelar = () => emit("cerrar");
</script>


<style scoped>
.contenedor-campos {
  padding: 15px 5px;
  border-radius: 8px;
  max-height: 30vh;
  overflow-y: auto;
}
</style>
