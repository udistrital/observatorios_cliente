# Matriz de trazabilidad AS-IS

Los identificadores documentan comportamiento observado; no representan backlog
aprobado.

| REQ-ID | Caso de uso | Regla y criterio observable | Pantalla/servicio | Fuente | Test | Estado/riesgo |
|---|---|---|---|---|---|---|
| REQ-ASIS-CLI-001 | Autenticarse y navegar | BR-001 exige token fuera de `/`; AC-001 sin token redirige con `redirect` | Router/App | `router/index.js`; `App.vue` | No | [VERIFICADO] |
| REQ-ASIS-CLI-002 | Consultar procesos y factores | BR-002 usa rutas canónicas con `proceso_id`; AC-002 lista y abre factor | `Espacios.vue`, `ProcesoFactores.vue` | servicios de procesos/factores | No | [VERIFICADO] |
| REQ-ASIS-CLI-003 | Gestionar jerarquía | BR-003 presenta CUD al administrador; AC-003 recarga después de éxito | Estructuras/Aspectos | servicios de dominio | No | [VERIFICADO] UI; servidor [NO VERIFICADO] |
| REQ-ASIS-CLI-004 | Capturar datos | BR-004 adapta valores a campos y valida enlaces HTTP(S); AC-004 POST refresca tabla y un `link` válido es navegable | Tablero/campos | `campos.service.js`; `Tablero.vue`; `utils/enlaces.js` | 5 casos de enlaces | [VERIFICADO] parcial |
| REQ-ASIS-CLI-005 | Cargar documento | BR-005 sube binario y luego hash; AC-005 éxito muestra registro | Tablero/Gestor/campos | `Tablero.vue`; servicios | No | [VERIFICADO], compensación incompleta |
| REQ-ASIS-CLI-006 | Visualizar documento | BR-006 usa ruta autenticada y representación local; AC-006 soporta PDF/Word/Excel | `DocumentoVisor.vue` | `documentViewer.js` | 5 casos utilitarios | [VERIFICADO] |
| REQ-ASIS-CLI-007 | Reemplazar/eliminar documento | BR-007 coordina CRUD y Gestor; AC-007 intenta compensar reemplazo fallido | Tablero | `Tablero.vue` | No | [VERIFICADO], no transaccional |
| REQ-ASIS-CLI-008 | Gestionar panel/gráficas | BR-008 usa dashboard seleccionado; AC-008 persiste configuración | Paneles | `components/panel/` | No | [VERIFICADO], rol insuficiente |
| REQ-ASIS-CLI-009 | Administrar observatorios | BR-009 solo ruta administrativa; AC-009 recarga lista tras mutación | Administración | componentes de observatorios | No | [VERIFICADO] UI |
| REQ-ASIS-CLI-010 | Usar flujo MID anterior | BR-010 pretendía POST/PUT documento; AC-010 no reproducido | `components/archivos/` | fetch legado | No | [INFERIDO] no operativo |

## Cobertura de pruebas

- Documentados: 10 requisitos AS-IS.
- Con prueba existente identificada: 2 (`REQ-ASIS-CLI-004` y `006`, parciales).
- Sin prueba identificada: 8.
- [NO VERIFICADO] No se calculó cobertura de líneas ni de ramas.

## Compatibilidad cruzada

REQ-003 a REQ-009 deben trazarse también al OpenAPI del CRUD y a
[`matriz_interacciones.md`](matriz_interacciones.md). REQ-005 a REQ-007 dependen de
un contrato de Gestor Documental no disponible localmente.
