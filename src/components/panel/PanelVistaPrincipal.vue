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
      <!-- <h1 class="titulo__cabecera">{{ panelStore?.panel.nombre }}</h1> -->
      <v-spacer />
      <!-- <v-btn color="red" @click="desactivarSwapy" v-if="swapyActivo"
        >Bloquear movimiento</v-btn
      >
      <v-btn color="green" @click="activarSwapy" v-else
        >Permitir movimiento</v-btn
      > -->
      <!-- :color="swapyActivo ? 'red' : 'green'"  -->
      <v-btn
        @click="toggleSwapy"
        :variant="swapyActivo ? 'flat' : 'outlined'"
        color="primary"
        v-if="roleUsuario.includes('ADMIN_OBSERVATORIOS')"
      >
        {{ swapyActivo ? "Guardar" : "Modificar Panel" }}
      </v-btn>

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
              <!-- <v-btn @click="toggleSwapy" color="primary">
                Modificar Gráfica
              </v-btn> -->
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
import { useRouter } from "vue-router";
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

// Función para calcular el ancho
const calcularAncho = () => {
  const ancho = miElemento.value.offsetWidth;
  // resultado.value = (ancho - 100) / filas;
  resultado.value = (ancho - 1000) / filas;
  console.log(resultado.value, "-----------");
};


const editarGrafica = (grafica) => {
    graficaStore.setGrafica(grafica)
    router.push(`/${observatorioStore.observatorio?.id}/panel/graficas/${panelStore.panel?.id}/${grafica.columna}/${grafica.fila}`);
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
          location.reload();  // 👈 Esto recarga toda la página
        }, 2000);
      }).catch((error) => console.error(error));
    }
  });
}

// Usar onMounted para ejecutar el cálculo después de montar el componente
// onMounted(() => {
// });

// const desactivarSwapy = () => {
//   if (swapy.value) {
//     swapy.value.destroy();
//     swapy.value = null;
//     swapyActivo.value = false;
//     console.log("Swapy desactivado");
//   }
// };

// const activarSwapy = () => {
//   if (miElemento.value && !swapy.value) {
//     swapy.value = createSwapy(miElemento.value);
//     swapy.value.onSwap((evento) => {
//       console.log("Intercambio detectado:", evento);
//     });
//     swapyActivo.value = true;
//     console.log("Swapy activado");
//   }
// };

const toggleSwapy = () => {
  if (swapyActivo.value) {
    // Está activo, entonces lo desactivamos
    if (swapy.value) {
      swapy.value.destroy();
      swapy.value = null;
      modificarPanel();
    }
    swapyActivo.value = false;
    console.log("Swapy desactivado");
  } else {
    // Está desactivado, entonces lo activamos
    if (miElemento.value) {
      swapy.value = createSwapy(miElemento.value);
      swapy.value.onSwap((evento) => {
        console.log("Intercambio detectado:", evento.newSlotItemMap.asArray);
        nuevoOrden.value = evento.newSlotItemMap.asArray;
      });
    }
    swapyActivo.value = true;
    console.log("Swapy activado");
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
  // console.log(
  //   graficos.value.find(
  //     (grafico) => grafico.columna === columna && grafico.fila === fila
  //   ),
  //   fila,
  //   columna
  // );
  console.log("ingreso a principal, columna:", columna, "fila:", fila);
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
    console.log(panelStore.panel)
    const response = await peticionAPI(`/graficos/${panelStore.panel.id}/`);
    graficos.value = response;
  } catch (error) {
    console.error("Error al obtener los gráficos:", error);
  }
};

onMounted(() => {

  console.log(userStore.user.role, '---user');
  roleUsuario.value = userStore.user.role
  obtenerGraficos();
  // console.log(graficos.value);
  calcularAncho();
  // if (contenedor.value) {
  //   swapy.value = createSwapy(contenedor.value);
  //   swapy.value.onSwap((evento) => {
  //     console.log("Intercambio detectado:", evento);
  //   });
  // }
  // if (miElemento.value) {
  //   swapy.value = createSwapy(miElemento.value);
  //   swapy.value.onSwap((evento) => {
  //     console.log("Intercambio detectado:", evento);
  //   });
  // }
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
.cabecera {
  margin: auto;
  width: 98%;
}
.modificar__grafica{
  /* background-color: red; */
display: flex;
justify-content: flex-end;
  width: 100%;
  padding: 10px;
}
</style>
  