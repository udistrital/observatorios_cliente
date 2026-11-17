# Checklist de PROY-TOBE-009

## Antes de implementar

- [x] Spec aprobada; plan y tareas cubren todos los AC.
- [x] Ruta, rol, servicio, proveedor y estados UI identificados.
- [x] Seguridad, accesibilidad, móvil y compatibilidad revisadas.
- [x] Autorización explícita recibida el 2026-11-11.

## Antes de cerrar

- [x] Vitest (10 casos) y build ejecutados con Node 20.
- [x] `apps.campos` (47 casos) y `manage.py check` ejecutados en CRUD; E2E
  omitida por no disponer de los servicios desplegados.
- [x] Matrices, trazabilidad y docs convergen.
- [x] Sin secretos ni afirmaciones de autenticación no implementada.
