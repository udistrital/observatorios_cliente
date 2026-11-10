# AGENTS.md - Guia tecnica de observatorios_cliente

## Proposito del repositorio

`observatorios_cliente` es la SPA del sistema Observatorios. Presenta la jerarquia de procesos, factores, caracteristicas, aspectos y estructuras de evidencia; valida entradas en la interfaz; administra navegacion y estado local; y consume los servicios HTTP del ecosistema.

Este repositorio es responsable del cliente. La persistencia del dominio corresponde a `observatorios_crud` y los binarios documentales se envian al servicio configurado como `GESTOR_DOCUMENTAL`.

## Tecnologias verificadas

- Vue 3 con componentes `.vue` y Composition API.
- JavaScript ES modules; no hay TypeScript.
- Vite 6 como servidor de desarrollo y herramienta de build.
- Vue Router 4 con historial HTML5 y guarda global.
- Vuetify 3 para componentes de interfaz.
- Pinia 2 y `pinia-plugin-persistedstate` para estado.
- Axios para peticiones HTTP.
- SweetAlert2 para dialogos y mensajes.
- Vitest como runner de pruebas.
- npm y `package-lock.json` para dependencias.

Las versiones declaradas se consultan en `package.json`; las resoluciones exactas dependen de `package-lock.json`.

## Archivos que se deben leer primero

1. `README.md`: instalacion, ambientes y operacion para desarrolladores.
2. `package.json`: unica fuente de scripts npm disponibles.
3. `src/router/index.js`: rutas, compatibilidad de rutas antiguas y control de acceso.
4. `src/environments/environment.*.js`: URLs y configuracion seleccionada por ambiente.
5. `src/service/conexion_api.js`: cliente general de `observatorios_crud`.
6. `src/service/gestorDocumentalService.js`: cliente del Gestor Documental.
7. `docs/README.md`: índice canónico de arquitectura, frontend, operación y SDD.
8. `docs/specs/README.md` y `docs/specs/backlog_specs.md`: reglas SDD y cambios planificados.
9. `docs/sdd/matriz_interacciones.md`: contratos entre repositorios.

Para Estructuras Documentales tambien se deben leer `src/components/tablero/Tablero.vue`, `src/service/campos.service.js`, `src/service/estructuras-evidencias.service.js` y `src/stores/estructuraStore.js`.

## Estructura del proyecto

```text
src/
|-- assets/          Recursos estaticos usados por la aplicacion.
|-- components/      Componentes agrupados por funcionalidad.
|-- environments/    Configuraciones local, pruebas, produccion y archivo activo.
|-- model/           Transformaciones y modelos JavaScript de payloads del API.
|-- plugins/         Configuracion de plugins como Vuetify.
|-- router/          Rutas y guarda global de autenticacion/autorizacion.
|-- service/         Clientes Axios y servicios de dominio.
|-- stores/          Stores de Pinia.
|-- utils/           Utilidades compartidas, incluidas reglas de roles.
|-- views/           Vistas asociadas a rutas.
|-- App.vue          Componente raiz e integracion con autenticacion OAS.
`-- main.js          Creacion de Vue, Pinia, router, Vuetify y plugins.
```

`components/` contiene, entre otros, los modulos `aspectos/`, `estructuras/`, `tablero/` y `archivos/`. El flujo vigente de una estructura Documental esta en `components/tablero/Tablero.vue`; `components/archivos/` conserva una ruta y componentes legados y no representa el flujo principal.

## Rutas y autenticacion

`src/router/index.js` define las rutas. La gestion actual de una estructura usa:

```text
/procesos/:proceso_id/factores/:factor_id/estructuras/gestion
/procesos/:proceso_id/factores/:factor_id/estructuras
/procesos/:proceso_id/factores/:factor_id/tablero?estructura_id=<id>
```

Existen rutas antiguas sin `proceso_id`; se conservan por compatibilidad. Las rutas desconocidas redirigen a `/procesos`.

`App.vue` integra el web component `ng-uui-oas`. La guarda global espera un `access_token` y los roles del usuario. El rol administrativo se normaliza y valida mediante `src/utils/roles.js`; las acciones de escritura de estructuras se muestran solo a `ADMIN_OBSERVATORIOS`.

Los servicios Axios agregan `Authorization: Bearer <access_token>` cuando el token esta en `localStorage`. La guarda y `gestorDocumentalService.js` tambien reconocen `sessionStorage`; los demas clientes HTTP aun no lo hacen. No agregue otro mecanismo de autenticacion sin revisar esta diferencia y el contrato OAS.

## Flujo habitual de una funcionalidad

```text
Vista de src/views/
  -> componente de src/components/
  -> validacion y adaptacion del formulario
  -> servicio de src/service/
  -> Axios con URL del ambiente y Bearer token
  -> API correspondiente
  -> normalizacion de respuesta/modelo
  -> actualizacion de Pinia o estado del componente
  -> Vuetify/SweetAlert2
```

Los servicios de dominio no estan totalmente centralizados: algunos crean su propia instancia Axios y el tablero tambien usa `conexion_api.js`, `campos.service.js` y `gestorDocumentalService.js`. Reutilice el patron de la funcionalidad que modifica y evite introducir un cuarto cliente HTTP.

## Integracion con observatorios_crud

- URL base: `environment.MAIN_BACKEND`.
- Local: `http://localhost:8000/api/v1`.
- Pruebas y produccion: gateway OAS configurado en cada archivo de ambiente.
- Cliente general: `src/service/conexion_api.js`.
- Formato habitual: JSON; `conexion_api.js` reconoce `FormData`, aunque el flujo documental vigente no lo usa.
- Errores del cliente general: registra el error, muestra `response.data.detail` o un mensaje generico y relanza la excepcion.

No concatene `/api/v1` a mano si ya esta incluido en `MAIN_BACKEND`. Antes de cambiar un payload compruebe la ruta real en `observatorios_crud` y todos sus consumidores.

## Estructuras Documentales - estado actual

### Ubicacion y modelo

- Gestion de jerarquia: `src/components/aspectos/AspectosSection.vue` y componentes de `src/components/estructuras/`.
- Vista de registros: `src/views/Tablero.vue` y `src/components/tablero/Tablero.vue`.
- Estructuras: `src/service/estructuras-evidencias.service.js`.
- Campos y registros: `src/service/campos.service.js`.
- Binarios: `src/service/gestorDocumentalService.js`.
- Estado seleccionado: `src/stores/estructuraStore.js`.

Una estructura admite `tipo_evidencia` `Documental` o `Tabla`. En una estructura Documental, el cliente crea y oculta un campo reservado `hash`; los demas campos son metadatos configurables.

### Flujo de carga vigente

```text
Tablero.vue
  -> valida formulario y archivo PDF, Word o Excel
  -> FileReader convierte el archivo completo a base64
  -> POST GESTOR_DOCUMENTAL/document/uploadAnyFormat
  -> extrae Enlace/hash de la respuesta
  -> POST MAIN_BACKEND/campos/datos/{estructura_id}/
  -> observatorios_crud guarda metadatos y hash en Elasticsearch
```

El payload al Gestor Documental es un arreglo con `IdTipoDocumento`, nombre original, metadatos de contexto, descripcion y `file` base64. `ID_TIPO_DOCUMENTO_GESTOR_DOCUMENTAL` cambia por ambiente. No se usa `FormData` en este flujo.

La interfaz acepta `.pdf`, `.doc`, `.docx`, `.xls` y `.xlsx`, validando la extension y el MIME cuando el navegador informa uno especifico. La comprobacion esta en `abrirFormularioDocumento()` dentro de `Tablero.vue`; no hay limite de tamano implementado en este repositorio.

### Consulta, visualizacion y descarga

`verArchivoDocumental()` abre la ruta autenticada `/documentos/:hash` en otra pestana. La vista consulta `GET GESTOR_DOCUMENTAL/document/{hash}` con bearer token y procesa localmente PDF, Word y Excel en modo de solo lectura. No envia el binario al CRUD, no convierte Office a PDF y no usa visores externos.

### Actualizacion

La metadata puede actualizarse sin reemplazar el archivo. Si se selecciona otro archivo permitido:

1. Se sube el archivo nuevo al Gestor Documental.
2. Se actualiza el registro con `PUT /campos/datos/{estructura_id}/{registro_id}/`.
3. Se elimina el hash anterior con `DELETE GESTOR_DOCUMENTAL/document/{hash}`.
4. Si falla la actualizacion del registro, se intenta eliminar el archivo nuevo.

### Eliminacion y restricciones

La eliminacion individual borra primero el registro del CRUD y luego intenta borrar el binario del Gestor Documental. Un fallo en el segundo paso puede dejar un archivo huerfano. La limpieza completa de una estructura elimina registros del CRUD, pero no elimina uno a uno sus binarios.

Solo administradores pueden cargar, editar, reemplazar o eliminar desde la interfaz. El cliente no reemplaza controles de autorizacion del servidor. Los componentes de `src/components/archivos/` usan contratos legados y no deben confundirse con el tablero vigente.

## Variables y ambientes

No se usan archivos `.env` ni variables `VITE_*`. Los scripts copian uno de estos archivos sobre `src/environments/environment.js`, archivo activo ignorado por Git:

- `environment.local.js`
- `environment.pruebas.js`
- `environment.producion.js` (nombre existente, conservar su ortografia)

Claves relevantes:

- `MAIN_BACKEND`: base de `observatorios_crud`.
- `GESTOR_DOCUMENTAL`: base del servicio de binarios.
- `ID_TIPO_DOCUMENTO_GESTOR_DOCUMENTAL`: tipo documental enviado al gestor.
- `TOKEN`: configuracion publica de autenticacion/redireccion OAS.
- `CONFIGURACION_SERVICE` y `ASSETS_SERVICE`: servicios OAS auxiliares.

No documente ni agregue secretos al repositorio. Una compilacion limpia debe usar un script `build:<ambiente>` para generar primero `environment.js`; `npm run build` supone que ese archivo ya existe.

## Comandos disponibles

Ejecute solo scripts definidos en `package.json`:

```bash
npm install             # instala dependencias del lockfile disponible
npm run dev             # ambiente local, Vite en 127.0.0.1:4200
npm run dev:local       # equivalente explicito de dev
npm run dev:pruebas     # configuracion de pruebas en el puerto 4200
npm run dev:prod        # configuracion de produccion en el puerto 4200
npm run build           # build con environment.js ya generado
npm run build:local     # genera environment.js local y compila
npm run build:pruebas   # genera environment.js de pruebas y compila
npm run build:prod      # genera environment.js de produccion y compila
npm run preview         # sirve el contenido compilado con Vite Preview
npm run test            # inicia Vitest
```

No existe script `lint`. No afirme que se ejecuto lint si no se incorpora una herramienta y un script verificables.

## Reglas para agentes

- Inspeccione componente, servicio, store, ruta y ambiente antes de editar.
- Distinga el tablero documental vigente de los componentes legados en `components/archivos/`.
- Reutilice servicios, modelos visuales y mensajes existentes.
- No invente endpoints, variables, respuestas ni campos retornados por el Gestor Documental.
- No cambie un contrato HTTP sin revisar el API y la matriz de interacciones.
- No mueva almacenamiento binario al CRUD: el flujo actual separa binarios y metadatos/hash.
- Mantenga compatibilidad con PDF y con las rutas legadas salvo instruccion contraria.
- Evite refactors, cambios visuales o dependencias fuera del alcance.
- Toda evolucion funcional debe tener spec TO-BE en `docs/specs/`, entrada de backlog y trazabilidad en `docs/sdd/matriz_interacciones.md` cuando cambie una integracion.
- Marque como **INFERENCIA** cualquier comportamiento no comprobable en codigo o configuracion.
- Revise errores de red y consola del navegador, ademas del resultado visual.

## Checklist para agentes

Antes de modificar:

- Leer `AGENTS.md`, `README.md` y las reglas SDD.
- Identificar la ruta, vista y componente activos.
- Identificar servicios, store, endpoint y payload reales.
- Revisar el archivo de ambiente del escenario objetivo.
- Confirmar que no se esta editando un flujo legado por error.
- Revisar el contrato en el repositorio que expone el API.

Despues de modificar:

- Ejecutar `npm run build:local`.
- Ejecutar `npm run test -- --run` si el entorno de pruebas esta disponible.
- Probar la ruta en `http://127.0.0.1:4200`.
- Probar caso exitoso, validaciones y errores HTTP.
- Revisar consola del navegador y peticiones de red.
- Verificar autenticacion, permisos e integracion con los servicios configurados.
- Actualizar spec, matriz y documentacion si cambio el comportamiento.
