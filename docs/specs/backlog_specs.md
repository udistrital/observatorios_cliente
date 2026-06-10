# Backlog SDD — observatorios_cliente

| ID | Spec propuesta | Valor | Riesgo | Esfuerzo | Dependencias | Evidencia base AS-IS |
|---|---|---|---|---|---|---|
| PROY-TOBE-001 | Estandarización cliente HTTP (axios/interceptores/timeout/errores) | Alto | Medio | M | `src/service/conexion_api.js`, `src/service/gestorDocumentalService.js` | `docs/specs/PROY-ASIS-003_flujo_documental_mid.md` |
| PROY-TOBE-002 | Contrato funcional de errores UI para flujos CRUD y documental | Alto | Alto | M | `observatorios_crud`, `observatorios_mid` | `docs/specs/PROY-ASIS-006_datos_y_contratos.md` |
| PROY-TOBE-003 | Guardas de navegación por rol con matriz explícita de permisos | Medio | Medio | S | `src/router/index.js`, `src/stores/userStore.js` | `docs/specs/PROY-ASIS-001_ruteo_control_acceso.md` |
| PROY-TOBE-004 | Validación de carga masiva con feedback por registro fallido | Alto | Medio | M | `src/components/tablero/CargarArchivo.vue`, endpoints CRUD | `docs/specs/PROY-ASIS-002_carga_masiva_datos.md` |

## Nota
- Convención vigente de requerimientos nuevos: `PROY-TOBE-XXX`.
