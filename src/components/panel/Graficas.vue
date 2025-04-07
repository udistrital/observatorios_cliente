<template>
  <div class="vista__primaria">
    <div class="main__graficas">
      <div class="cabecera">
        <h1 class="titulo__cabecera">{{panelStore?.panel.nombre}}</h1>
        <v-spacer />
        <v-btn color="primary" prepend-icon="mdi-plus" @click="agregarGrafica"
          >Añadir Grafica</v-btn
        >
      </div>
      <div class="cuerpo">
        <CrearGraficas/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePanelStore } from '@/stores/panelStore';
import CrearGraficas from './graficas/CrearGraficas.vue';

const panelStore = usePanelStore();

const agregarGrafica = () => {

}
</script>

<style scoped>
.main__graficas {
  width: 95%;
  margin: 40px auto;
}
</style>