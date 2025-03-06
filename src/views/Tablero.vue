<template>
  <v-container class="tablero">
    <div class="cabecera">
      <h1 class="titulo__cabecera">Tablero</h1>
    </div>
    <div class="control__container">
      <div class="textfield__contenedor">
        <v-select
          v-model="estructuraSeleccionada"
          :items="estructuras"
          label="Estructura"
          variant="outlined"
          density="compact"
          hide-details
          width="35px"
          class="textfield__control mr-10"
          @update:modelValue="traerDatos"
        >
          <template v-slot:item="{ props, item }">
            <div class="select__estructura" v-bind="props">
              {{ item.raw.nombre }}
            </div>
          </template>
          <template v-slot:selection="{ item }">
            {{ item.raw.nombre }}
          </template>
        </v-select>
        <v-text-field
          v-model="busqueda"
          label="Buscar"
          variant="outlined"
          @click:append-inner="filtrarDatos"
          density="compact"
          hide-details
          class="textfield__control"
        ></v-text-field>
      </div>
      <v-spacer />
      <div class="contenedor_botones">
        <!-- <v-btn class="boton__control" color="primary" @click="filtrarDatos">
          <v-icon left>mdi-magnify</v-icon> Buscar
        </v-btn> -->
        <!-- <v-btn class="boton__controv -->
      </div>
    </div>

    <v-card>
      <div class="cabecera__tabla">
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h5">{{ estructuraSeleccionada?.nombre }}</span>
        </v-card-title>
        <v-spacer></v-spacer>
        <!-- <v-file-input
          density="compact"
          hide-details
          variant="outlined"
          label="Cargar Archivo"
          class="mr-2"
          style="width: 50px"
        >
        </v-file-input> -->
        <v-btn color="primary" variant="outlined" class="mr-2" v-if="estructuraSeleccionada">
          <v-icon left>mdi-paperclip</v-icon> Cargar Archivo
        </v-btn>
        <v-btn color="primary" v-if="estructuraSeleccionada">
          <v-icon left>mdi-plus</v-icon> Agregar Registro
        </v-btn>
      </div>
      <v-data-table
      v-if="headers.length > 0"
        :headers="headers"
        :items="datosFiltrados"
        class="elevation-1"
        :items-per-page="5"
      ></v-data-table>
      <v-alert v-else color="primary" variant="tonal" class="ma-4">
        No se ha seleccionado ningúna estructura
      </v-alert>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import peticionAPI from "@/service/conexion_api";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

const headerst = ref([
  { title: "Nombre", key: "nombre", align: "center" },
  { title: "Estado", key: "activo", align: "center" },
  { title: "Acciones", key: "acciones", sortable: false, align: "center" },
]);

const estructuras = ref([]);
const estructuraSeleccionada = ref(null);
const busqueda = ref('');
const datos = ref([]);
const headers = ref([]);

const traerDatos = async (nuevoValor) => {
  if (!nuevoValor?.id) return;
  
  const estructura = estructuras.value.find(e => e.id === nuevoValor.id);
  if (!estructura) return;
  
  headers.value = estructura.mapeo.map(item => ({
    title: item.nombre,
    key: item.nombre,
    value: item.nombre,
    align: 'center',
    sortable: true
  }));
  
  console.log('Headers:', headers.value);
  console.log('-------');
  
  console.log(headers.value);
  console.log('-------');
  try {
    const response = await peticionAPI(`datos/${nuevoValor.id}`, "GET");
    datos.value = response.results;
    console.log('mapeo', estructura.mapeo);
    
     // Forzar actualización reactiva
    await nextTick();
      
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
};

const datosFiltrados = computed(() => {
  return datos.value.filter(row =>
    Object.values(row).some(val =>
      val.toString().toLowerCase().includes(busqueda.value.toLowerCase())
    )
  );
});

const filtrarDatos = () => {
  console.log('Filtrando datos con búsqued:', busqueda.value);
};

const traerEstructuras = () => {
  peticionAPI("campos/estructuras/", "GET")
  .then((data) => {
    console.log(data);
    
    estructuras.value = data;
    console.log(estructuras.value);
  })
  .catch((error) => console.error(error));
};
// const traerDatos = (nuevoValor) => {
//   console.log('mapeo', nuevoValor.mapeo);
  
//   // console.log("Se seleccionó:", nuevoValor.id);
//   peticionAPI(`datos/${nuevoValor.id}`, "GET")
//     .then((data) => {
//       console.log(data);

//       estructuras.value = data;
//       console.log(estructuras.value);
//     })
//     .catch((error) => console.error(error));
// };

onMounted(async () => {
  traerEstructuras();
});
</script>

<style scoped>
.tablero {
  width: 90%;
  margin: 40px auto;
}
.control__container {
  margin: 20px 0;
  display: flex;
  align-items: center;
}
.textfield__contenedor {
  display: flex;
  width: 80%;
}
.contenedor_botones {
  display: flex;
  justify-content: space-between;
}
.textfield__control {
}
.boton__control {
  margin-left: 15px;
}
.select__estructura {
  padding: 5px;
  cursor: pointer;
}
.select__estructura:hover {
  background-color: var(--color-claro);
}
</style>
