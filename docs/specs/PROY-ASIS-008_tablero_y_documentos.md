# PROY-ASIS-008 Tablero de datos y documentos

## Identidad

Sistema `observatorios_cliente`; AS-IS; referencia `102cee4` +
`PROY-TOBE-008/009`, 2026-11-11.
Evidencia: `components/tablero/Tablero.vue`, `DocumentoVisor.vue`, servicios de
campos/Gestor y `documentViewer.js`. Verificación estática/unitaria y de build; sin
prueba end-to-end.

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
| REQ-TAB-005 | Visualizar PDF/Word/Excel. | BR-005: tablero obtiene una referencia cifrada del CRUD; visor consulta contenido al CRUD y representa localmente en solo lectura. |
| REQ-TAB-006 | Capturar y abrir enlaces web. | BR-006: Tablas ofrecen `link`, validan HTTP(S) absoluto y muestran vínculos seguros en pestaña nueva. |

## Criterios

- **AC-001**: Dado archivo permitido y metadatos válidos, cuando ambos servicios
  responden, entonces el registro aparece con su hash.
- **AC-002**: Dado fallo del CRUD tras carga, entonces el AS-IS puede dejar archivo
  huérfano; no se documenta como éxito.
- **AC-003**: Dado contexto y hash válidos, el tablero POSTea los cuatro IDs al
  CRUD, abre `/documentos/{referencia}` y el visor GETea el contenido del CRUD con
  Bearer antes de seleccionar la representación por formato.
- **AC-004**: Dado error de visor, entonces se presenta mensaje y reintento.
- **AC-005**: Dado un campo `link`, cuando su valor es HTTP(S) válido, entonces
  se muestra con `noopener noreferrer`; un valor inválido permanece como texto.

## NFR, pruebas y riesgos

[VERIFICADO] no hay límite cliente para archivos; el archivo completo se convierte
a base64. Diez pruebas cubren utilidades de documentos y enlaces, no componentes
ni integración. Riesgos: binarios huérfanos, PATCH automático sin rol, XSS en
mensajes y estructura con solo `hash` sin columna visible.

El visor activo no consulta directamente Gestor ni MID. El CRUD solo comprueba la
sintaxis Bearer: la referencia puede transferirse entre sesiones autenticadas
durante el TTL, el Bearer reenviado conserva los permisos del Gestor y una
credencial amplia todavía puede consultar directamente ese servicio.
