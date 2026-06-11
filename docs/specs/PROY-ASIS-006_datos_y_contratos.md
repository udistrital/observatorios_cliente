# PROY-ASIS-006 — Datos de sesión y contratos de integración UI

## Historia de Usuario (AS-IS)
**Como** integrador frontend-backend
**Quiero** identificar datos clave de sesión y payloads de UI
**Para** consumir APIs de forma consistente y verificable.

## Criterios de aceptación funcionales
1. Se documenta token de sesión usado por la UI.
2. Se documentan datos funcionales mínimos para rutas/cargas.
3. Se identifican variables de entorno críticas para integraciones.

---

## Problema funcional
La información de datos y contratos estaba dispersa y sin formato SDD uniforme.

## Objetivo del usuario
Consolidar en una spec única los datos AS-IS del cliente.

## Impacto institucional
- Mejora interoperabilidad UI con MID/CRUD.
- Reduce fallos por configuración incompleta.

## Soporte técnico
### Datos observados
- Sesión: `access_token` en `localStorage`.
- Ruta: `factor_id` como parámetro de navegación.
- Carga: `FormData` con `archivo` y `formato`.

### Variables de integración
- `MAIN_BACKEND`, `OBSERVATORIOS_MID`, `GESTOR_DOCUMENTAL`.

### Evidencia verificable
- `src/eviroments.js`
- `src/router/index.js`
- `src/service/conexion_api.js`

### INFERENCIA
- No se observa esquema tipado centralizado para payloads UI→API.
