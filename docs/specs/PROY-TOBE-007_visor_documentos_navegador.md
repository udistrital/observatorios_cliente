# PROY-TOBE-007 Visor de documentos en navegador

## Identidad

| Campo | Valor |
|---|---|
| Sistema | `observatorios_cliente` |
| Estado | TO-BE con implementación observada; aprobación y convergencia [NO VERIFICADO] |
| Referencia | `102cee4` + `PROY-TOBE-009`, 2026-11-11 |
| Evidencia implementada | `DocumentoVisor.vue`, `documentViewer.js`, prueba y router |

## Contexto

**Como** usuario autenticado, **quiero** visualizar evidencia PDF, Word o Excel
sin exponer el hash a un visor externo, **para** consultar el documento en modo de
solo lectura.

El código ya está en el commit de referencia. Esta spec reconstruye el objetivo y
registra puertas pendientes; no afirma aprobación institucional retroactiva.

## Requisitos TO-BE reconstruidos

| ID | Requisito | Estado observado |
|---|---|---|
| REQ-VISOR-001 | Ruta autenticada `/documentos/:referencia`; el hash no aparece en URL. | [VERIFICADO] implementado por PROY-TOBE-009 |
| REQ-VISOR-002 | Obtener documento del CRUD con Bearer; CRUD revalida y consulta el Gestor. | [VERIFICADO] implementado por PROY-TOBE-009 |
| REQ-VISOR-003 | Representar PDF, DOC/DOCX y XLS/XLSX localmente. | [VERIFICADO] implementado estáticamente |
| REQ-VISOR-004 | No enviar el contenido a visores externos. | [VERIFICADO] no se observan llamadas de visor externo |
| REQ-VISOR-005 | Mostrar carga, error y reintento; liberar URLs temporales. | [VERIFICADO] implementado |
| REQ-VISOR-006 | Definir límites, accesibilidad y contrato formal del Gestor. | [NO VERIFICADO] pendiente |

## Criterios

- **AC-VISOR-001**: Dada referencia y sesión válidas, cuando el CRUD responde PDF,
  entonces se presenta en modo de solo lectura.
- **AC-VISOR-002**: Dado Word o Excel compatible, cuando se procesa, entonces no
  se navega a un servicio externo.
- **AC-VISOR-003**: Dado error de red/formato, entonces se muestra error y reintento
  sin conservar URLs temporales anteriores.
- **AC-VISOR-004**: Dado solo teclado o lector de pantalla, los estados deben ser
  anunciados. [NO VERIFICADO] el error cumple este criterio.

## Pruebas y puertas de convergencia

`documentViewer.spec.js` cubre 5 casos utilitarios. Faltan pruebas de componente,
servicio, router, errores, limpieza y accesibilidad. La consulta indirecta está
cubierta en el CRUD con dobles, no de extremo a extremo. Antes de declarar
convergencia completa se debe confirmar límite de tamaño, navegadores soportados y
revisión de seguridad de librerías.

## Riesgos y decisiones

Carga completa en memoria, timeout de 240 s, dependencia de MIME/metadatos externos
y procesamiento de contenido no confiable. La referencia es transferible durante
su TTL y el CRUD no valida JWT/ACL; el Gestor decide sobre el Bearer reenviado.
[PROPUESTA] Las decisiones pendientes requieren aprobación; esta spec no autoriza
nuevos cambios.
