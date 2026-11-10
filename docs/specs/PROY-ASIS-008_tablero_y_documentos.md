# PROY-ASIS-008 Tablero de datos y documentos

## Identidad

Sistema `observatorios_cliente`; AS-IS; referencia `8537cb7`, 2026-11-10.
Evidencia: `components/tablero/Tablero.vue`, `DocumentoVisor.vue`, servicios de
campos/Gestor y `documentViewer.js`.

## Objetivo y alcance

**Como** usuario autenticado, **quiero** consultar datos y documentos de una
estructura, **para** registrar evidencia y visualizarla. Incluye tablas,
metadatos, carga, reemplazo, eliminación y visor. Excluye implementación interna
del Gestor y garantías transaccionales.

## Requisitos y reglas

| ID | Requisito | Regla |
|---|---|---|
| REQ-TAB-001 | Hidratar estructura por `estructura_id`. | BR-001: tablero consulta estructura y jerarquía relacionada. |
| REQ-TAB-002 | Capturar datos tipados. | BR-002: valida y adapta valores a campos. |
| REQ-TAB-003 | Cargar documento. | BR-003: Gestor primero, CRUD después; `hash` reservado. |
| REQ-TAB-004 | Reemplazar/eliminar. | BR-004: coordina dos servicios con compensación parcial. |
| REQ-TAB-005 | Visualizar PDF/Word/Excel. | BR-005: ruta autenticada y representación local de solo lectura. |

## Criterios

- **AC-001**: Dado archivo permitido y metadatos válidos, cuando ambos servicios
  responden, entonces el registro aparece con su hash.
- **AC-002**: Dado fallo del CRUD tras carga, entonces el AS-IS puede dejar archivo
  huérfano; no se documenta como éxito.
- **AC-003**: Dado hash válido, cuando se abre `/documentos/{hash}`, entonces el
  visor solicita el binario con Bearer y selecciona representación por formato.
- **AC-004**: Dado error de visor, entonces se presenta mensaje y reintento.

## NFR, pruebas y riesgos

[VERIFICADO] no hay límite cliente; el archivo completo se convierte a base64.
Cinco pruebas cubren utilidades, no el componente ni la integración. Riesgos:
binarios huérfanos, PATCH automático sin rol, XSS en mensajes y estructura con
solo `hash` sin columna visible.
