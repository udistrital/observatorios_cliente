# Navegación y módulos AS-IS

## Inventario completo de rutas

Fuente: `src/router/index.js: routes`, commit `8537cb7`.

| # | Ruta | Nombre/comportamiento | Vista o componente | Estado |
|---:|---|---|---|---|
| 1 | `/` | `root` | `views/Home.vue` | Login/entrada |
| 2 | `/procesos` | `procesos` | `views/Espacios.vue` | Canónica |
| 3 | `/espacios` | redirección | `/procesos` | Compatibilidad |
| 4 | `/procesos/:proceso_id/factores` | `procesoFactores` | `ProcesoFactores.vue` | Canónica |
| 5 | `/proceso/:proceso_id/factores` | redirección | ruta 4 | Compatibilidad |
| 6 | `/administracion` | contenedor sin hijo por defecto | `Administracion.vue` | Administrativa |
| 7 | `/administracion/observatorios` | hija sin nombre | `administracion/Observatorios.vue` | Administrativa |
| 8 | `/administracion/factores` | hija sin nombre | `administracion/Factores.vue` | Administrativa |
| 9 | `/procesos/:proceso_id/factores/:factor_id/estructuras/gestion` | `factorEstructurasGestion` | `views/Estructuras.vue` | Canónica |
| 10 | `/procesos/:proceso_id/factores/:factor_id/estructuras` | `factorEstructuras` | `EstructurasVista.vue` | Canónica |
| 11 | `/procesos/:proceso_id/factores/:factor_id/tablero` | `factorTablero` | `views/Tablero.vue` | Canónica; usa `estructura_id` query |
| 12 | `/procesos/:proceso_id/factores/:factor_id/panel` | `factorPanelGestion` | `views/Panel.vue` | Canónica |
| 13 | `.../panel/graficas/:panel/:columna/:fila` | `factorPanelGraficas` | `panel/Graficas.vue` | Canónica |
| 14 | `.../panel/principal` | `factorPanelPrincipal` | `PanelVistaPrincipal.vue` | Canónica |
| 15 | `.../caracteristicas/principal` | `factorCaracteristicaPrincipal` | `CaracteristicaPrincipal.vue` | Canónica |
| 16 | `.../panel/vista` | `factorPanelVista` | `PanelVista.vue` | Canónica |
| 17 | `.../archivos` | `factorArchivosGestion` | `archivos/ArchivosGestion.vue` | Legada |
| 18 | `/factor/:factor_id` | `estructuras` | `views/Estructuras.vue` | Legada |
| 19 | `/estructuras/:factor_id` | `estructurasVista` | `EstructurasVista.vue` | Legada |
| 20 | `/tablero/:factor_id` | `tablero` | `views/Tablero.vue` | Legada |
| 21 | `/:factor_id/panel` | `panel` | `views/Panel.vue` | Legada |
| 22 | `/:factor_id/panel/graficas/:panel/:columna/:fila` | `panelGraficas` | `panel/Graficas.vue` | Legada |
| 23 | `/:factor_id/panel/principal` | `panelPrincipal` | `PanelVistaPrincipal.vue` | Legada |
| 24 | `/:factor_id/caracteristica` | `caracteristicaPrincipal` | `CaracteristicaPrincipal.vue` | Legada |
| 25 | `/panelVista/:factor_id` | `panelVista` | `PanelVista.vue` | Legada |
| 26 | `/:factor_id/archivos` | `archivosGestion` | `archivos/ArchivosGestion.vue` | Legada |
| 27 | `/documentos/:hash` | `documentoVisor` | `views/DocumentoVisor.vue` | Activa |
| 28 | `/:pathMatch(.*)*` | redirección | `/procesos` | Fallback |

## Guarda y roles

- `/` es la única ruta que no exige token.
- Token ausente redirige a `/` con `redirect` interno.
- Usuario no hidratado después de la espera también vuelve a `/`.
- La lista `rutasPermitidas` admite consulta y varias rutas de gestión a no
  administradores.
- Cualquier path que incluya `/panel` pasa la comprobación adicional.
- [VERIFICADO] `factorPanelGraficas` permite alcanzar UI que ejecuta POST/PUT de
  gráficos sin una segunda comprobación de rol.
- [NO VERIFICADO] El servidor rechaza o permite esas escrituras.

## Mapa funcional

| Acción | Entrada | Componentes principales | Estado UI observado |
|---|---|---|---|
| Listar/gestionar procesos | `/procesos` | `Espacios.vue`, formularios de procesos | Búsqueda, carga, vacío, SweetAlert |
| Abrir factores | ruta 4 | `ProcesoFactores.vue`, `Factor*` | Carga y tarjetas |
| Gestionar jerarquía | ruta 9 | `Estructuras.vue`, `AspectosSection.vue`, componentes por dominio | Árbol expandible, diálogos CUD |
| Capturar tabla/documentos | ruta 11 | `Tablero.vue` | Tabla, paginación, formulario, carga/error/vacío |
| Consultar documento | ruta 27 | `DocumentoVisor.vue` | Carga, error con reintento, visor por formato |
| Gestionar panel | rutas 12-16 | `components/panel/` | Configuración y visualización de gráficas |
| Gestión documental anterior | rutas 17 y 26 | `components/archivos/` | [VERIFICADO] contrato MID legado |

## Inconsistencias

- Entrar exactamente a `/administracion` deja el `router-view` hijo vacío.
- Las rutas hijas de administración no tienen nombre, por lo que la lista de
  permitidas no las incluye para usuarios no administradores.
- Accesos directos a panel pueden carecer de observatorio no persistido.
- [PROPUESTA] Cualquier retiro de rutas legadas requiere una spec TO-BE y evidencia
  de consumidores; este documento no autoriza eliminarlas.
