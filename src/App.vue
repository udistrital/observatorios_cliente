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
import HeaderApp from "./components/HeaderApp.vue";
import { ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { environment } from './eviroments';
import { useUserService } from '@/service/userService';
// import { useNotificaciones } from '@/services/notificaciones'; // Si quieres usarlo después

const oas = ref(null);
const notioas = ref(null);
const route = useRoute();
const router = useRouter();
const userService = useUserService();
// const notificacionesService = useNotificaciones(); // si se necesita luego
const loadRouting = ref(false);

// Esperar a que oas esté listo realmente
watchEffect(() => {
  if (oas.value) {
    console.log('✅ <ng-uui-oas> disponible:', oas.value);

    oas.value.environment = environment;
    console.log('🌍 Environment asignado a oas:', environment);

    // 🎯 Escuchar evento MENU (objetivo principal)

    const base64Data = localStorage.getItem('menu');
    const jsonString = atob(base64Data);
    const jsonObject = JSON.parse(jsonString);
    console.log(jsonObject);


    oas.value.addEventListener('menu', (event) => {
      const menu = event.detail;
      console.log('📋 Evento [menu] recibido con:', menu);

      if (Array.isArray(menu)) {
        userService.updatePermisos(menu);
        console.log('✅ Permisos actualizados:', menu);
      } else {
        console.warn('❌ "menu" no es un array:', typeof menu, menu);
      }
    });

    // Opcionales si decides usarlos
    oas.value.addEventListener('user', (event) => {
      const detail = event.detail;
      console.log('👤 Evento [user] recibido:', detail);
      if (detail) {
        loadRouting.value = true;
        userService.updateUser(detail);
      }
    });

    oas.value.addEventListener('option', (event) => {
      const detail = event.detail;
      console.log('📁 Evento [option] recibido:', detail);
      if (detail?.Url) {
        router.push(detail.Url);
        console.log('🚀 Navegación a:', detail.Url);
      }
    });

    oas.value.addEventListener('logout', (event) => {
      console.log('🚪 Evento [logout] recibido:', event.detail);
    });
  } else {
    console.warn('❗ Esperando a que <ng-uui-oas> esté disponible...');
  }
});

// Si quieres escuchar notioas más adelante, puedes copiar esta misma lógica con watchEffect también
</script>
<style scoped>
.main {
  background-color: var(--fondo-principal);
  height: calc(100vh - 80px - 85px);
  overflow-y: auto;
  margin-top: 90px;
}
</style>
