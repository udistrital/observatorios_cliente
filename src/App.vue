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
import { ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { environment } from "./eviroments";
import { useUserService } from "@/service/userService";
// import { useNotificaciones } from '@/services/notificaciones'; // Si quieres usarlo después
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
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
    console.log("✅ <ng-uui-oas> disponible:", oas.value);

    oas.value.environment = environment;
    console.log("🌍 Environment asignado a oas:");

    // 🎯 Evento: USER (mejora aplicada aquí)
    const handleUser = (event) => {
      const detail = event.detail;
      console.log("👤 Evento [user] recibido:");
      userStore.setUser(detail.user);
      if (detail) {
        loadRouting.value = true;
        userService.updateUser(detail);
      }
    };

    // Escuchar evento si se lanza
    oas.value.addEventListener("user", handleUser);

    // Intentar obtener usuario directamente si ya inició sesión
    setTimeout(() => {
      const currentUser = oas.value?.user;
      if (currentUser) {
        console.log("👤 Usuario disponible como propiedad:");
        handleUser({ detail: currentUser });
      } else {
        console.log("⏳ Usuario aún no disponible desde propiedad");
      }
    }, 300);

    // 🎯 Evento: OPTION
    oas.value.addEventListener("option", (event) => {
      const detail = event.detail;
      console.log("📁 Evento [option] recibido:");
      if (detail?.Url) {
        router.push(detail.Url);
        console.log("🚀 Navegación a:", detail.Url);
      }
    });
    // 🎯 Evento: MENU
    // oas.value.addEventListener("menu", (event) => {
    //   const menu = event.detail;
    //   console.log("📋 Evento [menu] recibido con:", menu);

    //   if (Array.isArray(menu)) {
    //     userService.updatePermisos(menu);
    //     console.log("✅ Permisos actualizados:", menu);
    //   } else {
    //     console.warn('❌ "menu" no es un array:', typeof menu, menu);
    //   }
    // });
    const handleMenu = (event) => {
      const detail = event.detail;
      console.log("📋 Evento [menu] recibido con:");

      if (Array.isArray(detail)) {
        userService.updatePermisos(detail);
        console.log("✅ Permisos actualizados:");
      } else {
        console.warn('❌ "menu" no es un array:', typeof detail, detail);
      }
    };

    // Escuchar evento si se lanza
    oas.value.addEventListener("menu", handleMenu);
    // 🔁 Obtener el menú desde localStorage si existe
    const base64Data = localStorage.getItem("menu");
    if (base64Data) {
      try {
        const jsonString = atob(base64Data);
        const jsonObject = JSON.parse(jsonString);
        console.log("📦 Menú desde localStorage:");

        if (Array.isArray(jsonObject)) {
          userService.updatePermisos(jsonObject);
          console.log("✅ Permisos actualizados desde localStorage");
        } else {
          console.warn("❌ Menú no es un array válido:", jsonObject);
        }
      } catch (e) {
        console.error("❌ Error decodificando menú:", e);
      }
    }

    // 🎯 Evento: LOGOUT
    oas.value.addEventListener("logout", (event) => {
      console.log("🚪 Evento [logout] recibido:", event.detail);
    });
  } else {
    console.warn("❗ Esperando a que <ng-uui-oas> esté disponible...");
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
