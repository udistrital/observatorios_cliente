import { createRouter, createWebHistory } from "vue-router";
import { useObservatorioStore } from "@/stores/observatorioStore";
import { useFactorStore } from "@/stores/factorStore";
import { factoresService } from "@/service/factores.service";
import { useUserStore } from "@/stores/userStore";

const routes = [
  {
    path: "/",
    name: "root",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/procesos",
    name: "procesos",
    component: () => import("../views/Espacios.vue"),
  },
  {
    path: "/espacios",
    redirect: "/procesos",
  },
  {
    path: "/procesos/:proceso_id/factores",
    name: "procesoFactores",
    component: () => import("../components/procesos/ProcesoFactores.vue"),
  },
  {
    path: "/proceso/:proceso_id/factores",
    redirect: (to) => `/procesos/${to.params.proceso_id}/factores`,
  },
  {
    path: "/administracion",
    component: () => import("../views/Administracion.vue"),
    children: [
      {
        path: "observatorios",
        component: () =>
          import("../components/administracion/Observatorios.vue"),
      },
      /*{
        path: "observatorios-externos",
        component: () =>
          import("../components/administracion/ObservatoriosExternos.vue"),
      },*/
      {
        path: "factores",
        component: () =>
          import("../components/administracion/Factores.vue"),
      },
    ],
  },
  {
    path: "/procesos/:proceso_id/factores/:factor_id/estructuras/gestion",
    name: "factorEstructurasGestion",
    component: () => import("../views/Estructuras.vue"),
  },
  {
    path: "/procesos/:proceso_id/factores/:factor_id/estructuras",
    name: "factorEstructuras",
    component: () => import("../components/estructuras/EstructurasVista.vue"),
  },
  {
    path: "/procesos/:proceso_id/factores/:factor_id/tablero",
    name: "factorTablero",
    component: () => import("../views/Tablero.vue"),
  },
  {
    path: "/procesos/:proceso_id/factores/:factor_id/panel",
    name: "factorPanelGestion",
    component: () => import("../views/Panel.vue"),
  },
  {
    path: "/procesos/:proceso_id/factores/:factor_id/panel/graficas/:panel/:columna/:fila",
    name: "factorPanelGraficas",
    props: true,
    component: () => import("../components/panel/Graficas.vue"),
  },
  {
    path: "/procesos/:proceso_id/factores/:factor_id/panel/principal",
    name: "factorPanelPrincipal",
    component: () => import("../components/panel/PanelVistaPrincipal.vue"),
  },
  {
    path: "/procesos/:proceso_id/factores/:factor_id/caracteristicas/principal",
    name: "factorCaracteristicaPrincipal",
    component: () => import("../components/panel/CaracteristicaPrincipal.vue"),
  },
  {
    path: "/procesos/:proceso_id/factores/:factor_id/panel/vista",
    name: "factorPanelVista",
    component: () => import("../components/panel/PanelVista.vue"),
  },
  {
    path: "/procesos/:proceso_id/factores/:factor_id/archivos",
    name: "factorArchivosGestion",
    component: () => import("../components/archivos/ArchivosGestion.vue"),
  },
  {
    path: "/factor/:factor_id",
    name: "estructuras",
    component: () => import("../views/Estructuras.vue"),
  },
  {
    path: "/estructuras/:factor_id",
    name: "estructurasVista",
    component: () => import("../components/estructuras/EstructurasVista.vue"),
  },
  {
    path: "/tablero/:factor_id",
    name: "tablero",
    component: () => import("../views/Tablero.vue"),
  },
  /*{
    path: "/tablero/:factor_id",
    name: "tableroVista",
    component: () => import("../components/tablero/TableroVista.vue"),
  },*/
  {
    path: "/:factor_id/panel",
    name: "panel",
    component: () => import("../views/Panel.vue"),
  },
  {
    path: "/:factor_id/panel/graficas/:panel/:columna/:fila",
    name: "panelGraficas",
    props: true,
    component: () => import("../components/panel/Graficas.vue"),
  },
  {
    path: "/:factor_id/panel/principal",
    name: "panelPrincipal",
    component: () => import("../components/panel/PanelVistaPrincipal.vue"),
  },
  {
    path: "/:factor_id/caracteristica",
    name: "caracteristicaPrincipal",
    component: () => import("../components/panel/CaracteristicaPrincipal.vue"),
  },
  {
    path: "/panelVista/:factor_id",
    name: "panelVista",
    component: () => import("../components/panel/PanelVista.vue"),
  },
  {
    path: "/:factor_id/archivos",
    name: "archivosGestion",
    component: () => import("../components/archivos/ArchivosGestion.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/procesos",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const factorStore = useFactorStore();
  const userStore = useUserStore();

  const { factor_id } = to.params;

  let intentos = 0;
  while (!userStore.user?.role && intentos < 10) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    intentos++;
  }

  const roleUsuario = userStore.user?.role || [];

  const rutasPermitidas = [
    "procesos",
    "root",
    "procesoFactores",
    "factorCaracteristicaPrincipal",
    "factorPanelVista",
    "factorTablero",
    "factorEstructurasGestion",
    "factorEstructuras",
    "factorPanelGestion",
    "factorPanelGraficas",
    "factorPanelPrincipal",
    "factorArchivosGestion",
    "caracteristicaPrincipal",
    "panelVista",
    "tablero",
    "estructuras",
    "estructurasVista",
  ];

  const esRutaPanel = to.path.includes("/panel");

  if (to.path === "/") {
    let intentosToken = 0;
    let accessToken = localStorage.getItem("access_token");

    while (!accessToken && intentosToken < 20) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      accessToken = localStorage.getItem("access_token");
      intentosToken++;
    }

    if (accessToken) {
      return next({ name: "procesos" });
    }
  }

  const esAdmin = roleUsuario.includes("ADMIN_OBSERVATORIOS");

  if (!esAdmin && !rutasPermitidas.includes(to.name) && !esRutaPanel) {
    return next({ name: "procesos" });
  }

  if (factor_id) {
    const factorActual = factorStore.factor;

    const yaTieneFactor =
      factorActual &&
      (factorActual.factor_id === factor_id || factorActual.id === factor_id);

    if (!yaTieneFactor) {
      try {
        const factor = await factoresService.obtener(factor_id);
        factorStore.setFactor(factor);
      } catch (error) {
        console.error("No fue posible cargar el factor desde el router:", error);

        factorStore.setFactor({
          id: factor_id,
          factor_id,
        });
      }
    }
  }

  next();
});

export default router;
