<template>
  <v-app>
    <header-app />
    <div class="main">
      <router-view></router-view>
    </div>
    <footer-app/>
  </v-app>
</template>
<script setup>
import FooterApp from './components/FooterApp.vue';
import HeaderApp from "./components/HeaderApp.vue";
import { useRoute } from 'vue-router';

const route = useRoute();

</script>
<style scoped>
.main {
  background-color: var(--fondo-principal);
  height: calc(100vh - 64px - 64px);
  overflow-y: auto;
  margin-top: 64px;
}
</style>
