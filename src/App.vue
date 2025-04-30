<template>
  <v-app>
    <ng-uui-oas ref="oas"></ng-uui-oas>
    <ng-uui-notioas ref="notioas"></ng-uui-notioas>
    <!-- <header-app /> -->
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
import { ref, onMounted, nextTick } from "vue";
import { environment } from './eviroments';
// import { useUserService } from '@/services/userService'; // Ajusta la ruta si es necesario

const route = useRoute();
const oas = ref(null);
const notioas = ref(null);
// const userService = useUserService();

onMounted(() => {
  nextTick(() => {
    // Asigna environment
    if (oas.value) {
      oas.value.environment = environment;

      // Listener local en el componente
      oas.value.addEventListener('menu', (event) => {
        const customEvent = event;
        const menu = customEvent.detail;

        console.log('🔥 Listener LOCAL → Evento menu recibido:', customEvent);
        console.log('🧾 LOCAL → Detalle del menu:', menu);

        if (Array.isArray(menu)) {
          // userService.updatePermisos(menu);
        } else {
          console.warn('❌ LOCAL → El "menu" recibido no es un array:', typeof menu, menu);
        }
      });
    }

    // Listener GLOBAL para verificar propagación
    window.addEventListener('menu', (event) => {
      const menu = (event).detail;
      console.log('🌍 Listener GLOBAL → Evento menu capturado:', menu);
    });

    // Simulación manual del evento (solo para pruebas)
    setTimeout(() => {
      console.log('🚀 Disparando evento simulado...');
      oas.value?.dispatchEvent(new CustomEvent('menu', {
        detail: ['permiso1', 'permiso2'],
        bubbles: true,
        composed: true
      }));
    }, 2000); // lo dispara 2 segundos después del montaje
  });
});
</script>

<style scoped>
.main {
  background-color: var(--fondo-principal);
  height: calc(100vh - 64px - 64px);
  overflow-y: auto;
  margin-top: 64px;
}
</style>
