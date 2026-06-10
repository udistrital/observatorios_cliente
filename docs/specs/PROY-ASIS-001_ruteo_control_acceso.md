# PROY-ASIS-001 — Ruteo SPA y control de acceso por rol

## Historia de Usuario (AS-IS)
**Como** usuario autenticado
**Quiero** acceder solo a rutas habilitadas por mi rol
**Para** operar la plataforma de manera segura y controlada.

## Criterios de aceptación funcionales
1. Si el usuario no tiene permisos, la UI redirige a `espacios`.
2. Si la ruta es inválida, la UI redirige a `/espacios`.
3. Si existe token al entrar por raíz, redirige a `espacios`.

---

## Problema funcional
El control de acceso existe en código, pero debía consolidarse bajo convención SDD vigente.

## Objetivo del usuario
Tener referencia AS-IS verificable para cambios futuros en permisos y navegación.

## Impacto institucional
- Reduce regresiones de seguridad funcional en UI.
- Mejora trazabilidad entre reglas de rol y rutas expuestas.

---

## Soporte técnico
### Contrato observado
- Guard de navegación global en `router.beforeEach`.

### Evidencia verificable
- `src/router/index.js`
- `src/stores/userStore.js`
- `src/stores/factorStore.js`

### Riesgos
- Condiciones de carrera por espera activa de token/rol.

### INFERENCIA
- No se observa matriz formal versionada de permisos por ruta/rol fuera del código fuente.
