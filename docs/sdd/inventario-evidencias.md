# Inventario de evidencias AS-IS

## Identidad

| Campo | Valor |
|---|---|
| Repositorio | `observatorios_cliente` |
| Rama | `develop` |
| Base | `102cee4` + implementación local de `PROY-TOBE-009` |
| Fecha de inspección | 2026-11-12 |
| Método | Revisión estática, Vitest y build; sin navegador ni solicitudes a servicios |

Convenciones: `[VERIFICADO]`, `[INFERIDO]`, `[NO VERIFICADO]`, `[PROPUESTA]` y
`[NO APLICA]`.

## Cobertura

- [VERIFICADO] 28 registros de ruta Vue Router: 26 superiores y 2 hijas.
- [VERIFICADO] 62 patrones `método + ruta` invocados y 4 declarados en servicios
  sin consumidor directo identificado.
- [VERIFICADO] 8 instancias Axios, 6 interceptores de solicitud duplicados, 42
  sitios `peticionAPI(...)`, 57 invocaciones de servicios de dominio, 3 llamadas al
  Gestor Documental y 3 llamadas `fetch`.
- [VERIFICADO] Dos archivos de pruebas, con 10 casos de visor documental y enlaces.
- [NO VERIFICADO] Respuesta efectiva de CRUD, Gestor Documental, OAS y MID en un
  navegador o ambiente desplegado.

## Módulos

| ID | Funcionalidad | Pantallas/componentes | Estado y servicios | Evidencia |
|---|---|---|---|---|
| CLI-MOD-001 | Autenticación, sesión y roles | `App.vue`, guarda global | Token OAS; rol `ADMIN_OBSERVATORIOS` | `src/router/index.js`; `src/utils/roles.js`; `src/stores/userStore.js` |
| CLI-MOD-002 | Procesos y factores | `Espacios.vue`, `ProcesoFactores.vue` | CRUD mediante servicios dedicados | `src/service/procesos.service.js`; `factores.service.js` |
| CLI-MOD-003 | Características, aspectos y estructuras | `Estructuras.vue`, `AspectosSection.vue`, `components/estructuras/` | Jerarquía vigente; CUD visible para administrador | servicios de características, aspectos y estructuras |
| CLI-MOD-004 | Datos tabulares | `views/Tablero.vue`, `components/tablero/Tablero.vue` | `/campos/estructuras` y `/campos/datos` | `src/service/campos.service.js` |
| CLI-MOD-005 | Evidencia documental | `Tablero.vue`, `DocumentoVisor.vue` | Gestor para mutaciones; CRUD para metadatos/hash y visualización | `campos.service.js`; `gestorDocumentalService.js`; `documentViewer.js` |
| CLI-MOD-006 | Paneles y gráficas | `components/panel/` | Dashboards, gráficos y constructor | llamadas `peticionAPI` en componentes |
| CLI-MOD-007 | Observatorios | `components/administracion/observatorios/` | CRUD de observatorios | llamadas `peticionAPI` |
| CLI-MOD-008 | Archivos legados | `components/archivos/` | [VERIFICADO] contratos MID/Gestor anteriores, fuera del flujo activo | componentes de archivos |

## Integraciones detectadas

| Destino | Patrones principales | Configuración | Estado |
|---|---|---|---|
| `observatorios_crud` | Procesos, factores, características, aspectos, estructuras, campos/datos, observatorios, dashboards, gráficos y constructor | `MAIN_BACKEND` | [VERIFICADO] consumo activo |
| Gestor Documental | `POST document/uploadAnyFormat`, `DELETE document/{hash}` activos; `GET document/{hash}` legado | `GESTOR_DOCUMENTAL`, `ID_TIPO_DOCUMENTO_GESTOR_DOCUMENTAL` | [VERIFICADO] mutaciones directas; GET del visor activo es indirecto por CRUD |
| `observatorios_crud` documental | POST referencia y GET contenido en `/campos/documentos/*` | `MAIN_BACKEND` | [VERIFICADO] consumo activo; autenticación propia del CRUD ausente |
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
| Pruebas | `documentViewer.spec.js` y `enlaces.spec.js`: 10 casos unitarios. |
| i18n | [VERIFICADO] no existe infraestructura; textos codificados en español. |
| Accesibilidad | [VERIFICADO] existen algunos estados semánticos; hay brechas de teclado, nombre accesible y `lang`. |
| CI | [VERIFICADO] Drone no ejecuta tests ni lint; no existe script `lint`. |

## Hallazgos críticos

| ID | Hallazgo | Evidencia |
|---|---|---|
| CLI-EV-001 | Rutas de panel y gráfica quedan permitidas a no administradores; el backend no fue verificado como barrera. | `src/router/index.js:245-270`; `CrearGraficas.vue` |
| CLI-EV-002 | El tablero puede intentar un PATCH documental automático sin comprobación de rol. | `src/components/tablero/Tablero.vue:2065-2082,2830-2833` |
| CLI-EV-003 | La guarda, Gestor y campos leen `sessionStorage`, pero los demás clientes CRUD solo `localStorage`. | router y servicios Axios |
| CLI-EV-004 | Si la carga del Gestor termina y falla el POST al CRUD puede quedar un binario huérfano. | `Tablero.vue: flujo de creación documental` |
| CLI-EV-005 | La limpieza masiva elimina metadatos, no binarios uno por uno. | `Tablero.vue: limpiar estructura` |
| CLI-EV-006 | Se pasan valores no confiables a `Swal.fire({html})` en varios componentes. | rutas listadas en `brechas-y-riesgos.md` |
| CLI-EV-007 | El visor usa referencia cifrada y CRUD, pero el Bearer solo se valida sintácticamente en CRUD y la referencia es transferible durante TTL. | `Tablero.vue`; `DocumentoVisor.vue`; CRUD `PROY-TOBE-008` |

## Pendientes

- [NO VERIFICADO] Autorización real del servidor para acciones que la UI oculta.
- [NO VERIFICADO] CORS, permisos efectivos, formato y estados del Gestor Documental.
- [NO VERIFICADO] Navegación por teclado, lectores de pantalla y contraste.
- [NO VERIFICADO] Integración end-to-end con navegador, CRUD, Elasticsearch y Gestor.
