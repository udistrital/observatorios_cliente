# Arquitectura e integraciones — observatorios_cliente

> Estado: resumen histórico consolidado. La fuente canónica es
> [`sdd/arquitectura-as-is.md`](sdd/arquitectura-as-is.md).

## Arquitectura del repositorio
- Stack: Vue 3 + Vite + Vuetify + Pinia + Vue Router.
- Patrón principal: SPA con capa de servicios HTTP por dominio funcional.

## Diagrama de contexto
```mermaid
flowchart LR
  U[Usuario] --> C[observatorios_cliente\nSPA Vue]
  C -->|REST api/v1 y visor| CRUD[observatorios_crud]
  C -->|carga reemplazo eliminación| GD[Gestor Documental]
  CRUD -->|consulta validada| GD
  C -.->|componentes legados| MID[observatorios_mid]
```

## Contratos e interacciones esperadas
| Sistema destino | Propósito | Evidencia técnica |
|---|---|---|
| `observatorios_crud` | CRUD del dominio y visualización por referencia cifrada | `campos.service.js`, tablero y visor |
| Gestor Documental | Binarios: alta, reemplazo y eliminación directos; consulta indirecta por CRUD | `gestorDocumentalService.js`, tablero |
| `observatorios_mid` | Flujo anterior no configurado | Componentes `archivos/` con base vacía |

## Riesgos técnicos
- Configuración de endpoints de ambiente no centralizada completamente.
- Mezcla de `fetch` y `axios` (estandarización pendiente).
- Contratos de error entre cliente y backend no formalizados en una especificación única.

## Entregables SDD

- [Servicios y estado](frontend/servicios-y-estado.md).
- [Brechas y riesgos](sdd/brechas-y-riesgos.md).
