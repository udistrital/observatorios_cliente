<template>
  <section class="factor-page">
    <div class="flow-nav">
      <v-btn
        variant="tonal"
        color="primary"
        prepend-icon="mdi-arrow-left"
        class="return-button"
        @click="volverAFactores"
      >
        Regresar a factores
      </v-btn>
    </div>

    <!-- FACTOR -->
    <FactorCard
      :factor="factor"
      :puede-gestionar="esAdministrador"
      @ver="verFactor"
      @editar="editarFactor"
      @cambiar-estado="cambiarEstadoFactor"
    />

    <!-- CABECERA CARACTERÍSTICAS -->
    <div class="section-header">
      <div>
        <span class="section-header__label">Listado</span>
        <h2>Características</h2>
      </div>

      <v-btn
        v-if="esAdministrador"
        color="primary"
        prepend-icon="mdi-plus"
        class="btn-main"
        @click="abrirCrearCaracteristica"
      >
        Crear Característica
      </v-btn>
    </div>

    <v-skeleton-loader
      v-if="cargando"
      type="article, article, article"
      class="mt-4"
    />

    <v-alert
      v-if="!cargando && filteredEstructuras.length === 0"
      type="info"
      variant="tonal"
      class="mt-4"
    >
      No se encontraron características registradas.
    </v-alert>

    <!-- LISTA DE CARACTERÍSTICAS -->
    <CaracteristicaCard
      v-for="(estructura, index) in filteredEstructuras"
      :key="claveCaracteristica(estructura, index)"
      :caracteristica="estructura"
      :index="index"
      :clave="claveCaracteristica(estructura, index)"
      :abierta="caracteristicaEstaAbierta(claveCaracteristica(estructura, index))"
      :puede-gestionar="esAdministrador"
      @toggle="toggleCaracteristica"
      @ver="verCaracteristica"
      @editar="editarCaracteristica"
      @cambiar-estado="cambiarEstadoCaracteristica"
      @eliminar="eliminarCaracteristica"
    >
      <template #default="{ caracteristica: estructura, index }">
        <!-- ASPECTOS -->
        <AspectosSection :caracteristica="estructura" :puede-gestionar="esAdministrador" />
      </template>
    </CaracteristicaCard>

    <!-- MODAL CREAR -->
    <v-dialog
      v-model="_crearEstructura"
      scrollable
      max-width="500px"
      max-height="70vh"
      transition="dialog-transition"
    >
      <CrearEstructura :factor-id="factorId" @cerrar="cerrarModal" />
    </v-dialog>

    <!-- MODAL VER / EDITAR -->
    <v-dialog
      v-model="_gestionEstructura"
      scrollable
      max-width="500px"
      max-height="70vh"
      transition="dialog-transition"
    >
      <EstructuraGestion
        :estructuraData="datosEstructura"
        :value="_modo"
        @cerrar="cerrarModal"
      />
    </v-dialog>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import peticionAPI from "../../service/conexion_api";
import Swal from "sweetalert2";
import CrearEstructura from "./CrearEstructura.vue";
import EstructuraGestion from "./EstructuraGestion.vue";
import { useEstructuraStore } from "@/stores/estructuraStore";
import FactorCard from "@/components/factores/FactorCard.vue";
import { useFactor } from "@/components/factores/useFactor";
import { useFactorDialogs } from "@/components/factores/useFactorDialogs";
import CaracteristicaCard from "@/components/caracteristicas/CaracteristicaCard.vue";
import { useCaracteristicas } from "@/components/caracteristicas/useCaracteristicas";
import { useCaracteristicaDialogs } from "@/components/caracteristicas/useCaracteristicaDialogs";
import AspectosSection from "@/components/aspectos/AspectosSection.vue";
import { useUserStore } from "@/stores/userStore";
import { esAdminObservatorios } from "@/utils/roles";

const estructuraStore = useEstructuraStore();
const userStore = useUserStore();

const router = useRouter();
const route = useRoute();

const search = ref("");

const factorId = computed(() => {
  return route.params.factor_id || route.params.id;
});

const procesoId = computed(() => {
  return route.params.proceso_id || factor.value?.proceso_id;
});

const volverAFactores = () => {
  if (procesoId.value) {
    router.push({
      name: "procesoFactores",
      params: {
        proceso_id: procesoId.value,
      },
    });
    return;
  }

  router.back();
};

const {
  factor,
  cargarFactor,
  actualizarFactor,
  cambiarEstadoFactor: cambiarEstadoFactorApi,
} = useFactor(factorId);

const {
  caracteristicas: estructuras,
  cargandoCaracteristicas,
  cargarCaracteristicas,
  crearCaracteristica: crearCaracteristicaApi,
  actualizarCaracteristica,
  cambiarEstadoCaracteristica: cambiarEstadoCaracteristicaApi,
  eliminarCaracteristica: eliminarCaracteristicaApi,
} = useCaracteristicas(factorId);

const cargando = computed(() => cargandoCaracteristicas.value);

const {
  mostrarCargando,
  cerrarCargando,
  verFactorDialog,
  editarFactorDialog,
  confirmarCambioEstadoFactorDialog,
  mostrarExito: mostrarExitoFactor,
  mostrarError: mostrarErrorFactor,
} = useFactorDialogs();

const {
  verCaracteristicaDialog,
  crearCaracteristicaDialog,
  editarCaracteristicaDialog,
  confirmarCambioEstadoCaracteristicaDialog,
  confirmarEliminarCaracteristicaDialog,
  mostrarExito,
  mostrarError,
} = useCaracteristicaDialogs();

const _crearEstructura = ref(false);
const _gestionEstructura = ref(false);
const _modo = ref(false);
const datosEstructura = ref({});

const caracteristicasAbiertas = ref([]);
const esAdministrador = computed(() => esAdminObservatorios(userStore.user?.role));

const verFactor = async () => {
  await verFactorDialog(factor.value);
};

const editarFactor = async () => {
  if (!esAdministrador.value) return;

  const resultado = await editarFactorDialog(factor.value);

  if (!resultado.isConfirmed) return;

  try {
    await mostrarCargando(
      "Actualizando factor",
      "Guardando los cambios del factor…"
    );

    await actualizarFactor({
      nombre: resultado.value.nombre,
      descripcion: resultado.value.descripcion,
      calificacion: resultado.value.calificacion,
    });

    cerrarCargando();

    await mostrarExitoFactor(
      "¡Actualizado!",
      "El factor se actualizó correctamente."
    );
  } catch (error) {
    console.error("Error al editar factor:", error?.response?.data || error);

    cerrarCargando();

    await mostrarErrorFactor("No fue posible editar el factor.");
  }
};

const cambiarEstadoFactor = async () => {
  if (!esAdministrador.value) return;

  const resultado = await confirmarCambioEstadoFactorDialog(factor.value);

  if (!resultado.isConfirmed) return;

  const nuevoEstado = factor.value.activo === false;

  try {
    await mostrarCargando(
      nuevoEstado ? "Activando factor" : "Desactivando factor",
      "Procesando el cambio de estado…"
    );

    await cambiarEstadoFactorApi();

    cerrarCargando();

    await mostrarExitoFactor(
      nuevoEstado ? "¡Activado!" : "¡Desactivado!",
      `El factor fue ${nuevoEstado ? "activado" : "desactivado"} correctamente.`
    );
  } catch (error) {
    console.error("Error al cambiar estado del factor:", error?.response?.data || error);

    cerrarCargando();

    await mostrarErrorFactor("No fue posible cambiar el estado del factor.");
  }
};

const filteredEstructuras = computed(() => {
  const estructurasVisibles = esAdministrador.value
    ? estructuras.value
    : estructuras.value.filter((estructura) => estructura.activo !== false);

  if (!search.value) return estructurasVisibles;

  return estructurasVisibles.filter((estructura) =>
    estructura.nombre?.toLowerCase().includes(search.value.toLowerCase())
  );
});

const claveCaracteristica = (estructura, index) => {
  return estructura.id || `caracteristica-${index}`;
};

const caracteristicaEstaAbierta = (clave) => {
  return caracteristicasAbiertas.value.includes(clave);
};

const toggleCaracteristica = (clave) => {
  if (caracteristicasAbiertas.value.includes(clave)) {
    caracteristicasAbiertas.value = caracteristicasAbiertas.value.filter(
      (item) => item !== clave
    );
    return;
  }

  caracteristicasAbiertas.value.push(clave);
};

const obtenerDescripcionCaracteristica = (estructura) => {
  return (
    estructura.descripcion ||
    "La unidad académica actúa de manera coherente y pertinente con el medio social, cultural y ambiental, de acuerdo con la identidad y el proyecto educativo institucional."
  );
};

const obtenerCalificacionCaracteristica = (estructura) => {
  if (estructura.calificacion && estructura.calificacion_descripcion) {
    return `${estructura.calificacion} ${estructura.calificacion_descripcion}`;
  }

  if (estructura.calificacion) {
    return estructura.calificacion;
  }

  return "4.5 Se cumple en alto grado";
};

const obtenerEstructurasDelAspecto = (aspecto, aspectoIndex) => {
  if (Array.isArray(aspecto?.estructuras) && aspecto.estructuras.length > 0) {
    return aspecto.estructuras
      .filter((estructura) => ["datos", "archivos"].includes(estructura.tipo))
      .map((estructura, index) => ({
        id: estructura.id || `estructura-real-${aspectoIndex}-${index}`,
        nombre: estructura.nombre || `Estructura ${index + 1}`,
        tipo: estructura.tipo,
        activo: estructura.activo !== false,
        mapeo: estructura.mapeo || [],
        mapeo_archivos: estructura.mapeo_archivos || [],
        id_archivos: estructura.id_archivos,
        raw: estructura,
      }));
  }

  return [
    {
      id: `mock-datos-${aspectoIndex}`,
      nombre: `Estructura de datos del aspecto ${aspectoIndex + 1}`,
      tipo: "datos",
      activo: true,
      mapeo: [
        { nombre: "nombre_indicador", tipo: "text" },
        { nombre: "valor", tipo: "float" },
      ],
      mapeo_archivos: [],
      esMock: true,
    },
    {
      id: `mock-archivos-${aspectoIndex}`,
      nombre: `Estructura de archivos del aspecto ${aspectoIndex + 1}`,
      tipo: "archivos",
      activo: true,
      mapeo: [],
      mapeo_archivos: [
        { nombre: "tipo_evidencia", tipo: "text" },
        { nombre: "nombre_archivo", tipo: "text" },
        { nombre: "formato", tipo: "text" },
      ],
      id_archivos: `mock-id-archivos-${aspectoIndex}`,
      esMock: true,
    },
  ];
};

const crearEstructuraDelAspecto = (estructuraPadre, aspecto, aspectoIndex, tipo) => {
  if (!esAdministrador.value) return;

  datosEstructura.value = {
    factor: factorId.value,
    aspectoPadre: aspecto,
    aspectoIndex,
    estructuraPadreId: estructuraPadre.id,
    tipo,
    nombre: "",
    mapeo: tipo === "datos" ? [] : undefined,
    mapeo_archivos: tipo === "archivos" ? [] : undefined,
  };

  _modo.value = true;
  _crearEstructura.value = true;
};

const verEstructuraDelAspecto = (estructuraAsociada) => {
  datosEstructura.value = {
    ...estructuraAsociada,
    tipo: estructuraAsociada.tipo === "archivos" ? "archivos" : "datos",
  };

  _modo.value = false;
  _gestionEstructura.value = true;
};

const editarEstructuraDelAspecto = (estructuraAsociada) => {
  if (!esAdministrador.value) return;

  datosEstructura.value = {
    ...estructuraAsociada,
    tipo: estructuraAsociada.tipo === "archivos" ? "archivos" : "datos",
  };

  _modo.value = true;
  _gestionEstructura.value = true;
};

const cambiarEstadoEstructuraDelAspecto = async (estructuraAsociada) => {
  if (!esAdministrador.value) return;

  const nuevoEstado = estructuraAsociada.activo === false;
  const accion = nuevoEstado ? "activar" : "desactivar";

  const resultado = await Swal.fire({
    title: `${nuevoEstado ? "Activar" : "Desactivar"} estructura`,
    html: `¿Desea ${accion} la estructura <b>${estructuraAsociada.nombre}</b>?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar",
    width: "350px",
    customClass: {
      popup: "popup-personalizado",
      title: "titulo-alerta-personalizado",
      confirmButton: "confirmacion-alerta-personalizado",
      cancelButton: "cancelacion-alerta-personalizado",
    },
    buttonsStyling: false,
  });

  if (!resultado.isConfirmed) return;

  if (estructuraAsociada.esMock) {
    Swal.fire({
      title: "Vista de prueba",
      text: "Esta estructura es información quemada para revisar el diseño visual.",
      icon: "info",
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

  try {
    await peticionAPI(`/campos/estructuras/${estructuraAsociada.id}/`, "PUT", {
      activo: nuevoEstado,
    });

    Swal.fire({
      title: nuevoEstado ? "¡Activada!" : "¡Desactivada!",
      text: `La estructura fue ${nuevoEstado ? "activada" : "desactivada"} correctamente.`,
      icon: "success",
      width: "300px",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
      },
      buttonsStyling: false,
    });

    setTimeout(() => {
      traerEstructuras();
    }, 1000);
  } catch (error) {
    console.error("Error al cambiar estado de estructura:", error);
  }
};

const eliminarEstructuraDelAspecto = async (estructuraAsociada) => {
  if (!esAdministrador.value) return;

  const resultado = await Swal.fire({
    title: "Eliminar estructura",
    html: `¿Desea eliminar la estructura <b>${estructuraAsociada.nombre}</b>?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar",
    width: "350px",
    customClass: {
      popup: "popup-personalizado",
      title: "titulo-alerta-personalizado",
      confirmButton: "confirmacion-alerta-personalizado",
      cancelButton: "cancelacion-alerta-personalizado",
    },
    buttonsStyling: false,
  });

  if (!resultado.isConfirmed) return;

  if (estructuraAsociada.esMock) {
    Swal.fire({
      title: "Vista de prueba",
      text: "Esta estructura es información quemada para revisar el diseño visual.",
      icon: "info",
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

  try {
    await peticionAPI(`/campos/estructuras/${estructuraAsociada.id}/`, "DELETE", {
      confirmacion: true,
    });

    Swal.fire({
      title: "¡Eliminada!",
      text: "La estructura fue eliminada correctamente.",
      icon: "success",
      width: "300px",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
      },
      buttonsStyling: false,
    });

    setTimeout(() => {
      traerEstructuras();
    }, 1000);
  } catch (error) {
    console.error("Error al eliminar estructura:", error);
  }
};

const irAEstructuraDelAspecto = async (estructuraAsociada) => {
  const estructuraId = estructuraAsociada?.id;

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

  const tipo = estructuraAsociada.tipo_evidencia || estructuraAsociada.tipo || "";

  if (tipo === "Documental" || tipo === "archivos") {
    estructuraStore.setEstructura({
      id: estructuraId,
      nombre: estructuraAsociada.nombre,
      tipo_evidencia: tipo,
      activo: estructuraAsociada.activo !== false,
      id_archivos: estructuraAsociada.id_archivos,
      mapeo_archivos: estructuraAsociada.mapeo_archivos || [],
    });

    router.push({
      name: procesoId.value ? "factorArchivosGestion" : "archivosGestion",
      params: procesoId.value
        ? { proceso_id: procesoId.value, factor_id: factorId.value }
        : { factor_id: factorId.value },
    });
    return;
  }

  if (tipo !== "Tabla" && tipo !== "datos") {
    await Swal.fire({
      title: "Tipo de evidencia no soportado",
      text: "Solo las evidencias de tipo Tabla pueden abrir el tablero.",
      icon: "info",
      width: "360px",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
      },
      buttonsStyling: false,
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

const traerEstructuras = async () => {
  try {
    await mostrarCargando(
      "Cargando características",
      "Consultando las características del factor…"
    );

    await cargarCaracteristicas();

    cerrarCargando();
  } catch (error) {
    console.error("Error al cargar características:", error?.response?.data || error);

    cerrarCargando();

    await mostrarErrorFactor("No fue posible cargar las características.");
  }
};

const cerrarModal = () => {
  _gestionEstructura.value = false;
  _crearEstructura.value = false;

  setTimeout(() => {
    traerEstructuras();
  }, 1000);
};

const crearEstructura = () => {
  if (!esAdministrador.value) return;
  _crearEstructura.value = true;
};

const obtenerItem = (item) => {
  return item?.raw || item;
};

const verEstructura = (item) => {
  const estructura = obtenerItem(item);

  _gestionEstructura.value = true;
  _modo.value = false;
  datosEstructura.value = estructura;
};

const editarEstructura = (item) => {
  if (!esAdministrador.value) return;

  const estructura = obtenerItem(item);

  _gestionEstructura.value = true;
  _modo.value = true;
  datosEstructura.value = estructura;
};

const reactivarEstructura = async (item) => {
  if (!esAdministrador.value) return;

  const estructura = obtenerItem(item);
  const id = estructura.id;
  const nombre = estructura.nombre;

  const resultado = await Swal.fire({
    title: "Reactivar Estructura",
    html: `¿Desea reactivar la estructura <b>${nombre}</b>?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar",
    width: "350px",
    customClass: {
      popup: "popup-personalizado",
      title: "titulo-alerta-personalizado",
      confirmButton: "confirmacion-alerta-personalizado",
      cancelButton: "cancelacion-alerta-personalizado",
    },
    buttonsStyling: false,
  });

  if (resultado.isConfirmed) {
    peticionAPI(`/campos/estructuras/${id}/`, "PUT", { activo: true })
      .then(() => {
        Swal.fire({
          title: "¡Activado!",
          text: "La estructura ha sido reactivada correctamente.",
          icon: "success",
          width: "300px",
          customClass: {
            popup: "popup-personalizado",
            title: "titulo-alerta-personalizado",
            confirmButton: "confirmacion-alerta-personalizado",
          },
          buttonsStyling: false,
        });

        setTimeout(() => {
          traerEstructuras();
        }, 1000);
      })
      .catch((error) => console.error(error));
  }
};

const eliminarEstructura = async (item) => {
  if (!esAdministrador.value) return;

  const estructura = obtenerItem(item);
  const id = estructura.id;
  const nombre = estructura.nombre;

  const resultado = await Swal.fire({
    title: "Deshabilitar Estructura",
    html: `¿Desea inhabilitar la estructura <b>${nombre}</b>?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar",
    width: "350px",
    customClass: {
      popup: "popup-personalizado",
      title: "titulo-alerta-personalizado",
      confirmButton: "confirmacion-alerta-personalizado",
      cancelButton: "cancelacion-alerta-personalizado",
    },
    buttonsStyling: false,
  });

  if (resultado.isConfirmed) {
    peticionAPI(`/campos/estructuras/${id}/`, "DELETE", {
      confirmacion: true,
    })
      .then(() => {
        Swal.fire({
          title: "¡Deshabilitado!",
          text: "El elemento ha sido deshabilitado correctamente.",
          icon: "success",
          width: "300px",
          customClass: {
            popup: "popup-personalizado",
            title: "titulo-alerta-personalizado",
            confirmButton: "confirmacion-alerta-personalizado",
          },
          buttonsStyling: false,
        });

        setTimeout(() => {
          traerEstructuras();
        }, 1000);
      })
      .catch((error) => console.error(error));
  }
};

const diriguirseEstructura = (item) => {
  const estructura = obtenerItem(item);

  estructuraStore.setEstructura({
    id: estructura.id,
    nombre: estructura.nombre,
    mapeo: estructura.mapeo,
  });

  router.push({
    name: procesoId.value ? "factorTablero" : "tablero",
    params: {
      ...(procesoId.value ? { proceso_id: procesoId.value } : {}),
      factor_id: factorId.value,
    },
  });
};


/* Inicio listado de caracteristicas */

const abrirCrearCaracteristica = async () => {
  if (!esAdministrador.value) return;

  const resultado = await crearCaracteristicaDialog();

  if (!resultado.isConfirmed) return;

  try {
    await crearCaracteristicaApi(resultado.value);

    await mostrarExito(
      "¡Creada!",
      "La característica se creó correctamente."
    );
  } catch (error) {
    console.error("Error al crear característica:", error?.response?.data || error);

    await mostrarError("No fue posible crear la característica.");
  }
};

const verCaracteristica = async (item) => {
  const caracteristica = obtenerItem(item);
  await verCaracteristicaDialog(caracteristica);
};

const editarCaracteristica = async (item) => {
  if (!esAdministrador.value) return;

  const caracteristica = obtenerItem(item);

  const resultado = await editarCaracteristicaDialog(caracteristica);

  if (!resultado.isConfirmed) return;

  try {
    await actualizarCaracteristica(caracteristica.id, {
      nombre: resultado.value.nombre,
      descripcion: resultado.value.descripcion,
      calificacion: resultado.value.calificacion,
    });

    await mostrarExito(
      "¡Actualizada!",
      "La característica se actualizó correctamente."
    );
  } catch (error) {
    console.error("Error al editar característica:", error?.response?.data || error);

    await mostrarError("No fue posible editar la característica.");
  }
};

const cambiarEstadoCaracteristica = async (item) => {
  if (!esAdministrador.value) return;

  const caracteristica = obtenerItem(item);

  const resultado = await confirmarCambioEstadoCaracteristicaDialog(
    caracteristica
  );

  if (!resultado.isConfirmed) return;

  try {
    const nuevoEstado = caracteristica.activo === false;

    await cambiarEstadoCaracteristicaApi(caracteristica);

    await mostrarExito(
      nuevoEstado ? "¡Activada!" : "¡Desactivada!",
      `La característica fue ${nuevoEstado ? "activada" : "desactivada"} correctamente.`
    );
  } catch (error) {
    console.error("Error al cambiar estado de característica:", error?.response?.data || error);

    await mostrarError("No fue posible cambiar el estado de la característica.");
  }
};

const eliminarCaracteristica = async (item) => {
  if (!esAdministrador.value) return;

  const caracteristica = obtenerItem(item);

  const resultado = await confirmarEliminarCaracteristicaDialog(
    caracteristica
  );

  if (!resultado.isConfirmed) return;

  try {
    await eliminarCaracteristicaApi(caracteristica);

    await mostrarExito(
      "¡Eliminada!",
      "La característica se eliminó correctamente."
    );
  } catch (error) {
    console.error("Error al eliminar característica:", error?.response?.data || error);

    await mostrarError("No fue posible eliminar la característica.");
  }
};

/* Fin listado de caracteristicas */

const diriguirseArchivos = (item) => {
  const estructura = obtenerItem(item);

  estructuraStore.setEstructura({
    id: estructura.id,
    nombre: estructura.nombre,
    mapeo: estructura.mapeo,
    id_archivos: estructura.id_archivos,
    mapeo_archivos: estructura.mapeo_archivos,
  });

  router.push({
    name: procesoId.value ? "factorArchivosGestion" : "archivosGestion",
    params: procesoId.value
      ? { proceso_id: procesoId.value, factor_id: factorId.value }
      : { factor_id: factorId.value },
  });
};

onMounted(async () => {
  try {
    await mostrarCargando(
      "Cargando factor",
      "Consultando la información del factor…"
    );

    await cargarFactor();

    cerrarCargando();
  } catch (error) {
    console.error("Error al cargar factor:", error?.response?.data || error);

    cerrarCargando();

    await mostrarErrorFactor("No fue posible cargar el factor.");
    return;
  }

  await traerEstructuras();
});

</script>

<style scoped>
.factor-page {
  width: 94%;
  max-width: 1280px;
  margin: 16px auto 48px;
  font-family: Arial, Helvetica, sans-serif;
  color: #263238;
}

.flow-nav {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 12px;
}

/* FACTOR */



/* CABECERA */

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 22px 0 12px;
  padding: 14px 18px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #f5f7fb;
}

.section-header h2 {
  margin: 0;
  color: #2f4774;
  font-size: 24px;
  font-weight: 900;
}

.section-header__label {
  color: #607d9a;
}

.btn-main,
.btn-aspecto {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.search-field {
  margin-bottom: 16px;
}

/* CARACTERÍSTICAS */

.btn-toggle {
  flex: 0 0 auto;
}

/* ASPECTOS */


.btn-aspecto {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.02em;
}


.evidencias-title {
  margin-bottom: 8px;
  color: #2e8b74;
  font-size: 12px;
  font-weight: 900;
}

/* ESTRUCTURAS */

.estructuras-asociadas {
  margin-top: 14px;
  padding: 14px;
  border: 1px solid #cfe0ef;
  border-left: 5px solid #4a7cad;
  border-radius: 12px;
  background: #f7fbff;
}

.estructuras-asociadas__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
  padding: 10px 12px;
  border: 1px solid #d7e7f4;
  border-radius: 10px;
  background: #ffffff;
}

.estructuras-asociadas__label {
  display: block;
  margin-bottom: 3px;
  color: #4a7cad;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.estructuras-asociadas__header h6 {
  margin: 0;
  color: #2f4774;
  font-size: 14px;
  font-weight: 900;
  line-height: 1.25;
}

.estructuras-asociadas__buttons {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;
}

/* Tabla uniforme */

.estructuras-table {
  width: 100%;
  overflow: hidden;
  border: 1px solid #c3d7e8;
  border-radius: 10px;
  background: #ffffff;
}

.estructuras-table__header,
.estructuras-table__row {
  display: grid;
  grid-template-columns: 72px 150px minmax(220px, 1fr) 120px 250px;
  align-items: stretch;
  width: 100%;
}

.estructuras-table__header {
  min-height: 42px;
}

.estructuras-table__row {
  min-height: 56px;
}

.estructuras-table__header span,
.estructuras-table__row > span {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  min-width: 0;
  padding: 9px 10px;
  border-right: 1px solid #c3d7e8;
}

.estructuras-table__header span {
  justify-content: center;
  background: #e7f1fa;
  color: #263238;
  font-size: 12px;
  font-weight: 900;
  text-align: center;
}

.estructuras-table__row > span {
  color: #37474f;
  font-size: 12px;
  border-top: 1px solid #c3d7e8;
  background: #ffffff;
}

.estructuras-table__header span:last-child,
.estructuras-table__row > span:last-child {
  border-right: none;
}

.estructuras-table__row > span:nth-child(1),
.estructuras-table__row > span:nth-child(2),
.estructuras-table__row > span:nth-child(4) {
  justify-content: center;
  text-align: center;
}

.estructuras-table__row > span:nth-child(3) {
  justify-content: flex-start;
  line-height: 1.35;
  word-break: break-word;
}

/* Acciones alineadas en una sola línea */

.estructuras-table__actions {
  display: flex !important;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
}

.estructuras-table__actions .v-btn {
  flex: 0 0 auto;
}

/* RESPONSIVE */

@media (max-width: 900px) {
  .factor-card__footer,
  .section-header,
  .aspectos-section__header,
  .actions-bar,
  .factor-actions-bar {
    align-items: flex-start;
    flex-direction: column;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .estructuras-table {
    overflow-x: auto;
  }

  .estructuras-table__header,
  .estructuras-table__row {
    min-width: 820px;
    grid-template-columns: 72px 150px minmax(220px, 1fr) 120px 250px;
  }

  .estructuras-table__header span,
  .estructuras-table__row > span {
    border-right: 1px solid #c3d7e8;
  }

  .estructuras-table__header span:last-child,
  .estructuras-table__row > span:last-child {
    border-right: none;
  }

  .estructuras-asociadas__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .estructuras-table__header,
  .estructuras-table__row {
    grid-template-columns: 1fr;
  }

  .estructuras-table__header span,
  .estructuras-table__row span {
    border-right: none;
  }
}
</style>
