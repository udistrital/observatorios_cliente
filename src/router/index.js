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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
