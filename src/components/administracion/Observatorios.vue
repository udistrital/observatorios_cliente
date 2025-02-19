<template>
  <div class="observatorios">
    <div class="observatorios__cabecera">
      <h1 class="observatorios__titulo">Administración de Observatorios</h1>
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="crearObservario" >Crear Observatorio</v-btn>
    </div>
    <v-card>
      <div class="cabecera__tabla">
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h5">Observatorios</span>
        </v-card-title>
        <v-spacer />

        <v-text-field
          class="buscador__tabla"
          v-model="search"
          append-inner-icon="mdi-magnify"
          label="Buscar"
          variant="underlined"
        />
      </div>

      <v-data-table
        :headers="headers"
        :items="filteredObservatories"
        item-value="id"
        class="elevation-1"
      >
        <template v-slot:[`item.estado`]="{ item }">
          <v-chip :color="item.columns.estado === 'Activo' ? 'green' : 'red'" dark>
            {{ item.columns.estado }}
          </v-chip>
        </template>

        <template v-slot:[`item.acciones`]="{ item }">
          <v-btn variant="text"  icon size="small" @click="verObservatorio(item)" color="primary" title="Ver observatorio" >
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn variant="text" icon size="small" @click="editarObservatorio(item)" color="primary" title="Editar observatorio">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn variant="text" icon size="small" @click="eliminarObservatorio(item)" color="primary" title="Eliminar observatorio">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
          <v-btn variant="text" icon size="small" @click="eliminarObservatorio(item)" color="primary" title="Ir al observatorio">
            <v-icon>mdi-arrow-top-right-thick</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="dialog"
      scrollable  
      max-width="500px"
      transition="dialog-transition"
      
    >
      <crear-observatorio @cerrar="cerrarModal" />
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import CrearObservatorio from "./observatorios/CrearObservatorio.vue";
const search = ref("");
const observatorios = ref([
  { id: "OBS-1", nombre: "Observatorio 1", estado: "Activo" },
  { id: "OBS-2", nombre: "Observatorio 2", estado: "Inactivo" },
  { id: "OBS-3", nombre: "Observatorio 3", estado: "Activo" },
]);

const headers = ref([
  { title: "ID", key: "id", aling: "center" },
  { title: "Nombre", key: "nombre", align: "center" },
  { title: "Estado", key: "estado", align: "center" },
  { title: "Acciones", key: "acciones", sortable: false, align: "center" },
]);

const filteredObservatories = computed(() => {
  if (!search.value) return observatorios.value;
  return observatorios.value.filter((obs) =>
    obs.nombre.toLowerCase().includes(search.value.toLowerCase())
  );
});

const dialog = ref(false)

const cerrarModal = () => {
  console.log('si entra');
  
  dialog.value = false
}

const crearObservario = () => {
  console.log("Crear observatorio");
  dialog.value = true
}

const verObservatorio = (item) => {
  console.log("Ver:", item);
};

const editarObservatorio = (item) => {
  console.log("Editar:", item);
};

const eliminarObservatorio = (item) => {
  console.log("Eliminar:", item);
};
</script>

<style scoped>
.observatorios {
  width: 90%;
  margin: 40px auto;
}
.v-card-title {
  background-color: #ffffff;
}
.observatorios__cabecera {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.observatorios__titulo {
  color: var(--color-acentuado);
  font-weight: 700;
  text-shadow: -1px -1px 2px rgba(0, 0, 0, 0.384);
}
.cabecera__tabla {
  display: flex;
  align-items: center;
  padding: 5px;
}
.buscador__tabla {
  max-width: 400px !important;
  padding-right: 20px;
}
</style>
