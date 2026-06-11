# Arquitectura distribuida SDD (referencia local)

## Contexto
Este repositorio (`observatorios_cliente`) participa en un ecosistema de **tres repositorios separados**.

## Límites de responsabilidad
- **Cliente (este repo)**: UI, navegación, validaciones, consumo de APIs.
- **observatorios_crud**: CRUD y persistencia de dominio.
- **observatorios_mid**: flujo documental e integraciones externas.

## Integraciones críticas
1. Cliente -> CRUD (`api/v1/*`).
2. Cliente -> MID (`POST/PUT /api/v1/documento`).
