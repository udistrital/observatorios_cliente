<template>
  <div class="vista__primaria">
    <v-container fluid>
      <v-row class="equal-height-row">
        <!-- Square taking 30% of the space -->
        <v-col cols="12" md="3" class="square-container">
          <v-card class="square configuracion-contenedor" elevation="2">
            <v-card-text>
              <v-select
                v-model="selectedOperationX"
                :items="operationTypes"
                label="Eje x"
                class="operation-select mb-4"
                :loading="loading"
                item-title="nombre_espanol"
                item-value="nombre"
                return-object
              />
              <v-select
                v-model="selectedOperationY"
                :items="operationTypes"
                label="Eje y"
                class="operation-select"
                :loading="loading"
                item-title="nombre_espanol"
                item-value="nombre"
                return-object
              />
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Square taking 70% of the space -->
        <v-col cols="12" md="9" class="square-container">
          <v-card class="square grafico-contenedor" elevation="2">
            <PieComponent />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import peticionAPI  from '../service/conexion_api';
import PieComponent from './graficos/PieComponent.vue';

const operationTypes = ref([]);
const selectedOperation = ref(null);
const selectedOperationX = ref(null);
const selectedOperationY = ref(null);
const loading = ref(false);

const fetchOperationTypes = async () => {
  try {
    loading.value = true;
    const response = await peticionAPI('/constructor_graficos/tipo_operaciones/')
    .then((response) => {
        operationTypes.value = response['operaciones'];
    });
    
    
  } catch (error) {
    console.error('Error fetching operation types:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchOperationTypes();
});
</script>

<style scoped>
.vista__primaria {
  height: 100%;
  display: flex;
}

.equal-height-row {
  height: 100%;
}

.square-container {
  padding: 16px;
  height: 100%;
}

.square {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.configuracion-contenedor {
  background-color: var(--color-claro);
}

.grafico-contenedor {
  background-color: var(--color-acentuado);
}

.text-center {
  color: var(--color-primario);
  font-size: 24px;
  font-weight: bold;
}

.operation-select {
  color: var(--color-primario);
}

.operation-select :deep(.v-field__input),
.operation-select :deep(.v-field__append-inner),
.operation-select :deep(.v-select__selection-text) {
  color: var(--color-claro);
}

.operation-select :deep(.v-field) {
  color: var(--color-primario);
  border-color: var(--color-primario);
}
</style>