# PROY-ASIS-005 — Requerimientos funcionales vigentes

## Historia de Usuario (AS-IS)
**Como** consumidor institucional del frontend
**Quiero** requerimientos funcionales explícitos
**Para** validar que la UI cumple control de acceso, carga de datos y flujo documental.

## Criterios de aceptación funcionales
1. La UI restringe navegación por rol (`ADMIN_OBSERVATORIOS`).
2. La UI permite carga CSV/JSON.
3. La UI consume servicios documentales con bearer token cuando aplica.

---

## Problema funcional
Los requerimientos estaban listados sin estructura SDD homologada.

## Objetivo del usuario
Normalizar base de verificación funcional AS-IS del frontend.

## Impacto institucional
- Facilita revisión de no regresión.
- Reduce ambigüedad entre producto y código.

## Soporte técnico
### Evidencia verificable
- `src/router/index.js`
- `src/components/tablero/CargarArchivo.vue`
- `src/service/gestorDocumentalService.js`
