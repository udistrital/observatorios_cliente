<template>
  <div
    class="contenedor-grilla vista__primaria"
    ref="miElemento"
    :style="{
      '--tamano-celdas': tamanoCeldas,
      '--tamano-filas': tamanoFilas,
    }"
  >
    <div class="cabecera">
      <v-spacer />
      <v-btn
        @click="toggleSwapy"
        :variant="swapyActivo ? 'flat' : 'outlined'"
        color="primary"
        v-if="roleUsuario.includes('ADMIN_OBSERVATORIOS')"
      >
        {{ swapyActivo ? "Guardar" : "Modificar Panel" }}
      </v-btn>
    </div>

    <div v-for="indiceFila in filas" :key="indiceFila" class="fila">
      <div
        v-for="indiceColumna in columnas"
        :key="indiceColumna"
        :data-swapy-slot="`${indiceColumna}_${indiceFila}`"
        class="celda"
        :id="`${indiceColumna}_${indiceFila}`"
      >
        <div
          :data-swapy-item="`${indiceColumna}_${indiceFila}`"
          style="height: 100%; width: 100%"
        >
          <v-card
            v-if="buscarGrafico(indiceColumna, indiceFila)"
            class="nueva-grafica"
            @mouseup="isHovering = true"
          >
            <div v-if="swapyActivo" class="modificar__grafica">
              <v-btn
              variant="text"
              icon
              size="small"
              color="primary"
              title="Editar Grafica"
              @click="editarGrafica(
                buscarGrafico(indiceColumna, indiceFila))
                "
              >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
              <v-btn
                variant="text"
                icon
                size="small"
                color="primary"
                title="Eliminar Grafica"
                @click="eliminarGrafica(
                  buscarGrafico(indiceColumna, indiceFila).id
                )"
              >
                <v-icon>mdi-trash-can</v-icon>
              </v-btn>
            </div>
            <v-spacer/>
            <ContenedorGrafica
              :dashboard-id="panelStore.panel.id"
              :grafico-id="buscarGrafico(indiceColumna, indiceFila)?.id"
              :tipo="
                buscarGrafico(indiceColumna, indiceFila)?.configuracion?.tipo
              "
              :nombre-grafica="buscarGrafico(indiceColumna, indiceFila)?.nombre"
              :tamanowidth="resultado"
            />
          </v-card>
          <div class="" v-else >

          <div
            class="generico"
            v-if="swapyActivo"
            @click="crearGrafica(indiceColumna, indiceFila)"
          >
            <v-card class="nueva-grafica" @mouseup="isHovering = true">
              <v-icon
                class="nueva__grafica-icon"
                color="grey-lighten-1"
                icon="mdi-plus-circle-outline"
                size="150"
              ></v-icon>
              <p class="nueva__grafica-text">Agregar Gráfica</p>
            </v-card>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { createSwapy } from "swapy";
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import peticionAPI from "@/service/conexion_api";
import { usePanelStore } from "@/stores/panelStore";
import { useGraficaStore } from "@/stores/graficaStore";
import ContenedorGrafica from "./graficas/ContenedorGrafica.vue";
import { useObservatorioStore } from "@/stores/observatorioStore";
import Swal from "sweetalert2";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
const observatorioStore = useObservatorioStore();
const panelStore = usePanelStore();
const graficaStore = useGraficaStore();
const panelId = panelStore.panel.id;
const router = useRouter();
const route = useRoute();
const tamanoCeldas = ref(1);
const tamanoFilas = ref(1);
const filas = ref(3);
const columnas = panelStore.panel?.columnas? ref(panelStore.panel.columnas): ref(3);
const swapy = ref(null);
const contenedor = ref();
const isHovering = ref(false);
const swapyActivo = ref(false);
const nuevoOrden = ref([]);
const roleUsuario = ref('')
const resultado = ref(0);
const miElemento = ref(null);

const calcularAncho = () => {
  const ancho = miElemento.value.offsetWidth;
  resultado.value = (ancho - 1000) / filas;
};


const editarGrafica = (grafica) => {
    graficaStore.setGrafica(grafica)
    router.push({
      name: route.params.proceso_id ? "factorPanelGraficas" : "panelGraficas",
      params: route.params.proceso_id
        ? {
            proceso_id: route.params.proceso_id,
            factor_id: route.params.factor_id,
            panel: panelStore.panel?.id,
            columna: grafica.columna,
            fila: grafica.fila,
          }
        : {
            factor_id: route.params.factor_id || observatorioStore.observatorio?.id,
            panel: panelStore.panel?.id,
            columna: grafica.columna,
            fila: grafica.fila,
          },
    });
}

const eliminarGrafica = (graficaId) => {
  const panelId = panelStore.panel?.id;

  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción eliminará la gráfica permanentemente.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    width: "300px",
    customClass: {
      popup: "popup-personalizado",
      title: "titulo-alerta-personalizado",
      confirmButton: "confirmacion-alerta-personalizado",
      cancelButton: "cancelacion-alerta-personalizado",
    },
    buttonsStyling: false,
  }).then((result) => {
    if (result.isConfirmed) {
      peticionAPI(`/graficos/${panelId}/${graficaId}/`, "DELETE").then((data) => {
        Swal.fire({
          title: "¡Eliminado!",
          text: "La gráfica se eliminó correctamente.",
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
          location.reload();
        }, 2000);
      }).catch((error) => console.error(error));
    }
  });
}

const toggleSwapy = () => {
  if (swapyActivo.value) {
    if (swapy.value) {
      swapy.value.destroy();
      swapy.value = null;
      modificarPanel();
    }
    swapyActivo.value = false;
  } else {
    if (miElemento.value) {
      swapy.value = createSwapy(miElemento.value);
      swapy.value.onSwap((evento) => {
        nuevoOrden.value = evento.newSlotItemMap.asArray;
      });
    }
    swapyActivo.value = true;
  }
};

const modificarPanel = () => {
  peticionAPI(`dashboards/${panelStore.panel.id}/`, "PUT", {
    orden: nuevoOrden.value,
  })
    .then((data) => {
      Swal.fire({
        title: "¡Activado!",
        text: "El panel se ha sido reactivado correctamente.",
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
        traerPaneles();
      }, 1000);
    })
    .catch((error) => console.error(error));
};

const buscarGrafico = (columna, fila) => {
  return graficos.value.find(
    (grafico) => grafico.columna === columna && grafico.fila === fila
  );
};

const agregarItem = () => {
  const slots = document.querySelectorAll(".celda");
  if (slots.length === 0) {
    return;
  }

  const indiceAleatorio = Math.floor(Math.random() * slots.length);
  const slotSeleccionado = slots[indiceAleatorio];

  if (slotSeleccionado.querySelector(".item")) return;

  const nuevoItem = document.createElement("div");
  nuevoItem.classList.add("item-inactivo");

  nuevoItem.style.width = "100%";
  nuevoItem.style.height = "100%";
  nuevoItem.style.backgroundColor = "rgb(243, 63, 213)";
  nuevoItem.style.border = "1px solid black";

  nuevoItem.setAttribute("data-swapy-item", slotSeleccionado.id);
  nuevoItem.innerHTML = "<div class = 'item-inactivo'>A</div>";

  slotSeleccionado.appendChild(nuevoItem);
  swapy.value.update();
};

const graficos = ref([]);

const obtenerGraficos = async () => {
  try {
    const response = await peticionAPI(`/graficos/${panelStore.panel.id}/`);
    graficos.value = response;
  } catch (error) {
    console.error("Error al obtener los gráficos:", error);
  }
};

onMounted(() => {
  roleUsuario.value = userStore.user.role
  obtenerGraficos();
  calcularAncho();
});

onUnmounted(() => {
  swapy.value?.destroy();
  
});
const crearGrafica = (columna, fila) => {
  router.push({
    name: route.params.proceso_id ? "factorPanelGraficas" : "panelGraficas",
    params: route.params.proceso_id
      ? { proceso_id: route.params.proceso_id, factor_id: route.params.factor_id, panel: panelId, columna, fila }
      : { factor_id: route.params.factor_id || observatorioStore.observatorio?.id, panel: panelId, columna, fila },
  });
};
</script>
  
  <style scoped>
.contenedor-grilla {
  display: flex;
  flex-direction: column;
  grid-template-columns: repeat(var(--tamano-celdas), 1fr);
  grid-template-rows: repeat(var(--tamano-filas), 1fr);
  height: 100%;
  overflow: auto;
  gap: 5px;
}

.fila {
  display: flex;
  height: calc(100% / var(--tamano-filas));
  gap: 5px;
  margin: 5px;
}

.celda {
  width: calc(100% / var(--tamano-celdas));
  height: 100%;
  margin: 5px;
}

.item {
  width: 80%;
  height: 90%;
  background-color: rgb(255, 255, 0);
}

.item-inactivo {
  width: calc(100% / var(--tamano-celdas));
  height: 100% !important;
  background-color: rgb(243, 63, 213);
  border: 1px solid black;
}
.generico {
  display: flex;
  min-height: calc(90vw / 3);
  cursor: pointer;
}
.nueva-grafica {
  min-height: 100%;
  display: flex;
  align-items: center;
  border-radius: 16px;
  justify-content: center;
  flex-direction: column;
  width: 100%;
}
.nueva-grafica:hover {
  box-shadow: 0px 8px 10px -5px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)),
    0px 16px 24px 2px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)),
    0px 6px 30px 5px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.12)) !important;
}
.nueva__grafica-icon {
}
.nueva__grafica-text {
  color: #bdbdbd;
  font-size: 24px;
  font-weight: bold;
}
.cabecera {
  margin: auto;
  width: 98%;
}
.modificar__grafica{
display: flex;
justify-content: flex-end;
  width: 100%;
  padding: 10px;
}
</style>
  
