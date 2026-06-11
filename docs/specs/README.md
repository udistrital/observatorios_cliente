# SDD — observatorios_cliente

## Propósito
Organizar especificaciones AS-IS y futuras del frontend `observatorios_cliente` con enfoque en **historias de usuario**, valor funcional y criterios de aceptación verificables.

## Estructura
- `specs/plantillas/spec_template.md`: plantilla oficial para nuevas specs.
- `specs/PROY-ASIS-*_*.md`: especificaciones de comportamiento vigente.
- `specs/backlog_specs.md`: pipeline priorizado de nuevas specs.

## Mapa documental SDD
- Visión y alcance: `../README.md`
- Arquitectura e integraciones: `../arquitectura_e_integraciones.md`
- Flujos funcionales: `../flujos.md`
- Backlog SDD: `./backlog_specs.md`

## Convenciones
- Cada especificación debe iniciar con una **Historia de Usuario** (Como / Quiero / Para).
- Priorizar lenguaje funcional sobre implementación técnica.
- Incluir evidencia en formato ruta de archivo.
- Marcar supuestos como **INFERENCIA**.
- Toda spec debe ser verificable mediante criterios de aceptación observables.

## Inventario AS-IS vigente
- `PROY-ASIS-001_ruteo_control_acceso.md`
- `PROY-ASIS-002_carga_masiva_datos.md`
- `PROY-ASIS-003_flujo_documental_mid.md`
- `PROY-ASIS-004_vision_y_alcance.md`
- `PROY-ASIS-005_requerimientos_funcionales.md`
- `PROY-ASIS-006_datos_y_contratos.md`
