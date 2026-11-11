# Plan de PROY-TOBE-008

## Referencia

Spec `PROY-TOBE-008_tipo_campo_enlace.md`, base `0483dfe`, aprobada para esta
entrega y coordinada con CRUD `PROY-TOBE-007`.

## Enfoque técnico

Extraer una utilidad pura que acepte solo URL absoluta HTTP(S), agregar `link` al
catálogo reducido de Tablas, usar `type="url"` en el SweetAlert activo y añadir
slots dinámicos de Vuetify para representar enlaces. Los atributos se enlazarán
con Vue y los valores inválidos permanecerán como texto.

## Impactos

| Área | Archivo/servicio | Cambio previsto | Riesgo |
|---|---|---|---|
| Tablero | `components/tablero/Tablero.vue` | selector, captura y celdas | Slot dinámico por nombre |
| Utilidad | `src/utils/enlaces.js` | validación compartida | Diferencia con validador servidor |
| Pruebas | `src/utils/enlaces.spec.js` | casos positivos y de seguridad | Node local incompatible |
| Documentación | AS-IS, matriz e índices SDD | convergencia | Referencias cruzadas |

## Datos y contrato

No se transforma estado local ni persistido. El nuevo discriminador `link` se
envía al contrato existente. El CRUD se despliega primero para evitar rechazos de
tipo. Rollback: retirar opción/renderizado; los valores siguen siendo texto JSON.

## Estrategia de pruebas

Pruebas puras de URL y build Vue para validar el slot dinámico. Revisión manual
prevista de alta, edición, vacío, URL inválida, enlace seguro y vista móvil.

## Despliegue y reversión

Desplegar después del CRUD. Para reversión, retirar el cliente primero. No se
requiere migración ni limpieza de columnas existentes.

## Dudas bloqueantes

Ninguna. El flujo activo y los criterios de URL quedaron verificados y definidos.
