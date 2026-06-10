<template>
  <v-app>
    <ng-uui-oas ref="oas"></ng-uui-oas>
    <ng-uui-notioas ref="notioas"></ng-uui-notioas>
    <header-app />
    <div class="main">
      <router-view></router-view>
    </div>
  </v-app>
</template>

<script setup>
import HeaderApp from "./components/HeaderApp.vue";
import { ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { environment } from "@/environments/environment";
import { useUserService } from "@/service/userService";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
const oas = ref(null);
const notioas = ref(null);
const route = useRoute();
const router = useRouter();
const userService = useUserService();
const loadRouting = ref(false);

const obtenerRolesUsuario = (detail) => {
  const posiblesRoles = [
    detail?.user?.role,
    detail?.user?.roles,
    detail?.userService?.role,
    detail?.userService?.roles,
    detail?.userService?.Roles,
    detail?.userService?.Rol,
    detail?.userService?.rol,
  ];

  const roles = posiblesRoles.find((item) => Array.isArray(item) || typeof item === "string");

  if (Array.isArray(roles)) {
    return roles;
  }

  if (typeof roles === "string" && roles.trim()) {
    return [roles];
  }

  return [];
};

const normalizarUsuario = (detail) => ({
  ...(detail?.user || {}),
  role: obtenerRolesUsuario(detail),
  userService: detail?.userService,
});

watchEffect(() => {
  if (oas.value) {
    oas.value.environment = environment;

    const handleUser = (event) => {
      const detail = event.detail;
      userStore.setUser(normalizarUsuario(detail));
      if (detail) {
        loadRouting.value = true;
        userService.updateUser(detail);
      }
    };

    oas.value.addEventListener("user", handleUser);

    setTimeout(() => {
      const currentUser = oas.value?.user;
      if (currentUser) {
        handleUser({ detail: currentUser });
      } else {
      }
    }, 300);

    oas.value.addEventListener("option", (event) => {
      const detail = event.detail;
      if (detail?.Url) {
        router.push(detail.Url);
      }
    });
    const handleMenu = (event) => {
      const detail = event.detail;

      if (Array.isArray(detail)) {
        userService.updatePermisos(detail);
      } else {
      }
    };

    oas.value.addEventListener("menu", handleMenu);

    const base64Data = localStorage.getItem("menu");
    if (base64Data) {
      try {
        const jsonString = atob(base64Data);
        const jsonObject = JSON.parse(jsonString);

        if (Array.isArray(jsonObject)) {
          userService.updatePermisos(jsonObject);
        } else {
        }
      } catch (e) {
      }
    }

    oas.value.addEventListener("logout", (event) => {
    });
  } else {
  }
});

</script>
<style scoped>
.main {
  background-color: var(--fondo-principal);
  height: calc(100vh - 80px - 85px);
  overflow-y: auto;
  margin-top: 90px;
}
</style>
