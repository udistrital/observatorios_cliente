# PROY-TOBE-005 — Gestión de procesos desde panel principal

## Historia de Usuario
**Como** usuario autenticado del sistema Observatorios
**Quiero** visualizar primero los procesos institucionales y navegar desde ellos hacia sus factores
**Para** operar la jerarquía funcional real del sistema desde su nivel superior.

## Flujo AS-IS
1. Al ingresar a `/espacios`, la UI carga y muestra factores de evaluación.
2. La creación de procesos existe como acción secundaria dentro de `Administración de Factores`.
3. La navegación principal omite el nivel jerárquico `Proceso` y dirige al usuario hacia factores.

## Flujo TO-BE
1. Al ingresar a `/espacios`, la UI carga procesos desde `procesosService.listar()`.
2. El usuario visualiza procesos activos como primer nivel de navegación.
3. El usuario selecciona un proceso y navega a sus factores asociados.
4. El usuario administrador puede crear, ver, editar, desactivar y reactivar procesos desde el panel principal.
5. El usuario administrador puede crear factores dentro del contexto del proceso seleccionado.
6. La navegación existente desde factor hacia estructuras se mantiene.

## Criterios de Aceptación
1. `/espacios` muestra procesos y no factores como listado principal.
2. Si no hay procesos activos, la UI informa el estado vacío.
3. Los usuarios con rol `ADMIN_OBSERVATORIOS` ven acciones CRUD sobre procesos.
4. Los usuarios sin rol administrador pueden consultar procesos activos y sus factores activos.
5. Al seleccionar un proceso, la UI navega a `/procesos/:proceso_id/factores`.
6. La vista de factores por proceso lista únicamente factores cuyo `proceso_id` corresponde al proceso seleccionado.
7. Al crear un factor desde un proceso, el `proceso_id` queda preseleccionado y enviado en el payload.
8. Las rutas existentes hacia estructuras por factor siguen funcionando.

## Rutas Impactadas
- `src/views/Espacios.vue`
- `src/router/index.js`
- `src/components/procesos/ProcesoFormDialog.vue`
- `src/components/procesos/ProcesoFactores.vue`

## Convención de Rutas TO-BE
| Nombre | Ruta canónica | Compatibilidad |
|---|---|---|
| `procesos` | `/procesos` | `/espacios` redirige a `/procesos` |
| `procesoFactores` | `/procesos/:proceso_id/factores` | `/proceso/:proceso_id/factores` redirige a la ruta canónica |
| `factorEstructurasGestion` | `/procesos/:proceso_id/factores/:factor_id/estructuras/gestion` | `/factor/:factor_id` se conserva como ruta legacy |
| `factorEstructuras` | `/procesos/:proceso_id/factores/:factor_id/estructuras` | `/estructuras/:factor_id` se conserva como ruta legacy |
| `factorTablero` | `/procesos/:proceso_id/factores/:factor_id/tablero` | `/tablero/:factor_id` se conserva como ruta legacy |
| `factorPanelGestion` | `/procesos/:proceso_id/factores/:factor_id/panel` | `/:factor_id/panel` se conserva como ruta legacy |
| `factorPanelPrincipal` | `/procesos/:proceso_id/factores/:factor_id/panel/principal` | `/:factor_id/panel/principal` se conserva como ruta legacy |
| `factorArchivosGestion` | `/procesos/:proceso_id/factores/:factor_id/archivos` | `/:factor_id/archivos` se conserva como ruta legacy |

## Servicios Impactados
- `src/service/procesos.service.js`
- `src/service/factores.service.js`

## Reglas de Permisos
- Consulta de procesos activos: usuario autenticado.
- Consulta de factores activos por proceso: usuario autenticado.
- CRUD de procesos: `ADMIN_OBSERVATORIOS`.
- CRUD de factores: `ADMIN_OBSERVATORIOS`.

## Evidencia Técnica Esperada
- `src/views/Espacios.vue` consume `procesosService`.
- `src/components/procesos/ProcesoFormDialog.vue` soporta creación y edición.
- `src/components/procesos/ProcesoFactores.vue` filtra factores por `proceso_id`.
- `src/router/index.js` registra la ruta `factoresPorProceso`.

## INFERENCIA
- Se asume que `observatorios_crud` expone los endpoints `/procesos/` y `/factores/` con los campos ya utilizados por los modelos locales.
