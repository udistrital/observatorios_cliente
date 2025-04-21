<template>
  <div
    class="contenedor-grilla vista__primaria"
    ref="contenedor"
  >
    <!-- :style="{
      '--tamano-celdas': tamanoCeldas,
      '--tamano-filas': tamanoFilas,
    }" -->
    <button @click="agregarItem">Crear Grafico</button>

    <div v-for="indiceFila in filas" :key="indiceFila" class="fila">
      <div
        v-for="indiceColumna in columnas"
        :key="indiceColumna"
        :data-swapy-slot="`${indiceColumna}_${indiceFila}`"
        class="celda"
        :id="`${indiceColumna}_${indiceFila}`"
        @click="crearGrafica(indiceColumna, indiceFila)"
      >
        <!-- Si hay un gráfico en esa posición, renderiza el componente -->
        <ContenedorGrafica
          v-if="buscarGrafico(indiceColumna, indiceFila)"
          :dashboard-id="panelStore.panel.id"
          :grafico-id="buscarGrafico(indiceColumna, indiceFila)?.id"
          :tipo="buscarGrafico(indiceColumna, indiceFila)?.configuracion?.tipo"
          :nombre-grafica="buscarGrafico(indiceColumna, indiceFila)?.nombre"
        />
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

const panelStore = usePanelStore();
const panelId = panelStore.panel.id;
const router = useRouter();
const tamanoCeldas = ref(1);
const tamanoFilas = ref(1);
const filas = ref(3);
const columnas = ref(3);
const swapy = ref(null);
const contenedor = ref();

onMounted(() => {
  if (contenedor.value) {
    swapy.value = createSwapy(contenedor.value);
    swapy.value.onSwap((evento) => {
      console.log("Intercambio detectado:", evento);
    });
  }
});

onUnmounted(() => {
  swapy.value?.destroy();
});

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
});
const crearGrafica = (columna, fila) => {
  router.push({
    name: "panelGraficas",
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
  max-width: 100%;
  height: 100%;
  /* margin: 5%; */
  gap: 5px;
}

.fila {
  display: flex;
  height: calc(100% / var(--tamano-filas));
  gap: 5px;
}

.celda {
  width: calc(100% / var(--tamano-celdas));
  height: 100%;
  border-radius: 16px;
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
</style>
  