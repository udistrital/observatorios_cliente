# PROY-TOBE-009 Visor mediante referencia cifrada

## Identidad

| Campo | Valor |
|---|---|
| Sistema dueño | `observatorios_cliente` |
| Estado | implementado; convergencia documental y verificación unit/build |
| Referencia | `develop@102cee4` + cambios locales, 2026-11-11 |
| Dependencia | CRUD `PROY-TOBE-008` |

## Contexto y objetivo

**Como** usuario autenticado, **quiero** abrir el visor con una referencia opaca,
**para** que el UUID real del Gestor no quede en la URL ni pueda sustituirse para
consultar documentos ajenos a la estructura.

## Alcance

- Al pulsar «Ver documento», enviar proceso, factor, estructura y documento al CRUD.
- Abrir `/documentos/<referencia_cifrada>` con el parámetro Vue Router
  `:referencia` en nueva pestaña.
- Obtener el contenido desde CRUD, no desde Gestor.
- Mantener sin cambios renderizado PDF, Word, Excel, hojas y diseño.
- No modificar carga, reemplazo, eliminación ni bibliotecas del visor.

## Requisitos y criterios

| ID | Requisito |
|---|---|
| REQ-DOC-CLI-001 | Solicitar la referencia con el contexto actual y el hash seleccionado. |
| REQ-DOC-CLI-002 | Abrir la pestaña sin exponer el hash y sin `window.opener`. |
| REQ-DOC-CLI-003 | Consultar contenido por `camposService` y conservar el procesamiento existente. |
| REQ-DOC-CLI-004 | Presentar 401/403/404 y errores de red con los estados actuales. |

- **AC-DOC-CLI-001**: La ruta visible contiene solo la referencia cifrada.
- **AC-DOC-CLI-002**: Un UUID antiguo usado como referencia recibe error del CRUD.
- **AC-DOC-CLI-003**: PDF, DOC, DOCX, XLS y XLSX conservan su visualización.
- **AC-DOC-CLI-004**: La pestaña se abre antes de esperar la red para evitar el
  bloqueo de popups y se cierra si la referencia falla.

## Contrato

`camposService.solicitarReferenciaDocumento(payload)` consume el POST definido por
CRUD `PROY-TOBE-008`; `obtenerContenidoDocumento(referencia)` consume el GET. El
servicio reconoce token de `localStorage` o `sessionStorage`. El POST puede
responder 200/400/401/404/429/503; el GET,
200/401/403/404/413/429/502/503/504.

## Seguridad y riesgos

- La referencia es opaca pero aparece en historial/logs; expira en 7 días y
  el CRUD revalida la asociación.
- La referencia es transferible entre sesiones autenticadas durante el TTL; no es
  una autorización y el CRUD solo comprueba sintaxis Bearer, sin JWT ni ACL por
  proceso.
- El hash continúa presente en memoria/respuestas del tablero para compatibilidad
  con edición y eliminación, pero no se coloca en la ruta del visor.
- El acceso directo al Gestor con una credencial amplia permanece como riesgo
  residual; el Bearer reenviado sigue sujeto a permisos del Gestor.

## Pruebas y convergencia

Vitest cubre las utilidades de formatos y el build valida router, imports y
templates. No hay prueba end-to-end con navegador, Elasticsearch y Gestor reales;
esa ausencia no debe presentarse como verificación de la autorización.
