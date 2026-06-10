<template>
  <v-card>
    <v-card-title class="titulo-modal">
      {{ esVer ? "Ver Registro" : "Editar Registro" }}
    </v-card-title>

    <v-card-text>
      <div v-if="enlaceArchivo" class="mb-4 d-flex ga-3">
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-open-in-new"
          @click="verArchivo"
        >
          Ver archivo
        </v-btn>

        <v-btn
          color="secondary"
          variant="outlined"
          prepend-icon="mdi-download"
          @click="descargarArchivo"
        >
          Descargar
        </v-btn>
      </div>

      <v-file-input
        v-if="!esVer"
        label="Actualizar archivo"
        variant="outlined"
        density="comfortable"
        accept="*/*"
        v-model="archivoSeleccionado"
        @change="onFileChange"
      />

      <v-form v-if="Object.keys(camposForm).length > 0">
        <v-text-field
          v-for="(campo, index) in camposVisibles"
          :key="index"
          v-model="camposForm[campo]"
          :label="campo"
          :disabled="esVer"
          variant="outlined"
          density="comfortable"
        />
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn variant="outlined" color="primary" @click="cerrar">
        Cerrar
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
import { ref, defineProps, defineEmits, computed, watch } from "vue";
import Swal from "sweetalert2";
import { environment } from "@/environments/environment";


const props = defineProps({
  campos: Object,
  idEstructura: String,
  idDato: String,
  esVer: Boolean,
});

const emit = defineEmits(["cerrar"]);

const camposForm = ref({});
const archivoSeleccionado = ref(null);
const fileBase64 = ref(null);
const fileName = ref(null);

const gestorUrl = environment.GESTOR_DOCUMENTAL;
const observatorios_mid_url = '';
const idTipoDocumentoGestorDocumental = environment.ID_TIPO_DOCUMENTO_GESTOR_DOCUMENTAL;

const armarFormulario = () => {
  const limpio = {};

  Object.keys(props.campos || {}).forEach((key) => {
    if (key !== "id") {
      limpio[key] = props.campos[key] ?? "";
    }
  });

  camposForm.value = limpio;
};

const camposVisibles = computed(() =>
  Object.keys(camposForm.value).filter(
    (key) => !key.toLowerCase().includes("hash")
  )
);

const enlaceArchivo = computed(() => {
  const key = Object.keys(props.campos || {}).find((k) =>
    k.toLowerCase().includes("hash")
  );
  return key ? props.campos[key] : null;
});

watch(
  () => props.campos,
  (campos) => {
    if (!campos || Object.keys(campos).length === 0) return;
    armarFormulario();
  },
  { immediate: true }
);

const base64ToBlob = (base64, type) => {
  const bytes = atob(base64);
  const array = new Uint8Array(bytes.length);

  for (let i = 0; i < bytes.length; i++) {
    array[i] = bytes.charCodeAt(i);
  }

  return new Blob([array], { type });
};

const verArchivo = async () => {
  if (!enlaceArchivo.value) return;

  try {
    const resp = await fetch(
      `${gestorUrl}document/${enlaceArchivo.value}`
    );

    if (!resp.ok) {
      throw new Error("Error consultando gestor documental");
    }

    const data = await resp.json();
    const base64 = data.file;

    if (!base64) {
      throw new Error("No se encontró base64 del archivo");
    }

    const blob = base64ToBlob(base64, "application/pdf");
    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");

    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } catch (e) {
    console.error(e);
    Swal.fire("Error", "No se pudo abrir el archivo", "error");
  }
};

const descargarArchivo = () => verArchivo();

const onFileChange = () => {
  const file = archivoSeleccionado.value?.[0];
  if (!file) return;

  fileName.value = file.name;

  const reader = new FileReader();
  reader.onload = () => {
    fileBase64.value = reader.result.split(",")[1];
  };
  reader.readAsDataURL(file);
};

const guardarCambios = async () => {
  if (props.esVer) return cancelar();

  const datosBody = { ...camposForm.value };

  const idDocumento = props.campos.id;

  const archivoNuevo = !!archivoSeleccionado.value;

  let archivoPayload = null;

  if (archivoNuevo) {
    archivoPayload = {
      IdTipoDocumento: idTipoDocumentoGestorDocumental,
      nombre: fileName.value,
      metadatos: datosBody,
      descripcion: "Archivo cargado desde Observatorios",
      file: fileBase64.value,
    };
  }

  const body = [
    {
      Archivo: archivoPayload,
      IdEstructuraArchivosDatos: props.idEstructura,
      IdDocumento: idDocumento,
      ArchivoNuevo: archivoNuevo,
      DatosArchivo: datosBody,
    },
  ];

  try {
    await fetch(`${observatorios_mid_url}/documento`, {
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

const cerrar = () => emit("cerrar");

</script>

<style scoped>
.titulo-modal {
  font-weight: 600;
}

.ga-3 {
  gap: 12px;
}
</style>
