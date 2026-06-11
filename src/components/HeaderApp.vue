<template>
  <div>
    <v-navigation-drawer
      class="floating-drawer"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
      color="light"
      v-if="verNavbar"
      expand-on-hover
      rail
      :rail-width="64"
      :width="250"
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
            <div class="dawer__img-espacio">
              <img :src="imagenSrc" alt="Logo" />
            </div>
            <span class="dawer__titulo-espacio" v-show="isHovering">
              {{ tituloEspacio }}
            </span>
          </figure>
        </div>
        <div class=""
          v-for="(item, index) in dynamicMenuItems"
          :key="index"
        >

        <v-list-item
          link
          :to="item.direccion"
          :class="{ 'active-item': route.path.includes(item.direccion) }"
          v-if="item.generalUSers || roleUsuario.includes('ADMIN_OBSERVATORIOS')"
        >
          <div class="dawer__item" >
            <v-icon class="mr-2 dawer__icon">{{ item.icono }}</v-icon>
            <span class="dawer__texto-item" v-show="isHovering">
              {{ item.texto }}
            </span>
          </div>
        </v-list-item>
        </div>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import logoAdmin from "@/assets/img/logo-admin.png";
import logoDefault from "@/assets/img/logo.png";
import { useObservatorioStore } from "@/stores/observatorioStore";
import { useUserService } from "@/service/userService";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
const userService = useUserService();
const isHovering = ref(false);
const route = useRoute();
const observatorioStore = useObservatorioStore();
const roleUsuario = ref("");


const observatorioId = computed(() => {
  return (
    route.params.observatorio_id || observatorioStore.observatorio?.id || ""
  );
});

const rutasNavbar = ["/", "/espacios", "/procesos"];
const verNavbar = computed(() => !rutasNavbar.includes(route.path));

const imagenSrc = computed(() => {
  return route.path.includes("administracion/")
    ? logoAdmin
    : observatorioStore.observatorio?.imagen || logoDefault;
});

const tituloEspacio = computed(() => {
  return route.path.includes("administracion/")
    ? "Administración"
    : observatorioStore.observatorio?.nombre || "";
});

const menuItems = [
  {
    texto: "Inicio",
    icono: "mdi-home",
    direccion: "/procesos",
    admin: true,
    general: true,
    generalUSers: true,
  },
  {
    texto: "Observatorios",
    icono: "mdi-eye",
    direccion: "/administracion/observatorios",
    admin: true,
    general: false,
  },
  {
    texto: "Estructuras",
    icono: "mdi-graph-outline",
    direccion: "/estructuras",
    admin: false,
    general: true,
  },
  {
    texto: "Tablero",
    icono: "mdi-chart-box-outline",
    direccion: "/tablero",
    admin: false,
    general: true,
  },
  {
    texto: "Panel",
    icono: "mdi-view-dashboard",
    direccion: "/panel",
    admin: false,
    general: true,
    generalUSers: true,
  },
];

watch(verNavbar, (newValue) => {
  if (newValue === true) {
    roleUsuario.value = userStore.user.role;

    const base64Data = localStorage.getItem('menu');
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
  }
});

const dynamicMenuItems = computed(() => {
  const esAdmin = route.path.includes("administracion/");

  const itemsFiltrados = menuItems.filter(item => esAdmin ? item.admin : item.general);

  return itemsFiltrados.map((item) => {
    const rutasConParametro = ["/estructuras", "/tablero", "/panel"];
    if (observatorioId.value && rutasConParametro.includes(item.direccion)) {
      return {
        ...item,
        direccion: `/${observatorioId.value}${item.direccion}`,
      };
    }
    return item;
  });
});
onMounted(() => {
  roleUsuario.value = userStore.user?.role;
})
</script>

<style scoped>
.floating-drawer {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 0;
  box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.2);
  transition: width 0.3s ease-in-out;
  background-color: brown;
}
.fixed-app-bar {
  position: fixed;
  width: 100%;
  left: 0;
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
  height: 85px;
  display: flex;
  align-items: center;
  width: 90%;
  border-bottom: 2px solid rgb(189, 189, 189);
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
  color: var(--texto-medio-color);
}
.dawer__img-espacio {
  min-width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dawer__logo-espacio img {
  height: 45px;
  width: 45px;
}
.dawer__logo-espacio {
  width: 90%;
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
  padding-left: -5px;
}

.floating-drawer.v-navigation-drawer--rail {
  width: 64px !important;
}
</style>
