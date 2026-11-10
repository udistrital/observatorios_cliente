# Guía de trabajo para agentes

## Lectura mínima por tarea

| Tarea | Leer primero | Después |
|---|---|---|
| Funcionalidad Vue | `../frontend/navegacion-y-modulos.md` | ruta, vista, componente, servicio y store afectados |
| Bug de integración | `matriz_interacciones.md`, `../frontend/servicios-y-estado.md` | contrato del proveedor y manejo UI |
| Documento/visor | Specs, servicios y `Tablero.vue`/`DocumentoVisor.vue` | contrato CRUD/Gestor y pruebas de utilidades |
| Seguridad/rol | `brechas-y-riesgos.md` | router, `roles.js`, acciones y autorización del servidor |
| Accesibilidad | `../frontend/experiencia-y-accesibilidad.md` | plantilla y estados del componente |
| Despliegue | `../operations/ejecucion-y-despliegue.md` | package, Vite, Docker, Nginx y Drone |
| Cambio de contrato | matriz y trazabilidad | servicio, consumidores, CRUD y pruebas |

## Reglas de contexto

1. Leer índices y módulo afectado; evitar cargar componentes no relacionados.
2. Confirmar si la ruta es canónica o legada.
3. Seguir la llamada hasta el proveedor; una llamada UI no prueba el contrato.
4. No reproducir URLs internas, tokens, archivos ni datos personales.
5. Citar `ruta:símbolo` o líneas comprobadas y etiquetar incertidumbre.

## Protocolo y autorización

Aplicar [`flujo-sdd.md`](flujo-sdd.md). La secuencia obligatoria es investigar,
especificar, aclarar, planear, desglosar, validar, implementar solo con
autorización, probar y converger documentación.

## Compatibilidad

Un cambio de endpoint, payload, error, permiso, rol, variable o formato actualiza
en la misma entrega el servicio, consumidores, matriz, trazabilidad, spec y
contrato del proveedor. Un control visual no sustituye autorización del backend.

## Discrepancias

Registrar fuente de código, documentación en conflicto, impacto, criticidad y
decisión pendiente. No asignar responsable si no está identificado. Distinguir
activo, legado, parcialmente implementado y TO-BE.

## Definición de terminado documental

- Ruta, rol, pantalla, servicio, endpoint y estados UI trazados.
- Evidencias y etiquetas de certeza.
- Criterios positivos, negativos, límites y accesibilidad.
- Contratos cruzados enlazados.
- Enlaces y diagramas válidos.
- Pruebas existentes separadas de las propuestas.
- Sin secretos ni afirmaciones de cumplimiento no auditado.
