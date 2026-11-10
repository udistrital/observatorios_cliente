# SDD de `observatorios_cliente`

## Propósito
Organizar especificaciones AS-IS y futuras del frontend `observatorios_cliente` con enfoque en **historias de usuario**, valor funcional y criterios de aceptación verificables.

## Estructura y plantillas

- [Spec](plantillas/spec_template.md): qué y por qué.
- [Plan](plantillas/plan_template.md): cómo.
- [Tareas](plantillas/tasks_template.md): secuencia verificable.
- [Checklist](plantillas/checklist_template.md): puertas de calidad.
- [ADR](adr/adr_template.md): decisión arquitectónica.
- [Backlog](backlog_specs.md): propuestas; no autoriza implementación.

## Mapa documental

- [Índice técnico](../README.md)
- [Arquitectura AS-IS](../sdd/arquitectura-as-is.md)
- [Matriz de trazabilidad](../sdd/matriz-trazabilidad.md)
- [Flujo SDD](../sdd/flujo-sdd.md)

## Convenciones
- Cada especificación debe iniciar con una **Historia de Usuario** (Como / Quiero / Para).
- Priorizar lenguaje funcional sobre implementación técnica.
- Incluir evidencia en formato ruta de archivo.
- Marcar supuestos como **INFERENCIA**.
- Toda spec debe ser verificable mediante criterios de aceptación observables.

## Inventario AS-IS vigente

- [PROY-ASIS-001 Ruteo y acceso](PROY-ASIS-001_ruteo_control_acceso.md)
- [PROY-ASIS-002 Carga masiva histórica](PROY-ASIS-002_carga_masiva_datos.md)
- [PROY-ASIS-003 Flujo MID histórico](PROY-ASIS-003_flujo_documental_mid.md)
- [PROY-ASIS-004 Visión](PROY-ASIS-004_vision_y_alcance.md)
- [PROY-ASIS-005 Requisitos](PROY-ASIS-005_requerimientos_funcionales.md)
- [PROY-ASIS-006 Datos y contratos](PROY-ASIS-006_datos_y_contratos.md)
- [PROY-ASIS-007 Jerarquía y evidencias](PROY-ASIS-007_gestion_jerarquia_evidencias.md)
- [PROY-ASIS-008 Tablero y documentos](PROY-ASIS-008_tablero_y_documentos.md)
- [PROY-ASIS-009 Paneles y gráficas](PROY-ASIS-009_paneles_y_graficas.md)

## Inventario TO-BE vigente

- [PROY-TOBE-005 Gestión de procesos](PROY-TOBE-005_gestion_procesos_panel_principal.md)
- [PROY-TOBE-006 Visualización no admin](PROY-TOBE-006_visualizacion_no_admin.md)
- [PROY-TOBE-007 Visor de documentos](PROY-TOBE-007_visor_documentos_navegador.md)

`PROY-TOBE-007` debe registrar convergencia con el código ya presente; no se
considera aprobado solo por existir la implementación.

## Puertas

Completar spec, aclaraciones, plan, tareas y checklist; implementar solo con
autorización; ejecutar pruebas/build; actualizar matrices y AS-IS al converger.
