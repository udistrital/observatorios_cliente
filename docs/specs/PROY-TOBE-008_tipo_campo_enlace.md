# PROY-TOBE-008 Tipo de campo Enlace en tablas

## Identidad

| Campo | Valor |
|---|---|
| Sistema dueño | `observatorios_cliente` |
| Estado | aprobado para implementación |
| Referencia | `feature/documentacion_spec-driven@0483dfe`, 2026-11-11 |
| Reemplaza | `[NO APLICA]` |

## Contexto y objetivo

**Como** administrador de una estructura tipo Tabla, **quiero** crear campos de
tipo Enlace y registrar URLs, **para** que cualquier usuario autorizado pueda
abrir la dirección guardada desde la tabla.

## Alcance

### Incluye

- Opción visible `Enlace` con valor técnico `link` solo en estructuras Tabla.
- Entrada URL en alta y edición de registros.
- Renderizado de celdas válidas como vínculo en pestaña nueva.
- Texto plano para valores inválidos y guion para valores vacíos.

### Excluye

- Conversión o detección automática de columnas `text`.
- Previsualización, descarga o consulta automática de la URL.
- Cambios a componentes legados o modales no alcanzables desde el tablero activo.

## Requisitos funcionales

| ID | Requisito verificable | Fuente/prioridad |
|---|---|---|
| REQ-LINK-CLI-001 | El selector de campos de una Tabla ofrece `Enlace (link)`. | Alta |
| REQ-LINK-CLI-002 | Alta y edición usan control URL y validan HTTP(S) absoluto, vacío opcional y máximo 2048. | Alta |
| REQ-LINK-CLI-003 | Una URL válida se muestra como `<a>` con `target="_blank"` y `rel="noopener noreferrer"`. | Alta |
| REQ-LINK-CLI-004 | Un valor inválido nunca se convierte en enlace navegable. | Alta |

## Reglas de negocio

| ID | Regla | Fuente |
|---|---|---|
| BR-LINK-CLI-001 | Solo se aceptan esquemas explícitos `http://` y `https://`. | Seguridad |
| BR-LINK-CLI-002 | El texto visible es la dirección almacenada; no se ejecuta HTML. | Seguridad |
| BR-LINK-CLI-003 | La escritura conserva el control visual de administrador vigente. | Compatibilidad |

## Escenarios

- El administrador crea un campo Enlace, registra una URL HTTPS y la tabla la
  presenta como vínculo en una pestaña nueva.
- El usuario deja el campo vacío y la celda muestra un guion.
- Un dato histórico inválido se presenta como texto plano sin `href`.
- Una URL sin esquema o con `javascript:` se rechaza antes de enviar y también
  será rechazada por el CRUD.

## Criterios de aceptación

- **AC-LINK-CLI-001**: Dada una estructura Tabla, cuando se agrega o edita un
  campo, entonces puede seleccionarse `Enlace` y persistirse `link`.
- **AC-LINK-CLI-002**: Dada una URL HTTP(S), cuando se crea o edita un registro,
  entonces se envía la cadena validada al CRUD.
- **AC-LINK-CLI-003**: Dada una URL válida, cuando se muestra la tabla, entonces
  abre exactamente el valor guardado en una pestaña nueva sin acceso a `opener`.
- **AC-LINK-CLI-004**: Dado contenido inválido o peligroso, cuando se muestra la
  tabla, entonces queda como texto plano o guion y no dispara solicitudes.

## Contratos e integraciones

El cliente envía `tipo_campo: "link"` por `camposService.actualizarCampos()` y
valores string/null por los endpoints existentes de registros. Requiere
`observatorios_crud` `PROY-TOBE-007`; no cambia rutas ni formas de respuesta.

## Requisitos no funcionales

- No usar `v-html` para celdas ni insertar una URL sin validación en `href`.
- Reutilizar una utilidad pura para captura y renderizado.
- Mantener comportamiento responsive, paginación, ordenamiento y permisos.

## Pruebas y evidencia

- Pruebas Vitest de utilidad para HTTP/HTTPS, vacío, esquema ausente,
  protocolos peligrosos, longitud y conservación del valor.
- Verificación prevista: `npm run test -- --run` y `npm run build:local` con una
  versión de Node compatible con Vite 6.

## Riesgos, dudas y decisiones

- Node 12 del entorno conocido no ejecuta Vite/Vitest 3; cualquier bloqueo se
  registrará sin degradar dependencias.
- El formulario activo es SweetAlert en `components/tablero/Tablero.vue`; los
  componentes `AgregarRegistro.vue` y `RegistroGestion.vue` no se abren desde la
  ruta vigente y quedan fuera del cambio mínimo.

## Convergencia

Implementado el 2026-11-11 junto con CRUD `PROY-TOBE-007`. Se actualizaron AS-IS,
matrices y pruebas. Evidencia ejecutada con Node 20 temporal, sin modificar las
dependencias declaradas:

- `vitest --run`: 10 pruebas aprobadas, 5 de ellas para enlaces.
- `vite build` con ambiente local: compilación aprobada; se conserva la advertencia
  preexistente de chunks mayores a 500 kB.

[NO VERIFICADO] No se ejecutó la ruta en navegador con servicios reales ni la
inspección visual manual en tamaños desktop/móvil.
