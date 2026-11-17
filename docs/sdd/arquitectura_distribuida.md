# Arquitectura distribuida SDD (referencia local)

> Estado: referencia histórica. Consulte
> [`arquitectura-as-is.md`](arquitectura-as-is.md) para la vista verificada.

## Contexto
Este repositorio (`observatorios_cliente`) participa en un ecosistema de **tres repositorios separados**.

## Límites de responsabilidad
- **Cliente (este repo)**: UI, navegación, validaciones, consumo de APIs.
- **observatorios_crud**: CRUD y persistencia de dominio.
- **Gestor Documental**: binarios; el cliente lo consume directamente para
  carga/reemplazo/eliminación y el CRUD para la consulta del visor.
- **observatorios_mid**: componentes legados, no flujo principal.

## Integraciones críticas
1. Cliente -> CRUD (`api/v1/*`).
2. Cliente -> Gestor Documental para mutaciones y Cliente -> CRUD
   (`campos/datos/*`, `campos/documentos/*`).
3. CRUD -> Gestor Documental para la consulta validada del visor.
4. Cliente -> MID solo desde componentes legados con base no configurada.
