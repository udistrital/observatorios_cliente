# PROY-TOBE-006 — Visualización para usuarios no administradores

## Historia de Usuario (TO-BE)
**Como** usuario autenticado sin rol `ADMIN_OBSERVATORIOS`
**Quiero** visualizar la información existente de procesos, factores, estructuras, tableros, paneles y registros
**Para** consultar evidencias institucionales sin poder crear, actualizar o eliminar información.

## Criterios de aceptación funcionales
1. Un usuario sin rol `ADMIN_OBSERVATORIOS` puede navegar a vistas de consulta y ver información activa existente.
2. Un usuario sin rol `ADMIN_OBSERVATORIOS` no ve acciones CUD: crear, editar, activar/desactivar, eliminar, limpiar registros o cargar documentos.
3. Si un usuario sin rol `ADMIN_OBSERVATORIOS` intenta entrar por URL a rutas de gestión de estructuras, el cliente lo redirige a la vista de consulta correspondiente.
4. Solo el rol `ADMIN_OBSERVATORIOS` puede ejecutar acciones CUD desde el cliente.
5. Un usuario sin rol `ADMIN_OBSERVATORIOS` solo visualiza elementos activos en cualquier nivel de índice o evidencia.

## Evidencia verificable
- `src/utils/roles.js`
- `src/router/index.js`
- `src/views/Espacios.vue`
- `src/components/procesos/ProcesoFactores.vue`
- `src/components/estructuras/Estructuras.vue`
- `src/components/aspectos/AspectosSection.vue`
- `src/components/tablero/Tablero.vue`
- `src/components/archivos/ArchivosGestion.vue`
- `src/components/panel/Panel.vue`
- `src/components/panel/PanelVistaPrincipal.vue`

## Riesgos
- El control en cliente no reemplaza la autorización obligatoria en APIs. Las mutaciones deben seguir protegidas en backend.
- Existen rutas legacy y componentes administrativos que deben mantenerse fuera del menú y guards para usuarios no administradores.
