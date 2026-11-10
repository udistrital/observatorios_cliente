# Inventario de evidencias AS-IS

## Identidad

| Campo | Valor |
|---|---|
| Repositorio | `observatorios_cliente` |
| Rama | `develop` |
| Commit | `8537cb7104042cb1bd7874bb0d3cf8baa991d45e` |
| Fecha de inspección | 2026-11-10 |
| Método | Revisión estática; sin navegador ni solicitudes a servicios |

Convenciones: `[VERIFICADO]`, `[INFERIDO]`, `[NO VERIFICADO]`, `[PROPUESTA]` y
`[NO APLICA]`.

## Cobertura

- [VERIFICADO] 28 registros de ruta Vue Router: 26 superiores y 2 hijas.
- [VERIFICADO] 60 patrones `método + ruta` invocados y 4 declarados en servicios
  sin consumidor directo identificado.
- [VERIFICADO] 8 instancias Axios, 6 interceptores de solicitud duplicados, 42
  sitios `peticionAPI(...)`, 57 invocaciones de servicios de dominio, 4 sitios del
  Gestor Documental y 3 llamadas `fetch`.
- [VERIFICADO] Un archivo de pruebas, con 5 casos del visor documental.
- [NO VERIFICADO] Respuesta efectiva de CRUD, Gestor Documental, OAS y MID en un
  navegador o ambiente desplegado.

## Módulos

| ID | Funcionalidad | Pantallas/componentes | Estado y servicios | Evidencia |
|---|---|---|---|---|
| CLI-MOD-001 | Autenticación, sesión y roles | `App.vue`, guarda global | Token OAS; rol `ADMIN_OBSERVATORIOS` | `src/router/index.js`; `src/utils/roles.js`; `src/stores/userStore.js` |
| CLI-MOD-002 | Procesos y factores | `Espacios.vue`, `ProcesoFactores.vue` | CRUD mediante servicios dedicados | `src/service/procesos.service.js`; `factores.service.js` |
| CLI-MOD-003 | Características, aspectos y estructuras | `Estructuras.vue`, `AspectosSection.vue`, `components/estructuras/` | Jerarquía vigente; CUD visible para administrador | servicios de características, aspectos y estructuras |
| CLI-MOD-004 | Datos tabulares | `views/Tablero.vue`, `components/tablero/Tablero.vue` | `/campos/estructuras` y `/campos/datos` | `src/service/campos.service.js` |
| CLI-MOD-005 | Evidencia documental | `Tablero.vue`, `DocumentoVisor.vue` | Gestor para binario; CRUD para metadatos/hash | `gestorDocumentalService.js`; `documentViewer.js` |
| CLI-MOD-006 | Paneles y gráficas | `components/panel/` | Dashboards, gráficos y constructor | llamadas `peticionAPI` en componentes |
| CLI-MOD-007 | Observatorios | `components/administracion/observatorios/` | CRUD de observatorios | llamadas `peticionAPI` |
| CLI-MOD-008 | Archivos legados | `components/archivos/` | MID con URL base vacía y rutas `datosArchivo` | componentes de archivos | [VERIFICADO] legado |

## Integraciones detectadas

| Destino | Patrones principales | Configuración | Estado |
|---|---|---|---|
| `observatorios_crud` | Procesos, factores, características, aspectos, estructuras, campos/datos, observatorios, dashboards, gráficos y constructor | `MAIN_BACKEND` | [VERIFICADO] consumo activo |
| Gestor Documental | `POST document/uploadAnyFormat`, `GET/DELETE document/{hash}` | `GESTOR_DOCUMENTAL`, `ID_TIPO_DOCUMENTO_GESTOR_DOCUMENTAL` | [VERIFICADO] consumo activo; contrato servidor [NO VERIFICADO] |
| `observatorios_mid` | `POST/PUT /documento` | variable local vacía en componentes legados | [VERIFICADO] código legado; [INFERIDO] no operativo |
| OAS/configuración/assets | Web component y servicios auxiliares | `TOKEN`, `CONFIGURACION_SERVICE`, `ASSETS_SERVICE` | [VERIFICADO] declarado; contratos externos [NO VERIFICADO] |

El detalle pantalla-servicio-ruta está en
[`../frontend/servicios-y-estado.md`](../frontend/servicios-y-estado.md) y la matriz
canónica en [`matriz_interacciones.md`](matriz_interacciones.md).

## Estado y pruebas

| Artefacto | Hallazgo |
|---|---|
| Stores | 7 stores identificados; `panelStore` y `graficaStore` persisten, los demás no. |
| Formularios | 16 usos de `v-form`; 5 llamadas explícitas a `.validate()` detectadas. |
| Pruebas | `src/utils/documentViewer.spec.js`: 5 casos de formato/base64/firmas/Excel. |
| i18n | [VERIFICADO] no existe infraestructura; textos codificados en español. |
| Accesibilidad | [VERIFICADO] existen algunos estados semánticos; hay brechas de teclado, nombre accesible y `lang`. |
| CI | [VERIFICADO] Drone no ejecuta tests ni lint; no existe script `lint`. |

## Hallazgos críticos

| ID | Hallazgo | Evidencia |
|---|---|---|
| CLI-EV-001 | Rutas de panel y gráfica quedan permitidas a no administradores; el backend no fue verificado como barrera. | `src/router/index.js:245-270`; `CrearGraficas.vue` |
| CLI-EV-002 | El tablero puede intentar un PATCH documental automático sin comprobación de rol. | `src/components/tablero/Tablero.vue:2065-2082,2830-2833` |
| CLI-EV-003 | La guarda/Gestor leen `sessionStorage`, pero los clientes CRUD solo `localStorage`. | router y servicios Axios |
| CLI-EV-004 | Si la carga del Gestor termina y falla el POST al CRUD puede quedar un binario huérfano. | `Tablero.vue: flujo de creación documental` |
| CLI-EV-005 | La limpieza masiva elimina metadatos, no binarios uno por uno. | `Tablero.vue: limpiar estructura` |
| CLI-EV-006 | Se pasan valores no confiables a `Swal.fire({html})` en varios componentes. | rutas listadas en `brechas-y-riesgos.md` |

## Pendientes

- [NO VERIFICADO] Autorización real del servidor para acciones que la UI oculta.
- [NO VERIFICADO] CORS, formato y estados del Gestor Documental.
- [NO VERIFICADO] Navegación por teclado, lectores de pantalla y contraste.
- [NO VERIFICADO] Build y tests en Node compatible durante esta inspección.
