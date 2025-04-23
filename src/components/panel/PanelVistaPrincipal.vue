<template>
  <!-- <div class="vista__primaria"></div> -->
  <div
    class="contenedor-grilla vista__primaria"
    ref="miElemento"
    :style="{
      '--tamano-celdas': tamanoCeldas,
      '--tamano-filas': tamanoFilas,
    }"
  >
    <div class="cabecera">
      <h1 class="titulo__cabecera">{{ panelStore?.panel.nombre }}</h1>
      <v-spacer />
      <!-- <v-btn color="primary" prepend-icon="mdi-plus" @click="agregarGrafica"
          >Añadir Grafica</v-btn
        > -->
    </div>
    <!-- <button @click="agregarItem">Crear Grafico</button> -->

    <div v-for="indiceFila in filas" :key="indiceFila" class="fila">
      <div
        v-for="indiceColumna in columnas"
        :key="indiceColumna"
        :data-swapy-slot="`${indiceColumna}_${indiceFila}`"
        class="celda"
        :id="`${indiceColumna}_${indiceFila}`"
      >
        <!-- <div class="" v-if="!buscarGrafico(indiceColumna, indiceFila)"></div> -->
        <v-card
          v-if="buscarGrafico(indiceColumna, indiceFila)"
          class="nueva-grafica"
          @mouseup="isHovering = true"
        >
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
        <div
          class="generico"
          v-else
          @click="crearGrafica(indiceColumna, indiceFila)"
        >
          <v-card class="nueva-grafica" @mouseup="isHovering = true">
            <!-- <v-btn
              class="ma-2"
              color="blue-lighten-2"
              icon="mdi-plus-circle-outline"
              variant="text"
            ></v-btn> -->
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
</template>
  
  <script setup>
import { createSwapy } from "swapy";
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import peticionAPI from "@/service/conexion_api";
import { usePanelStore } from "@/stores/panelStore";
import ContenedorGrafica from "./graficas/contenedorGrafica.vue";
import { useObservatorioStore } from "@/stores/observatorioStore";
// import { usePanelStore } from '@/stores/panelStore';

// const panelStore = usePanelStore();
const observatorioStore = useObservatorioStore();
const panelStore = usePanelStore();
const panelId = panelStore.panel.id;
const router = useRouter();
const tamanoCeldas = ref(1);
const tamanoFilas = ref(1);
const filas = ref(3);
const columnas = ref(3);
const swapy = ref(null);
const contenedor = ref();
const isHovering = ref(false);

// Definir una referencia para el resultado
const resultado = ref(0);
const miElemento = ref(null);

// Función para calcular el ancho
const calcularAncho = () => {
  const ancho = miElemento.value.offsetWidth;
  // resultado.value = (ancho - 100) / filas;
  resultado.value = (ancho - 1000) / filas;
  console.log(resultado.value, "-----------");
};

// Usar onMounted para ejecutar el cálculo después de montar el componente
// onMounted(() => {
// });

const buscarGrafico = (columna, fila) => {
  console.log(
    graficos.value.find(
      (grafico) => grafico.columna === columna && grafico.fila === fila
    ),
    fila,
    columna
  );
  return graficos.value.find(
    (grafico) => grafico.columna === columna && grafico.fila === fila
  );
};

const agregarItem = () => {
  console.log("Por aqui pase ");
  const slots = document.querySelectorAll(".celda"); // Obtener todas las celdas
  if (slots.length === 0) {
    console.log("Sin Slots");
    return; // Salir si no hay celdas
  }

  const indiceAleatorio = Math.floor(Math.random() * slots.length); // Elegir una celda al azar
  const slotSeleccionado = slots[indiceAleatorio];

  // Evitar duplicados en la celda seleccionada
  if (slotSeleccionado.querySelector(".item")) return;

  // Crear el nuevo elemento
  const nuevoItem = document.createElement("div");
  nuevoItem.classList.add("item-inactivo");

  nuevoItem.style.width = "100%";
  nuevoItem.style.height = "100%";
  nuevoItem.style.backgroundColor = "rgb(243, 63, 213)";
  nuevoItem.style.border = "1px solid black";

  nuevoItem.setAttribute("data-swapy-item", slotSeleccionado.id);
  nuevoItem.innerHTML = "<div class = 'item-inactivo'>A</div>";

  // Agregar al slot seleccionado
  slotSeleccionado.appendChild(nuevoItem);
  swapy.value.update();
};

const graficos = ref([]);

const obtenerGraficos = async () => {
  try {
    const response = await peticionAPI(`/graficos/${panelStore.panel.id}`);
    graficos.value = response;
  } catch (error) {
    console.error("Error al obtener los gráficos:", error);
  }
};

onMounted(() => {
  obtenerGraficos();
  console.log(graficos.value);
  calcularAncho();
  if (contenedor.value) {
    swapy.value = createSwapy(contenedor.value);
    swapy.value.onSwap((evento) => {
      console.log("Intercambio detectado:", evento);
    });
  }
});

// onMounted(() => {
// });

onUnmounted(() => {
  swapy.value?.destroy();
});
const crearGrafica = (columna, fila) => {
  router.push({
    path: `graficas/${panelId}/${columna}/${fila}`,
    // path: /:observatorio_id/panel/graficas/,`/${observatorioStore.observatorio?.observatorio_id}/tablero`
    params: { panel: panelId, columna, fila },
  });
};
</script>
  
  <style scoped>
.contenedor-grilla {
  display: flex;
  flex-direction: column;
  grid-template-columns: repeat(var(--tamano-celdas), 1fr);
  grid-template-rows: repeat(var(--tamano-filas), 1fr);
  /* max-width: 50% !important; */
  height: 100%;
  overflow: auto;
  /* margin: 5%; */
  gap: 5px;
  /* background-color: seagreen; */
}

.fila {
  display: flex;
  height: calc(100% / var(--tamano-filas));
  gap: 5px;
  margin: 5px;
  /* background-color: tomato; */
}

.celda {
  width: calc(100% / var(--tamano-celdas));
  height: 100%;
  /* border-radius: 16px;
  background-color: rgb(234, 234, 234); */
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
  /* box-shadow: 0px 5px 5px -3px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)),
    0px 2px 2px 1px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)),
    0px 3px 14px 2px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.12)) !important; */
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
</style>
  