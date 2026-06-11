# PROY-ASIS-002 — Carga masiva CSV/JSON desde UI hacia CRUD

## Historia de Usuario (AS-IS)
**Como** usuario operativo
**Quiero** cargar datos masivos CSV/JSON
**Para** actualizar estructuras del observatorio de forma eficiente.

## Criterios de aceptación funcionales
1. La UI solo acepta `.csv` y `.json`.
2. La UI envía `FormData` con `archivo` y `formato` a CRUD.
3. La UI notifica éxito/error de la operación.

---

## Problema funcional
El flujo estaba operando sin consolidación SDD en convención vigente.

## Objetivo del usuario
Disponer de base AS-IS para no regresión del proceso de carga masiva.

## Impacto institucional
- Mejora calidad de operación de carga de datos.
- Facilita evaluación de cambios de contrato con CRUD.

---

## Soporte técnico
### Contrato observado
- Endpoint consumido: `POST datos/{idEstructura}/`.

### Evidencia verificable
- `src/components/tablero/CargarArchivo.vue`
- `src/service/conexion_api.js`

### Riesgos
- Mensajería UI de éxito puede ocultar errores parciales por fila.

### INFERENCIA
- No se observa contrato estándar de errores por fila para retroalimentación detallada.
