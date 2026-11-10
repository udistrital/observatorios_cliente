# Observatorios Cliente

## Descripcion

`observatorios_cliente` es la aplicacion web del sistema Observatorios. Permite navegar procesos, factores, caracteristicas y aspectos; administrar estructuras de evidencia; capturar datos tabulares; y registrar evidencias documentales.

La aplicacion consume `observatorios_crud` para datos del dominio. En el flujo documental activo, los metadatos y el hash se registran en el CRUD, mientras el archivo binario se envia al Gestor Documental configurado para el ambiente.

La guia operativa para agentes de codigo esta en `AGENTS.md`. Las especificaciones funcionales se encuentran en `docs/specs/`.

## Tecnologias

- Vue 3 y JavaScript ES modules.
- Vite 6.
- Vue Router 4.
- Vuetify 3.
- Pinia 2 con persistencia.
- Axios 1.
- SweetAlert2.
- Vitest 3.
- npm con `package-lock.json`.

Consulte `package.json` y `package-lock.json` para las versiones declaradas y resueltas. El proyecto no usa TypeScript.

## Requisitos

- Node.js compatible con Vite 6.
- npm.

El repositorio no define `engines` en `package.json` ni incluye `.nvmrc`, por lo que no fija una version exacta de Node.js. La integracion continua usa Node.js 18 y la dependencia Vite instalada declara compatibilidad con Node.js 18, 20 y 22 o superior dentro de sus rangos soportados.

No hay configuracion para pnpm o Yarn; use npm para mantener coherencia con el lockfile.

## Instalacion

Desde el workspace:

```bash
cd observatorios_cliente
npm install
```

## Ejecucion local

```bash
npm run dev
```

El comando:

- copia `src/environments/environment.local.js` a `src/environments/environment.js`;
- inicia Vite en `http://127.0.0.1:4200`;
- configura `MAIN_BACKEND` como `http://localhost:8000/api/v1`.

Para completar los flujos de datos debe estar disponible `observatorios_crud` en el puerto 8000. La autenticacion y el Gestor Documental local siguen apuntando a los servicios OAS definidos en `environment.local.js`.

## Ambientes

La configuracion no usa `.env`. Cada script copia un modulo JavaScript sobre `src/environments/environment.js`, que es el archivo importado por la aplicacion.

| Ambiente | Desarrollo | Build | Archivo fuente |
|---|---|---|---|
| Local | `npm run dev` o `npm run dev:local` | `npm run build:local` | `environment.local.js` |
| Pruebas | `npm run dev:pruebas` | `npm run build:pruebas` | `environment.pruebas.js` |
| Produccion | `npm run dev:prod` | `npm run build:prod` | `environment.producion.js` |

Todos los comandos de desarrollo usan `127.0.0.1:4200`. Entre ambientes cambian principalmente las redirecciones de autenticacion, `MAIN_BACKEND` y `ID_TIPO_DOCUMENTO_GESTOR_DOCUMENTAL`.

Variables de configuracion relevantes:

- `MAIN_BACKEND`: URL base del CRUD.
- `GESTOR_DOCUMENTAL`: URL base del servicio documental.
- `ID_TIPO_DOCUMENTO_GESTOR_DOCUMENTAL`: identificador enviado durante la carga.
- `TOKEN`: URLs y datos publicos del flujo de autenticacion OAS.
- `CONFIGURACION_SERVICE` y `ASSETS_SERVICE`: servicios auxiliares.

No agregue secretos a estos archivos.

## Estructura del proyecto

```text
src/
|-- assets/          recursos estaticos
|-- components/      interfaz agrupada por funcionalidad
|-- environments/    configuracion por ambiente
|-- model/           modelos y transformaciones de payloads
|-- plugins/         plugins de Vue, como Vuetify
|-- router/          rutas y guarda de acceso
|-- service/         clientes HTTP y servicios del dominio
|-- stores/          estado Pinia
|-- utils/           utilidades compartidas
|-- views/           paginas asociadas a rutas
|-- App.vue          componente raiz y autenticacion OAS
`-- main.js          inicializacion de la aplicacion
```

Las funcionalidades de estructura se reparten entre `components/aspectos/`, `components/estructuras/` y `components/tablero/`. `components/archivos/` contiene una implementacion legada que permanece enrutable, pero el flujo documental actual se gestiona desde el tablero.

## Integracion con APIs

`src/service/conexion_api.js` crea el cliente general para `MAIN_BACKEND`. Los servicios de dominio usan Axios y agregan un Bearer token obtenido de `localStorage`.

`src/service/gestorDocumentalService.js` crea un cliente separado para `GESTOR_DOCUMENTAL`, también con Bearer token y un timeout de 100 segundos.

La URL base de cada servicio se selecciona en `src/environments/`. El frontend no usa un proxy de Vite.

## Estructuras Documentales

Una estructura Documental permite asociar un archivo y metadatos configurables a un aspecto. Se accede desde la jerarquia del factor y se administra en la ruta de tablero con el parametro `estructura_id`.

Flujo vigente:

1. El administrador crea o selecciona una estructura de tipo `Documental`.
2. El cliente garantiza un campo reservado `hash`.
3. El usuario selecciona un PDF, Word o Excel y completa los metadatos.
4. El cliente convierte el archivo a base64 y llama `document/uploadAnyFormat` del Gestor Documental.
5. El hash retornado se registra junto con los metadatos en `observatorios_crud` mediante `/campos/datos/{estructura_id}/`.
6. Para consultar el archivo, el cliente abre `/documentos/{hash}` en una pestana nueva, solicita `document/{hash}` con bearer token y procesa localmente PDF, Word o Excel en modo de solo lectura, sin convertir el original ni enviarlo a servicios externos.

La interfaz acepta PDF (`.pdf`), Word (`.doc`, `.docx`) y Excel (`.xls`, `.xlsx`). No hay limite de tamano implementado en el cliente. La metadata se puede editar sin reemplazar el archivo; el reemplazo y la eliminacion coordinan llamadas al Gestor Documental y al CRUD.

## Scripts disponibles

Los scripts reales de `package.json` son:

| Comando | Funcion |
|---|---|
| `npm run dev` | Desarrollo con configuracion local en el puerto 4200. |
| `npm run dev:local` | Alias explicito del desarrollo local. |
| `npm run dev:pruebas` | Desarrollo con configuracion de pruebas. |
| `npm run dev:prod` | Desarrollo con configuracion de produccion. |
| `npm run build` | Compila usando el `environment.js` existente. |
| `npm run build:local` | Selecciona ambiente local y compila. |
| `npm run build:pruebas` | Selecciona ambiente de pruebas y compila. |
| `npm run build:prod` | Selecciona ambiente de produccion y compila. |
| `npm run preview` | Sirve una compilacion con Vite Preview. |
| `npm run test` | Inicia Vitest. |

No existe un script de lint.

## Pruebas

```bash
npm run test -- --run
```

Vite configura Vitest con entorno `jsdom`, declarado como dependencia directa. `src/utils/documentViewer.spec.js` contiene cinco pruebas de utilidades del visor; no se identificaron pruebas del router, servicios, stores o componentes.

## Build

Para una compilacion reproducible de produccion:

```bash
npm run build:prod
```

El resultado se genera en `dist/`. `npm run build` por si solo requiere que `src/environments/environment.js` ya exista; en un checkout limpio es preferible uno de los scripts `build:<ambiente>`.

El `Dockerfile` compila la SPA y la sirve con Nginx. `docker-compose-prod.yml` publica el puerto 80 del contenedor en el puerto 4200 del host.

## Problemas comunes

### La aplicacion no esta en el puerto 5173

El proyecto fija el puerto 4200 en sus scripts. Abra `http://127.0.0.1:4200`.

### Falla la importacion de `src/environments/environment.js`

Ese archivo es generado e ignorado por Git. Ejecute `npm run dev`, `npm run dev:<ambiente>` o `npm run build:<ambiente>` antes de usar el build generico.

### El cliente no puede consultar el CRUD local

Confirme que `observatorios_crud` responda en `http://localhost:8000` y que el script activo haya copiado `environment.local.js`.

### Una sesion permite navegar pero las APIs responden sin autorizacion

La guarda de rutas y el cliente del Gestor Documental aceptan tokens de `localStorage` y `sessionStorage`; los demas clientes Axios leen `localStorage`. Verifique donde fue almacenado `access_token`.

### Las pruebas solicitan `jsdom`

La configuración de Vitest usa ese entorno y el paquete está declarado. Si la ejecución falla, registre la versión de Node/npm y el error real; no agregue dependencias sin una necesidad comprobada.

## Licencia

Este proyecto se distribuye bajo GNU General Public License, version 3 o posterior. Consulte el texto de la GPL para sus condiciones.
