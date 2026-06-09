import { createRouter, createWebHashHistory } from "vue-router";
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
    path: "/espacios",
    name: "espacios",
    component: () => import("../views/Espacios.vue"),
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
    redirect: "/espacios",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
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
    "espacios",
    "root",
    "caracteristicaPrincipal",
    "panelVista",
    "tablero",
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
      return next({ name: "espacios" });
    }
  }

  const esAdmin = roleUsuario.includes("ADMIN_OBSERVATORIOS");

  if (!esAdmin && !rutasPermitidas.includes(to.name) && !esRutaPanel) {
    return next({ name: "espacios" });
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
