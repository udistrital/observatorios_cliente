<template>
  <div class="vista__primaria">
    <div class="main__graficas">
      <div class="cabecera">
        <h1 class="titulo__cabecera">{{panelStore?.panel.nombre}}</h1>
        <v-spacer />
      </div>
      <div class="cuerpo">
        <CrearGraficas :columna="columna" :fila="fila" :dashboard="panelStore.panel.dashboard" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePanelStore } from '@/stores/panelStore';
import CrearGraficas from './graficas/CrearGraficas.vue';

import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const columna = ref(0);
const fila = ref(0);
const panel = ref("");

const route = useRoute();

onMounted(() => {
  columna.value = parseInt(route.params.columna) || 0;
  fila.value = parseInt(route.params.fila) || 0;
  panel.value = route.params.panel || "";
});

const panelStore = usePanelStore();

</script>

<style scoped>
.main__graficas {
  width: 95%;
  margin: 40px auto;
}
</style>