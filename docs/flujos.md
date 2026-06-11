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
2. UI consulta procesos como primer nivel jerárquico.
3. Usuario selecciona un proceso y la UI muestra factores asociados.
4. UI registra/actualiza/elimina procesos y factores según permisos.
5. Se reflejan cambios en tablas/indicadores.

## Flujo: Navegación jerárquica de procesos
### Objetivo
Exponer la jerarquía funcional desde procesos antes de ingresar a factores y estructuras.

### Componentes involucrados
- `src/views/Espacios.vue`.
- `src/components/procesos/ProcesoFactores.vue`.
- `src/service/procesos.service.js`.
- `src/service/factores.service.js`.
- API `observatorios_crud`.

### Flujo principal
1. Usuario autenticado ingresa a `/espacios`.
2. UI consulta `/procesos/` y muestra procesos activos.
3. Usuario selecciona un proceso.
4. UI navega a `/procesos/:proceso_id/factores`.
5. UI consulta `/factores/` y filtra por `proceso_id`.
6. Usuario selecciona factor para continuar al flujo de estructuras existente.

### Convención de rutas
- Ruta principal canónica: `/procesos`.
- Ruta de factores por proceso: `/procesos/:proceso_id/factores`.
- Rutas hijas de factor: `/procesos/:proceso_id/factores/:factor_id/...`.
- Rutas anteriores como `/espacios`, `/factor/:factor_id`, `/estructuras/:factor_id`, `/tablero/:factor_id` y `/:factor_id/panel` se mantienen como compatibilidad mientras se completa la transición.

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
