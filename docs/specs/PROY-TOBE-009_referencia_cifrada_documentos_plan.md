# Plan de PROY-TOBE-009

## Referencia

Spec `PROY-TOBE-009_referencia_cifrada_documentos.md`, base `102cee4`, autorizada
el 2026-11-11 e implementada en el checkout local.

## Enfoque técnico

Agregar dos métodos a `campos.service.js`. En `verArchivoDocumental`, abrir primero
una pestaña vacía, solicitar la referencia y navegarla con `router.resolve`. En
`DocumentoVisor.vue`, sustituir únicamente la llamada GET al Gestor por el GET del
CRUD; todo el procesamiento del archivo permanece intacto.

## Impactos

| Archivo | Cambio | Riesgo |
|---|---|---|
| `campos.service.js` | contratos y token de sesión | error/gateway |
| `Tablero.vue` | contexto, popup y referencia | bloqueo de popup |
| `DocumentoVisor.vue` | origen del contenido | respuesta incompatible |
| SDD relacionado | convergencia | documentación obsoleta |

## Pruebas y despliegue

Build valida router/template e imports; pruebas de utilidad existentes comprueban
el procesamiento de formatos, no la integración. Desplegar después del CRUD.
Rollback coordinado: retirar este cliente antes de los endpoints CRUD; volver al
GET directo del Gestor reabre el riesgo que motivó la referencia cifrada.

## Dudas bloqueantes

Ninguna para el alcance implementado. La ruta conserva la forma
`/documentos/<valor-opaco>`, pero el parámetro se llama `:referencia`, no `:hash`.
La falta de JWT/ACL en CRUD y la transferencia durante TTL quedan como riesgos.
