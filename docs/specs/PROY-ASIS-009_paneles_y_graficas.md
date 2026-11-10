# PROY-ASIS-009 Paneles y gráficas

## Identidad

Sistema `observatorios_cliente`; AS-IS; referencia `8537cb7`, 2026-11-10.
Evidencia: rutas de panel, `components/panel/`, `panelStore` y `graficaStore`.

## Objetivo y alcance

**Como** usuario autenticado, **quiero** consultar paneles y, cuando la UI lo
permite, configurar gráficas, **para** visualizar datos. Excluye exactitud de las
agregaciones y autorización del servidor.

## Requisitos y reglas

| ID | Requisito | Regla |
|---|---|---|
| REQ-PAN-001 | Listar/crear paneles. | BR-001: depende de observatorio y factor seleccionados. |
| REQ-PAN-002 | Crear/editar gráficos. | BR-002: usa panel, columna, fila y configuración. |
| REQ-PAN-003 | Persistir contexto de panel/gráfica. | BR-003: ambos stores usan persistencia. |
| REQ-PAN-004 | Visualizar panel. | BR-004: rutas canónicas y legadas coexisten. |

## Criterios

- **AC-001**: Dado contexto completo, cuando se crea un panel, entonces se llama
  al CRUD y la UI actualiza/navega según el componente.
- **AC-002**: Dado acceso directo sin observatorio, entonces el AS-IS puede fallar
  por referencia nula; no se presume hidratación.
- **AC-003**: Dado usuario no administrador, la ruta de gráficas sigue permitida y
  puede alcanzar mutaciones; el control servidor es [NO VERIFICADO].

## Pruebas y riesgos

No se identificaron pruebas. Riesgos: stores obsoletos, loaders activos tras error,
temporizadores sin esperar respuesta, función `traerPaneles` no definida y
constructor backend parcialmente roto.
