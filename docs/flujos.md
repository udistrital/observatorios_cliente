# Flujos funcionales y técnicos — observatorios_cliente

## Flujo: Gestión CRUD en UI
### Objetivo
Permitir operación de entidades de observatorios desde interfaz.

### Componentes involucrados
- Vistas y componentes Vue.
- Servicios HTTP del cliente.
- API `observatorios_crud`.

### Flujo principal
1. Usuario autenticado navega a módulo.
2. UI consulta catálogos y datos al CRUD.
3. UI registra/actualiza/elimina según permisos.
4. Se reflejan cambios en tablas/indicadores.

## Flujo: Gestión documental desde UI
### Objetivo
Registrar o actualizar documento asociado a datos de estructura.

### Componentes involucrados
- Componente de carga de archivo (frontend).
- `observatorios_mid` (`/api/v1/documento`).
- `observatorios_crud` (actualización de `datosArchivo` vía MID).

### Flujo principal
1. Usuario selecciona archivo y metadatos.
2. UI envía payload al MID.
3. MID valida, escanea, carga y sincroniza con CRUD.
4. UI recibe resultado y notifica estado.

### Pendientes o brechas
- Especificar payload definitivo y catálogo de errores funcionales consumibles por UI.
