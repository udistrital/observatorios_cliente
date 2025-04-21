<template>
  <div class="main__creargrafica">
    <div class="creargrafica__container">
      <div class="muestra__grafica" v-if="verificar">
        <PieChart v-if="tipoVisualizacion == 'pie'" :data="datosGrafica.data" :title="nombreGrafica" />
        <BarChart v-if="tipoVisualizacion == 'barras'" :data="datosGrafica.data" :title="nombreGrafica"/>
        <LineChart v-if="tipoVisualizacion == 'linea'" :data="datosGrafica.data" :title="nombreGrafica" :metadata="datosGrafica.grafico_metadata"/>
        
      </div>
    </div>
    <div class="creargrafica__formulario">
      <v-card>
        <v-card-text>
          <v-form @submit.prevent="crearGrafica">
            <v-text-field
              v-model="nombreGrafica"
              label="Título de la gráfica"
              variant="outlined"
              density="comfortable"
              required
            ></v-text-field>
            <v-select
              v-model="estructuraSeleccionada"
              label="Estructura"
              :items="estructuras"
              item-title="nombre"
              item-value="id"
              variant="outlined"
              density="compact"
              hide-details
              width="35px"
              class="textfield__control"
            ></v-select>
            <v-select
              v-model="tipoGrafica"
              label="Tipo Grafica"
              :items="tiposGrafica"
              item-title="label"
              item-value="value"
              variant="outlined"
              density="compact"
              hide-details
              width="35px"
              class="textfield__control"
              @update:modelValue="traerConfiguracion"
            ></v-select>
            <div
              v-if="configuracionGrafica?.datos_requeridos"
              class="configuracion__container"
            >
              <div
                class="campos__configuracion"
                v-for="(campo, index) in configuracionGrafica?.datos_requeridos"
                :key="index"
              >
                <v-select
                  v-model="formValues[campo.tipo]"
                  :label="capitalize(campo.tipo)"
                  :items="campo.valores"
                  item-title="nombre_espanol"
                  item-value="id"
                  :menu-props="{ maxHeight: '200px' }"
                  variant="outlined"
                  density="compact"
                  hide-details
                  width="35px"
                  class="textfield__control"
                  @update:modelValue="traerCamposSugeridos(campo.tipo)"
                ></v-select>
                <!-- {{ campo.tipo }} -->
                <v-select
                  v-model="campoConfigSeleccionado[campo.tipo]"
                  label="Campo"
                  :items="camposConfig[campo.tipo]"
                  :menu-props="{ maxHeight: '200px' }"
                  variant="outlined"
                  density="compact"
                  hide-details
                  width="35px"
                  class="textfield__control"
                ></v-select>
                <div v-if="configuracionOperacion[campo.tipo]?.obligatorios.length >0 || configuracionOperacion[campo.tipo]?.opcionales.length >0">
                  <details>
                    <summary>Configurar</summary>
                    <div 
                      class="campos__configuracion"
                      v-for="(sub_campo, index) in configuracionOperacion[campo.tipo]?.obligatorios"
                      :key="index"
                      >
                      <v-text-field 
                        v-if="sub_campo.tipo== 'number'" 
                        type="number"
                        item-title="valor_espanol"
                        :label="capitalize(sub_campo.valor_espanol) +  ' *'"
                        :menu-props="{ maxHeight: '200px' }"
                        v-model="sub_campo.valor_actual"
                        variant="outlined"
                        density="compact"
                        hide-details
                        width="35px"
                        class="textfield__control"
                        ></v-text-field>

                      <v-text-field 
                        v-if="sub_campo.tipo== 'text'"
                        item-title="valor_espanol"
                        :label="capitalize(sub_campo.valor_espanol) +  ' *' "
                        :menu-props="{ maxHeight: '200px' }"
                        v-model="sub_campo.valor_actual"
                        variant="outlined"
                        density="compact"
                        hide-details
                        width="35px"
                        class="textfield__control"
                      >
                      </v-text-field>

                      <v-checkbox 
                        v-if="sub_campo.tipo=='checkbox'"
                        item-title="valor_espanol"
                          :menu-props="{ maxHeight: '200px' }"
                          :label="capitalize(sub_campo.valor_espanol) + ' *'"
                          v-model="sub_campo.valor_actual"
                          variant="outlined"
                          density="compact"
                          hide-details
                          width="35px"
                          class="textfield__control"
                      >
                      </v-checkbox>


                    </div>

                    <div 
                      class="campos__configuracion"
                      v-for="(sub_campo, index) in configuracionOperacion[campo.tipo]?.opcionales"
                      :key="index"
                      >
                      <v-text-field 
                        v-if="sub_campo.tipo== 'number'" 
                        type="number"
                        item-title="valor_espanol"
                        :label="capitalize(sub_campo.valor_espanol)"
                        :menu-props="{ maxHeight: '200px' }"
                        v-model="sub_campo.valor_actual"
                        variant="outlined"
                        density="compact"
                        hide-details
                        width="35px"
                        class="textfield__control"
                        ></v-text-field>

                      <v-text-field 
                        v-if="sub_campo.tipo== 'text'"
                        item-title="valor_espanol"
                        :label="capitalize(sub_campo.valor_espanol)"
                        :menu-props="{ maxHeight: '200px' }"
                        v-model="sub_campo.valor_actual"
                        variant="outlined"
                        density="compact"
                        hide-details
                        width="35px"
                        class="textfield__control"
                      >
                      </v-text-field>

                      <v-checkbox 
                      v-if="sub_campo.tipo=='checkbox'"
                      item-title="valor_espanol"
                        :menu-props="{ maxHeight: '200px' }"
                        :label="capitalize(sub_campo.valor_espanol)"
                        v-model="sub_campo.valor_actual"
                        variant="outlined"
                        density="compact"
                        hide-details
                        width="35px"
                        class="textfield__control"
                      >
                      </v-checkbox>


                    </div>
                  </details>
                </div>
              </div>
            </div>
          </v-form>
          <v-card-actions v-if="configuracionGrafica?.datos_requeridos">
          </v-card-actions>
            <v-card-actions style="display: flex; justify-content: flex-end; gap: 10px;">
            <v-btn variant="flat" color="primary" @click="crearConfiguracion">Visualizar</v-btn>
            <v-btn variant="flat" color="secondary" @click="guardarGrafica">Guardar</v-btn>
            </v-card-actions>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup>
// export default {};
import { ref, computed, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import peticionAPI from "@/service/conexion_api";
import Swal from "sweetalert2";
import { useObservatorioStore } from "@/stores/observatorioStore";
import PieChart from "./PieChart.vue";
import BarChart from "./BarChart.vue";
import LineChart from "./LineChart.vue";
import { usePanelStore } from '@/stores/panelStore';

const props = defineProps({
  columna: Number,
  fila: Number,
  panel: String,
});


const panelStore = usePanelStore();
const observatorioStore = useObservatorioStore();
const tipoGrafica = ref("");
const nombreGrafica = ref("");
const estructuraSeleccionada = ref("");
const configuracionGrafica = ref({});
const configuracionOperacion = ref({});
const cargando = ref(false);
const estructuras = ref([]);
const formValues = ref({});
const camposConfig = ref([]);
const campoConfigSeleccionado = ref({});
const datosGrafica = ref({})
const tiposGrafica = [
  {
    label: "Barras",
    value: "barras",
  },
  { label: "Pie", value: "pie" },
  {
    label: "Línea",
    value: "linea"
  }
];

const verificar = ref(false)
const tipoVisualizacion = ref('')
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

const traerConfiguracion = () => {
  peticionAPI("constructor_graficos/configuracion_grafico/", "GET", null, {
    tipo: tipoGrafica.value,
  })
    .then((data) => {
      configuracionGrafica.value = data;
    })
    .catch((error) => console.error(error));
};
const traerCamposSugeridos = (campoTipo) => {
  peticionAPI("constructor_graficos/campos_sugeridos/", "GET", null, {
    estructura: estructuraSeleccionada.value,
    operacion: formValues.value[campoTipo],
  })
    .then((data) => {
      camposConfig.value[campoTipo] = data.campos_recomendados;
      configuracionOperacion.value[campoTipo] = data.datos_operacion
    })
    .catch((error) => console.error(error));
};
const traerEstructuras = () => {
  cargando.value = true;
  peticionAPI("campos/estructuras/", "GET", null, {
    observatorio: observatorioStore.observatorio?.id,
  })
    .then((data) => {
      estructuras.value = data;
      cargando.value = false;
    })
    .catch((error) => console.error(error));
};
const crearGrafica = () => {
  console.log("Crear Grafica");
};
const crearConfiguracion = () => {
  let entradas = Object.keys(campoConfigSeleccionado.value);
  let configuracion = {
    estructura: estructuraSeleccionada.value,
    configuracion: {
      tipo: tipoGrafica.value,
    },
  };

  for (const element of entradas) {
    console.log("element", element)
    configuracion.configuracion[element] = {
      campo: campoConfigSeleccionado.value[element],
      operacion: formValues.value[element],
      obligatorios: {},
      opcionales : {}
    }

    let subcampos = configuracionOperacion.value[element];
    if (subcampos?.obligatorios) {
      for (const subcampo of subcampos.obligatorios) {
        // Si el subcampo tiene un input dinámico, tomamos el valor actual
        const valorActual = subcampo.valor_actual ? subcampo.valor_actual: subcampo.valor_por_defecto;
        configuracion.configuracion[element].obligatorios[subcampo.valor] = valorActual;

      }
    }

    if (subcampos?.opcionales) {
      for (const subcampo of subcampos.opcionales) {
        // Si el subcampo tiene un input dinámico, tomamos el valor actual
        const valorActual = subcampo.valor_actual ? subcampo.valor_actual: subcampo.valor_por_defecto;
        configuracion.configuracion[element].opcionales[subcampo.valor] = valorActual;
      }
    }


  }

  peticionAPI("/constructor_graficos/probar_configuracion/", "POST", configuracion)
    .then((data) => {
      datosGrafica.value = data
      verificar.value = true
      tipoVisualizacion.value = data.grafico_metadata.tipo
      // Swal.fire({
      //   title: "¡Creado!",
      //   text: "La estructura se creó correctamente.",
      //   icon: "success",
      //   width: "300px",
      //   customClass: {
      //     popup: "popup-personalizado",
      //     title: "titulo-alerta-personalizado",
      //     confirmButton: "confirmacion-alerta-personalizado",
      //   },
      //   buttonsStyling: false,
      // });
    })
    .catch((error) => console.error(error));
};

const guardarGrafica = () => {
  let entradas = Object.keys(campoConfigSeleccionado.value);
  let configuracion = {
    estructura: estructuraSeleccionada.value,
    configuracion: {
      tipo: tipoGrafica.value,
    },
  };

  for (const element of entradas) {
    configuracion.configuracion[element] = {
      campo: campoConfigSeleccionado.value[element],
      operacion: formValues.value[element],
      obligatorios: {},
      opcionales : {}
    }

    let subcampos = configuracionOperacion.value[element];
    if (subcampos?.obligatorios) {
      for (const subcampo of subcampos.obligatorios) {
        // Si el subcampo tiene un input dinámico, tomamos el valor actual
        const valorActual = subcampo.valor_actual ? subcampo.valor_actual: subcampo.valor_por_defecto;
        configuracion.configuracion[element].obligatorios[subcampo.valor] = valorActual;
        
      }
    }

    if (subcampos?.opcionales) {
      for (const subcampo of subcampos.opcionales) {
        // Si el subcampo tiene un input dinámico, tomamos el valor actual
        const valorActual = subcampo.valor_actual ? subcampo.valor_actual: subcampo.valor_por_defecto;
        configuracion.configuracion[element].opcionales[subcampo.valor] = valorActual;
      }
    }
  }
  configuracion.nombre = nombreGrafica.value;
  configuracion.columna = props.columna;
  configuracion.fila = props.fila;
  configuracion.descripcion = "Desc";

  const panelId = panelStore.panel?.id

  peticionAPI(`/graficos/${panelId}/`, "POST", configuracion)
    .then((data) => {
      Swal.fire({
        title: "¡Guardado!",
        text: "La gráfica se guardó correctamente.",
        icon: "success",
        width: "300px",
        customClass: {
          popup: "popup-personalizado",
          title: "titulo-alerta-personalizado",
          confirmButton: "confirmacion-alerta-personalizado",
        },
        buttonsStyling: false,
      });
    })
    .catch((error) => console.error(error));


}

onMounted(() => {
  traerEstructuras();
  console.log(props.columna, props.fila, props.panel);
});
</script>

<style scoped>
.main__creargrafica {
  background-color: #f0f0f0;
  height: 70vh;
  display: flex;
  justify-content: space-between;
}
.textfield__control {
  margin: 10px 0;
}
.campos__configuracion {
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  box-shadow: inset 0px 5px 15px -3px rgba(0, 0, 0, 0.1);
}
.creargrafica__container {
  background-color: rgb(246, 246, 246);
  width: 68%;
  min-height: 20px;
}
.creargrafica__formulario {
  width: 30%;
  min-height: 20px;
}
.muestra__grafica{
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>