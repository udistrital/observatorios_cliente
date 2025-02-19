import { createRouter, createWebHistory } from "vue-router";
// import HomeView from '../views/HomeView.vue'

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
