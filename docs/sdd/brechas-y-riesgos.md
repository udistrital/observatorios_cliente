# Brechas y riesgos AS-IS

Referencias OWASP y WCAG clasifican preocupaciones; no expresan certificación.

| ID | Criticidad | Estado | Riesgo | Evidencia |
|---|---|---|---|---|
| CLI-R-001 | Alta | [VERIFICADO] cliente / [NO VERIFICADO] servidor | No administradores alcanzan rutas y mutaciones de gráficas. | `router/index.js`; `CrearGraficas.vue` |
| CLI-R-002 | Alta | [VERIFICADO] | PATCH automático documental sin control de rol y en orden de inicialización dudoso. | `Tablero.vue: sincronización hash` |
| CLI-R-003 | Alta | [VERIFICADO] | Inconsistencia `sessionStorage`/`localStorage` genera peticiones CRUD sin Bearer. | router y servicios |
| CLI-R-004 | Alta | [VERIFICADO] | Alta/limpieza documental puede dejar binarios huérfanos. | `Tablero.vue` |
| CLI-R-005 | Alta | [VERIFICADO] sink / [NO VERIFICADO] explotación | Valores externos llegan a HTML de SweetAlert; riesgo XSS. | componentes listados en experiencia y accesibilidad |
| CLI-R-006 | Alta | [VERIFICADO] | MID legado usa URL vacía, mismo origen, sin Bearer y control insuficiente de `response.ok`. | `components/archivos/` |
| CLI-R-007 | Media | [VERIFICADO] | Panel depende de stores nulos/persistidos y contiene llamada a función no definida. | `PanelVistaPrincipal.vue`; `Panel.vue`; `Graficas.vue` |
| CLI-R-008 | Media | [VERIFICADO] | Archivo completo se duplica como base64 sin límite de tamaño. | `Tablero.vue` |
| CLI-R-009 | Media | [VERIFICADO] | Errores se muestran/relanzan en múltiples capas y loaders pueden quedar activos. | `conexion_api.js`; componentes |
| CLI-R-010 | Media | [VERIFICADO] | `DELETE 204` puede producir resultado `undefined`. | `conexion_api.js` |
| CLI-R-011 | Media | [VERIFICADO] | Accesibilidad: idioma incorrecto, controles no operables por teclado y nombres faltantes. | [`../frontend/experiencia-y-accesibilidad.md`](../frontend/experiencia-y-accesibilidad.md) |
| CLI-R-012 | Media | [VERIFICADO] estático | Docker usa build genérico sin generar `environment.js`; no hay `.dockerignore`. | `Dockerfile`; scripts |
| CLI-R-013 | Media | [VERIFICADO] | CI no ejecuta pruebas ni lint; cobertura funcional mínima. | `.drone.yml`; `package.json` |
| CLI-R-014 | Media | [VERIFICADO] riesgo / [NO VERIFICADO] fallo | Node 18 de CI puede divergir de engines transitivos del lock. | lockfile y Drone |

## Decisiones pendientes

- [PROPUESTA] Definir autorización de servidor antes de ampliar rutas para no
  administradores.
- [PROPUESTA] Unificar almacenamiento de token y manejo 401 mediante spec TO-BE.
- [PROPUESTA] Definir compensación/idempotencia documental con el proveedor.
- [PROPUESTA] Resolver o retirar el flujo MID legado solo con evidencia de uso.
- [PROPUESTA] Establecer una puerta WCAG verificable para cambios de interfaz.

Las propuestas no autorizan cambios de código ni dependencias.
