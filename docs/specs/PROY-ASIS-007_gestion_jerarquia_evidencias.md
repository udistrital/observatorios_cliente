# PROY-ASIS-007 Gestión de jerarquía y evidencias

## Identidad

Sistema `observatorios_cliente`; estado AS-IS; referencia `8537cb7`, 2026-11-10.
Evidencia: router, vistas de procesos y componentes/servicios de jerarquía.

## Objetivo y alcance

**Como** usuario, **quiero** navegar procesos y gestionar su jerarquía de
evidencias, **para** localizar estructuras. Incluye rutas canónicas, lectura para
usuarios autenticados y acciones visibles de administrador. Excluye autorización
del servidor.

## Requisitos y reglas

| ID | Requisito | Regla |
|---|---|---|
| REQ-CLI-JER-001 | Mostrar procesos y factores. | BR-001: rutas canónicas incluyen `proceso_id`. |
| REQ-CLI-JER-002 | Mostrar características, aspectos y estructuras. | BR-002: el árbol usa servicios CRUD y estado del factor. |
| REQ-CLI-JER-003 | Permitir CUD visible a admin. | BR-003: rol normalizado `ADMIN_OBSERVATORIOS`. |
| REQ-CLI-JER-004 | Conservar rutas antiguas. | BR-004: compatibilidad sin `proceso_id`. |

## Criterios

- **AC-001**: Dado token y usuario, cuando se abre `/procesos`, entonces se carga
  la lista o un estado vacío/error.
- **AC-002**: Dado un factor en URL, cuando el store no coincide, entonces la
  guarda intenta hidratarlo.
- **AC-003**: Dado un no administrador, las acciones CUD de jerarquía no se
  presentan; [NO VERIFICADO] el API las rechaza si se invoca directamente.

## Contratos, NFR y pruebas

Ver [`../frontend/servicios-y-estado.md`](../frontend/servicios-y-estado.md).
[VERIFICADO] no existen pruebas de router/componentes. [NO VERIFICADO] tiempos de
respuesta, teclado y autorización backend. Riesgo: la guarda crea un factor mínimo
si falla su consulta y puede ocultar 403/404.
