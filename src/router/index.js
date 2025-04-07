import { createRouter, createWebHistory } from "vue-router";

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
    path: "/estructuras",
    name: "estructuras",
    component: () => import("../views/Estructuras.vue"),
  },
  {
    path: "/tablero",
    name: "tablero",
    component: () => import("../views/Tablero.vue"),
  },
  {
    path: "/panel",
    name: "panel",
    component: () => import("../views/Panel.vue"),
    // children: [
    //   {path: "graficas", component: () => import("../components/panel/Graficas.vue")},
    // ]
  },
  {
    path: "/panel/graficas",
    name: "panelGraficas",
    component: () => import("../components/panel/Graficas.vue"),
    // children: [
    //   {path: "graficas", component: () => import("../components/panel/Graficas.vue")},
    // ]
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

export default router;
