# Arquitectura distribuida SDD (referencia local)

> Estado: referencia histórica. Consulte
> [`arquitectura-as-is.md`](arquitectura-as-is.md) para la vista verificada.

## Contexto
Este repositorio (`observatorios_cliente`) participa en un ecosistema de **tres repositorios separados**.

## Límites de responsabilidad
- **Cliente (este repo)**: UI, navegación, validaciones, consumo de APIs.
- **observatorios_crud**: CRUD y persistencia de dominio.
- **Gestor Documental**: binarios consumidos directamente por el cliente.
- **observatorios_mid**: componentes legados, no flujo principal.

## Integraciones críticas
1. Cliente -> CRUD (`api/v1/*`).
2. Cliente -> Gestor Documental y Cliente -> CRUD (`campos/datos/*`).
3. Cliente -> MID solo desde componentes legados con base no configurada.
