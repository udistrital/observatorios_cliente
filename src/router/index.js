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

// router.beforeEach((to, from, next) => {
//   const observatorioStore = useObservatorioStore();
//   const { observatorio_id } = to.params;
//   console.log("Observatorio ID:", observatorio_id);
  
//   if (observatorio_id) {
//     // Asigna o actualiza el observatorio en el store.
//     observatorioStore.setObservatorio({
//       observatorio_id: observatorio_id,
//       // Puedes agregar más propiedades si las recuperas del backend.
//     });
//   }
//   next();
// });

export default router;
