# Documentación técnica de `observatorios_cliente`

Fuente inspeccionada: rama `develop`, commit `8537cb7`, 2026-11-10.

## Ruta de lectura mínima

1. [Guía del repositorio](../AGENTS.md)
2. [Inventario de evidencias](sdd/inventario-evidencias.md)
3. [Arquitectura AS-IS](sdd/arquitectura-as-is.md)
4. [Navegación y módulos](frontend/navegacion-y-modulos.md)
5. [Servicios y estado](frontend/servicios-y-estado.md)
6. [Matriz de interacciones](sdd/matriz_interacciones.md)
7. [Especificaciones SDD](specs/README.md)

## Índice por responsabilidad

| Tema | Fuente canónica |
|---|---|
| Módulos y cobertura | [Inventario](sdd/inventario-evidencias.md) |
| Contexto, componentes y secuencias | [Arquitectura AS-IS](sdd/arquitectura-as-is.md) |
| Rutas, guardas y módulos | [Navegación](frontend/navegacion-y-modulos.md) |
| HTTP, stores, validación y respuesta UI | [Servicios y estado](frontend/servicios-y-estado.md) |
| Accesibilidad, estados e i18n | [Experiencia y accesibilidad](frontend/experiencia-y-accesibilidad.md) |
| Integraciones activas y legadas | [Matriz](sdd/matriz_interacciones.md) |
| REQ/BR/AC/código/prueba | [Trazabilidad](sdd/matriz-trazabilidad.md) |
| Seguridad y deuda | [Brechas y riesgos](sdd/brechas-y-riesgos.md) |
| Build, Docker y CI | [Ejecución y despliegue](operations/ejecucion-y-despliegue.md) |
| Trabajo de agentes | [Guía](sdd/guia-agentes.md) y [flujo SDD](sdd/flujo-sdd.md) |

## Límites verificados

La SPA no persiste el dominio. El flujo documental activo consume directamente
Gestor Documental para binarios y CRUD para metadatos/hash. `observatorios_mid`
permanece en componentes legados y no se considera integración activa.

Los documentos anteriores de arquitectura, flujos y reglas se conservan por
trazabilidad. Si difieren, prevalecen las fuentes canónicas de este índice y el
código del commit de referencia.

## Convención de certeza

- `[VERIFICADO]`: evidencia directa en checkout.
- `[INFERIDO]`: consecuencia estática pendiente de ejecución.
- `[NO VERIFICADO]`: falta evidencia o acceso.
- `[PROPUESTA]`: evolución no implementada ni autorizada.
- `[NO APLICA]`: dimensión evaluada que no corresponde.
