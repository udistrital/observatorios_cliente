# Flujos funcionales y técnicos — observatorios_cliente

> Estado: resumen. Las secuencias y riesgos canónicos están en
> [`sdd/arquitectura-as-is.md`](sdd/arquitectura-as-is.md).

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
1. Usuario autenticado ingresa a `/procesos`; `/espacios` redirige allí.
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

## Flujo activo: gestión documental desde UI
### Objetivo
Registrar o actualizar documento asociado a datos de estructura.

### Componentes involucrados
- `src/components/tablero/Tablero.vue`.
- Gestor Documental configurado por `GESTOR_DOCUMENTAL`.
- `observatorios_crud` mediante `/campos/datos/...`.

### Flujo principal
1. Usuario selecciona archivo y metadatos.
2. UI convierte el archivo a base64 y lo envía al Gestor Documental.
3. UI recibe el hash y registra metadatos en el CRUD.
4. UI actualiza tabla o informa fallo; no hay transacción entre servicios.

### Pendientes o brechas
- El contrato del Gestor no está disponible localmente.
- Puede quedar un binario huérfano si falla la escritura posterior.
- `components/archivos/` conserva un flujo MID legado con base vacía.
