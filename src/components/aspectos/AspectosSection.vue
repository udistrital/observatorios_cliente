<template>
  <section class="aspectos-section">
    <div class="aspectos-section__header">
      <div>
        <span class="aspectos-section__label">Listado</span>
        <h4>Aspectos a evaluar</h4>
      </div>

      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        size="small"
        class="btn-aspecto"
        @click="crearAspecto"
      >
        Crear Aspecto
      </v-btn>
    </div>

    <v-skeleton-loader
      v-if="cargandoAspectos"
      type="article, article"
      class="mb-3"
    />

    <v-alert
      v-if="!cargandoAspectos && aspectos.length === 0"
      type="info"
      variant="tonal"
      class="mb-3"
    >
      No hay aspectos registrados para esta característica.
    </v-alert>

    <AspectoCard
      v-for="(aspecto, index) in aspectos"
      :key="aspecto.id || index"
      :aspecto="aspecto"
      :index="index"
      :abierto="aspectoEstaAbierto(aspecto.id)"
      @toggle="toggleAspecto"
      @ver="verAspecto"
      @editar="editarAspecto"
      @cambiar-estado="cambiarEstadoAspecto"
      @eliminar="eliminarAspecto"
      @crear-estructura="crearEstructuraEvidencia"
      @ver-estructura="verEstructuraEvidencia"
      @editar-estructura="editarEstructuraEvidencia"
      @cambiar-estado-estructura="cambiarEstadoEstructuraEvidencia"
      @ir-estructura="(estructura) => irAEstructuraEvidencia(aspecto, estructura)"
    />
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import Swal from "sweetalert2";
import AspectoCard from "./AspectoCard.vue";
import { useAspectos } from "./useAspectos";
import { useAspectoDialogs } from "./useAspectoDialogs";
import { estructurasEvidenciasService } from "@/service/estructuras-evidencias.service";
import { useRouter, useRoute } from "vue-router";
import { useFactorStore } from "@/stores/factorStore";

const props = defineProps({
  caracteristica: {
    type: Object,
    required: true,
  },
});

const router = useRouter();
const route = useRoute();

const factorStore = useFactorStore();

const factorId = computed(() => {
  return (
    factorStore.factor?.id ||
    factorStore.factor?.factor_id ||
    route.params.factor_id ||
    route.params.id
  );
});

const procesoId = computed(() => {
  return route.params.proceso_id || factorStore.factor?.proceso_id;
});

const caracteristicaId = computed(() => props.caracteristica?.id);

const aspectosAbiertos = ref([]);

const {
  aspectos,
  cargandoAspectos,
  cargarAspectos,
  crearAspecto: crearAspectoApi,
  actualizarAspecto,
  cambiarEstadoAspecto: cambiarEstadoAspectoApi,
  eliminarAspecto: eliminarAspectoApi,
} = useAspectos(caracteristicaId);

const {
  mostrarCargandoAspecto,
  cerrarCargandoAspecto,
  verAspectoDialog,
  crearAspectoDialog,
  editarAspectoDialog,
  confirmarCambioEstadoAspectoDialog,
  confirmarEliminarAspectoDialog,
  crearEstructuraEvidenciaDialog,
  mostrarExitoAspecto,
  mostrarErrorAspecto,
} = useAspectoDialogs();

const aspectoEstaAbierto = (id) => {
  return aspectosAbiertos.value.includes(id);
};

const toggleAspecto = (id) => {
  if (aspectosAbiertos.value.includes(id)) {
    aspectosAbiertos.value = aspectosAbiertos.value.filter(
      (item) => item !== id
    );
    return;
  }

  aspectosAbiertos.value.push(id);
};

const cargar = async () => {
  try {
    await cargarAspectos();
  } catch (error) {
    console.error("Error al cargar aspectos:", error?.response?.data || error);
    await mostrarErrorAspecto("No fue posible cargar los aspectos.");
  }
};

const crearAspecto = async () => {
  const resultado = await crearAspectoDialog();

  if (!resultado.isConfirmed) return;

  try {
    await mostrarCargandoAspecto(
      "Creando aspecto",
      "Guardando el aspecto en la característica…"
    );

    await crearAspectoApi(resultado.value);

    cerrarCargandoAspecto();

    await mostrarExitoAspecto(
      "¡Creado!",
      "El aspecto se creó correctamente."
    );
  } catch (error) {
    console.error("Error al crear aspecto:", error?.response?.data || error);

    cerrarCargandoAspecto();

    await mostrarErrorAspecto("No fue posible crear el aspecto.");
  }
};

const verAspecto = async (aspecto) => {
  await verAspectoDialog(aspecto);
};

const editarAspecto = async (aspecto) => {
  const resultado = await editarAspectoDialog(aspecto);

  if (!resultado.isConfirmed) return;

  try {
    await mostrarCargandoAspecto(
      "Editando aspecto",
      "Guardando los cambios del aspecto…"
    );

    await actualizarAspecto(aspecto.id, {
      nombre: resultado.value.nombre,
    });

    cerrarCargandoAspecto();

    await mostrarExitoAspecto(
      "¡Actualizado!",
      "El aspecto se actualizó correctamente."
    );
  } catch (error) {
    console.error("Error al editar aspecto:", error?.response?.data || error);

    cerrarCargandoAspecto();

    await mostrarErrorAspecto("No fue posible editar el aspecto.");
  }
};

const cambiarEstadoAspecto = async (aspecto) => {
  const resultado = await confirmarCambioEstadoAspectoDialog(aspecto);

  if (!resultado.isConfirmed) return;

  const nuevoEstado = aspecto.activo === false;

  try {
    await mostrarCargandoAspecto(
      nuevoEstado ? "Activando aspecto" : "Desactivando aspecto",
      "Procesando el cambio de estado…"
    );

    await cambiarEstadoAspectoApi(aspecto);

    cerrarCargandoAspecto();

    await mostrarExitoAspecto(
      nuevoEstado ? "¡Activado!" : "¡Desactivado!",
      `El aspecto fue ${nuevoEstado ? "activado" : "desactivado"} correctamente.`
    );
  } catch (error) {
    console.error(
      "Error al cambiar estado del aspecto:",
      error?.response?.data || error
    );

    cerrarCargandoAspecto();

    await mostrarErrorAspecto("No fue posible cambiar el estado del aspecto.");
  }
};

const eliminarAspecto = async (aspecto) => {
  const resultado = await confirmarEliminarAspectoDialog(aspecto);

  if (!resultado.isConfirmed) return;

  try {
    await mostrarCargandoAspecto(
      "Eliminando aspecto",
      "Quitando el aspecto de la característica…"
    );

    await eliminarAspectoApi(aspecto);

    cerrarCargandoAspecto();

    await mostrarExitoAspecto(
      "¡Eliminado!",
      "El aspecto se eliminó correctamente."
    );
  } catch (error) {
    console.error("Error al eliminar aspecto:", error?.response?.data || error);

    cerrarCargandoAspecto();

    await mostrarErrorAspecto("No fue posible eliminar el aspecto.");
  }
};

const actualizarEstructurasDelAspecto = (
  aspectoId,
  estructurasEvidencias = []
) => {
  aspectos.value = aspectos.value.map((aspecto) => {
    if (aspecto.id !== aspectoId) {
      return aspecto;
    }

    return {
      ...aspecto,
      estructuras_evidencias: estructurasEvidencias,
    };
  });
};

const crearEstructuraEvidencia = async (aspecto) => {
  const resultado = await crearEstructuraEvidenciaDialog();

  if (!resultado.isConfirmed) return;

  try {
    await mostrarCargandoAspecto(
      "Creando estructura evidencia",
      "Creando el índice y asociándolo al aspecto…"
    );

    const response = await estructurasEvidenciasService.crear({
      aspecto_id: aspecto.id,
      tipo_evidencia: resultado.value.tipo_evidencia,
      nombre: resultado.value.nombre,
      activo: true,
    });

    actualizarEstructurasDelAspecto(
      aspecto.id,
      response.estructuras_evidencias
    );

    cerrarCargandoAspecto();

    await mostrarExitoAspecto(
      "¡Creada!",
      "La estructura evidencia fue creada correctamente."
    );
  } catch (error) {
    console.error(
      "Error al crear estructura evidencia:",
      error?.response?.data || error
    );

    cerrarCargandoAspecto();

    await mostrarErrorAspecto(
      "No fue posible crear la estructura evidencia."
    );
  }
};

const verEstructuraEvidencia = async (estructura) => {
  await Swal.fire({
    title: estructura.nombre || "Estructura evidencia",
    html: `
      <div style="text-align:left">
        <p><b>Id / índice:</b></p>
        <p style="word-break:break-word">${estructura.id}</p>

        <p><b>Tipo de evidencia:</b></p>
        <p>${estructura.tipo_evidencia}</p>

        <p><b>Nombre:</b></p>
        <p>${estructura.nombre}</p>

        <p><b>Estado:</b></p>
        <p>${estructura.activo !== false ? "Activo" : "Inactivo"}</p>
      </div>
    `,
    icon: "info",
    width: "520px",
    customClass: {
      popup: "popup-personalizado",
      title: "titulo-alerta-personalizado",
      confirmButton: "confirmacion-alerta-personalizado",
    },
    buttonsStyling: false,
  });
};

const editarEstructuraEvidencia = async (aspecto, estructura) => {
  const resultado = await crearEstructuraEvidenciaDialog({
    tipo_evidencia: estructura.tipo_evidencia,
    nombre: estructura.nombre,
  });

  if (!resultado.isConfirmed) return;

  try {
    await mostrarCargandoAspecto(
      "Editando estructura evidencia",
      "Actualizando la información de la estructura…"
    );

    const response = await estructurasEvidenciasService.actualizar(
      estructura.id,
      {
        aspecto_id: aspecto.id,
        tipo_evidencia: resultado.value.tipo_evidencia,
        nombre: resultado.value.nombre,
        activo: estructura.activo !== false,
      }
    );

    actualizarEstructurasDelAspecto(
      aspecto.id,
      response.estructuras_evidencias
    );

    cerrarCargandoAspecto();

    await mostrarExitoAspecto(
      "¡Actualizada!",
      "La estructura evidencia fue actualizada correctamente."
    );
  } catch (error) {
    console.error(
      "Error al editar estructura evidencia:",
      error?.response?.data || error
    );

    cerrarCargandoAspecto();

    await mostrarErrorAspecto(
      "No fue posible editar la estructura evidencia."
    );
  }
};

const cambiarEstadoEstructuraEvidencia = async (aspecto, estructura) => {
  const nuevoEstado = estructura.activo === false;

  try {
    await mostrarCargandoAspecto(
      nuevoEstado
        ? "Activando estructura evidencia"
        : "Desactivando estructura evidencia",
      "Procesando el cambio de estado…"
    );

    let response;

    if (nuevoEstado) {
      response = await estructurasEvidenciasService.actualizar(
        estructura.id,
        {
          aspecto_id: aspecto.id,
          tipo_evidencia: estructura.tipo_evidencia,
          nombre: estructura.nombre,
          activo: true,
        }
      );
    } else {
      response = await estructurasEvidenciasService.desactivar(estructura.id);
    }

    actualizarEstructurasDelAspecto(
      aspecto.id,
      response.estructuras_evidencias
    );

    cerrarCargandoAspecto();

    await mostrarExitoAspecto(
      nuevoEstado ? "¡Activada!" : "¡Desactivada!",
      `La estructura evidencia fue ${
        nuevoEstado ? "activada" : "desactivada"
      } correctamente.`
    );
  } catch (error) {
    console.error(
      "Error al cambiar estado de estructura evidencia:",
      error?.response?.data || error
    );

    cerrarCargandoAspecto();

    await mostrarErrorAspecto(
      "No fue posible cambiar el estado de la estructura evidencia."
    );
  }
};

const irAEstructuraEvidencia = async (...args) => {
  const estructura = args.length === 2 ? args[1] : args[0];
  console.log("Estructura para ir:", estructura);

  const estructuraId = estructura?.id;
  console.log("ID de la estructura:", estructuraId);

  if (!estructuraId) {
    await Swal.fire({
      title: "Estructura sin ID",
      text: "No fue posible identificar el ID de la estructura.",
      icon: "error",
      width: "320px",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
      },
      buttonsStyling: false,
    });

    return;
  }

  const tipo = estructura.tipo_evidencia || estructura.tipo || "";

  if (!["Tabla", "Documental", "datos", "archivos"].includes(tipo)) {
    await Swal.fire({
      title: "Tipo de evidencia no soportado",
      text: "Solo se pueden abrir estructuras de tipo Tabla o Documental.",
      icon: "info",
      width: "380px",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
      },
      buttonsStyling: false,
    });

    return;
  }

  if (tipo === "Documental" || tipo === "archivos") {
    router.push({
      name: procesoId.value ? "factorTablero" : "tablero",
      params: {
        ...(procesoId.value ? { proceso_id: procesoId.value } : {}),
        factor_id: factorId.value,
      },
      query: {
        estructura_id: estructuraId,
      },
    });

    return;
  }

  router.push({
    name: procesoId.value ? "factorTablero" : "tablero",
    params: {
      ...(procesoId.value ? { proceso_id: procesoId.value } : {}),
      factor_id: factorId.value,
    },
    query: {
      estructura_id: estructuraId,
    },
  });
};

watch(
  () => caracteristicaId.value,
  async () => {
    await cargar();
  },
  {
    immediate: true,
  }
);
</script>

<style scoped>
.aspectos-section {
  position: relative;
  margin-top: 18px;
  margin-left: 34px;
  padding: 16px;
  border: 1px solid #b9d8ce;
  border-left: 6px solid #2e8b74;
  border-radius: 14px;
  background: #f1faf7;
}

.aspectos-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
  padding: 12px 14px;
  border: 1px solid #c7e4da;
  border-radius: 12px;
  background: #e6f5f0;
}

.aspectos-section__header h4 {
  margin: 0;
  color: #1f6f5d;
  font-size: 18px;
  font-weight: 900;
}

.aspectos-section__label {
  display: block;
  margin-bottom: 4px;
  color: #2e8b74;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.btn-aspecto {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.02em;
}

@media (max-width: 900px) {
  .aspectos-section {
    margin-left: 0;
  }

  .aspectos-section__header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
