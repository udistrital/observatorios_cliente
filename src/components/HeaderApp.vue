<template>
  <div>
    <v-navigation-drawer
      class="floating-drawer"
      permanent
      temporary
      :width="isHovering ? 200 : 64"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
      color="light"
      v-if="verNavbar"
    >
      <v-list>
        <div
          :class="[
            'dawer__espacio',
            isHovering
              ? 'dawer__espacio-hovering'
              : 'dawer__espacio-unhovering',
          ]"
        >
          <figure class="dawer__logo-espacio">
            <img src="../assets/img/logo-admin.png" alt="Logo" />
            <span class="dawer__titulo-espacio" v-show="isHovering"
              >Administración</span
            >
          </figure>
        </div>
        <v-list-item
          v-for="(item, index) in menuItems"
          :key="index"
          link
          :to="item.direccion"
          :class="{ 'active-item': route.path === item.direccion }"
        >
          <div class="dawer__item">
            <v-icon class="mr-2 dawer__icon">{{ item.icono }}</v-icon>
            <span class="dawer__texto-item" v-show="isHovering">{{
              item.texto
            }}</span>
          </div>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar color="white" dense fixed class="fixed-app-bar">
      <v-spacer />
      <div class="header__logo">
        <figure class="header__logo-image">
          <img src="../assets/img/logo.png" alt="Logo" />
        </figure>
        <div class="header__logo-text">
          <h1 class="header__logo-title">OBSERVATORIOS</h1>
          <p class="header__logo-subtitle">
            Oficina Asesora de Tecnologías e Información
          </p>
        </div>
      </div>
      <v-spacer />
      <div class="header__info">
        <div class="header__info-bell">
          <v-btn
            class="ma-2"
            color="primary"
            icon="mdi-bell"
            variant="text"
          ></v-btn>
        </div>
        <div class="header__info-email">
          <v-icon color="primary" class="mdi mdi-account-circle"></v-icon>
          <span class="header__info-text">correo@correo.com</span>
        </div>
      </div>
    </v-app-bar>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
const isHovering = ref(false);
const menuItems = [
  { texto: "Inicio", icono: "mdi-home", direccion: "/espacios" },
  {
    texto: "Observatorios",
    icono: "mdi-eye",
    direccion: "/administracion/observatorios",
  },
  {
    texto: "Observatorios Externos",
    icono: " mdi-glasses",
    direccion: "/administracion/observatorios-externos",
  },
];

const rutasNavegacion = {};
const route = useRoute();
const rutasNavbar = ["/", "/espacios"];
const verNavbar = computed(() => !rutasNavbar.includes(route.path));
</script>

<style scoped>
.floating-drawer {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1300;
  box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.2);
  transition: width 0.3s ease-in-out;
  background-color: brown;
}
.fixed-app-bar {
  position: fixed;
  width: 100%;
  left: 0;
  z-index: 1200;
}
.header__logo-image img {
  height: 50px;
  object-fit: cover;
}
.header__logo {
  display: flex;
  align-items: center;
}
.header__logo-text {
  margin: 0 15px;
  width: 170px;
}
.header__logo-title {
  font-size: 16px;
  text-align: center;
  width: 100%;
}
.header__logo-subtitle {
  font-size: 12px;
  text-align: center;
  line-height: 1;
}
.header__info {
  display: flex;
  align-items: center;
  padding-right: 10px;
}
.header__info-text {
  color: var(--color-fuerte);
}
.dawer__espacio {
  height: 100%;
  height: 56px;
  display: flex;
}
.dawer__espacio-hovering {
  margin-left: 8px;
}
.dawer__espacio-unhovering {
  justify-content: center;
}
.dawer__titulo-espacio {
  font-size: 18px;
  font-weight: bolder;
  margin-left: 5px;
  color: var(--texto-medio-color);
}
.dawer__logo-espacio img {
  height: 45px;
  object-fit: cover;
}
.dawer__logo-espacio {
  border-bottom: 2px solid rgb(189, 189, 189);
  height: 56px;
  display: flex;
  align-items: center;
}
.dawer__icon {
  color: var(--color-acentuado);
}
.dawer__texto-item {
  color: var(--color-acentuado);
  font-weight: bold;
}
.dawer__item {
  display: flex;
  align-items: center;
}
.active-item {
  border-left: 5px var(--color-acentuado) solid;
}
</style>
