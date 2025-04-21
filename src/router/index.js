import { createRouter, createWebHistory } from "vue-router";
import { useObservatorioStore } from '@/stores/observatorioStore';

const routes = [
  {
    path: "/espacios",
    name: "espacios",
    component: () => import("../views/Espacios.vue"),
  },
  {
    path: "/administracion",
    component: () => import("../views/Administracion.vue"),
    children: [
      {path: "observatorios", component: () => import("../components/administracion/Observatorios.vue")},
      {path: "observatorios-externos", component: () => import("../components/administracion/ObservatoriosExternos.vue")},
    ],
  },
  {
    path: "/:observatorio_id/estructuras",
    name: "estructuras",
    component: () => import("../views/Estructuras.vue"),
  },
  {
    path: "/:observatorio_id/tablero",
    name: "tablero",
    component: () => import("../views/Tablero.vue"),
  },
  {
    path: "/:observatorio_id/panel",
    name: "panel",
    component: () => import("../views/Panel.vue"),
    // children: [
    //   {path: "graficas", component: () => import("../components/panel/Graficas.vue")},
    // ]
  },
  {
    path: "/panel/graficas/:panel/:columna/:fila",
    name: "panelGraficas",
    props: true,
    component: () => import("../components/panel/Graficas.vue"),
    // children: [
    //   {path: "graficas", component: () => import("../components/panel/Graficas.vue")},
    // ]
  },
  {
    path: "/panel/principal",
    name: "panelPrincipal",
    component: () => import("../components/panel/PanelVistaPrincipal.vue"),
    
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/espacios",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const observatorioStore = useObservatorioStore();
  const { observatorio_id } = to.params;
  
  if (observatorio_id) {
    const storedData = localStorage.getItem("observatorios_espacios");
    if (storedData) {
      let observatorios = [];
      try {
        observatorios = JSON.parse(storedData);
      } catch (error) {
        console.error("Error al parsear observatorios del localStorage:", error);
      }
      const matchedObservatorio = observatorios.find(
        (item) => item.observatorio_id === observatorio_id
      );
      if (matchedObservatorio) {
        observatorioStore.setObservatorio(matchedObservatorio);
      } else {
        observatorioStore.setObservatorio({ id: observatorio_id });
      }
    } else {
      observatorioStore.setObservatorio({ id: observatorio_id });
    }
  }
  
  next();
});

export default router;
