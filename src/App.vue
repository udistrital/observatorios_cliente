<template>
  <v-app>
    <ng-uui-oas ref="oas"></ng-uui-oas>
    <ng-uui-notioas ref="notioas"></ng-uui-notioas>
    <header-app />
    <div class="main">
      <router-view></router-view>
    </div>
    <!-- <footer-app /> -->
  </v-app>
</template>
<script setup>
import FooterApp from "./components/FooterApp.vue";
import HeaderApp from "./components/HeaderApp.vue";
import { useRoute } from "vue-router";
import { ref, computed, onMounted } from "vue";
import { environment } from './eviroments'
const route = useRoute();
const oas = ref(null)
const notioas = ref(null)
onMounted(() => {
  if(oas.value) {
    // Asigna la propiedad environment al web component
    oas.value.environment = environment
  }
  
  // Si necesitas hacer algo con notioas, lo puedes hacer igual:
  // if(notioas.value) {
  //   notioas.value.algunaPropiedad = 'valor'
  // }
})
</script>
<style scoped>
.main {
  background-color: var(--fondo-principal);
  height: calc(100vh - 64px - 64px);
  overflow-y: auto;
  margin-top: 64px;
}
</style>
