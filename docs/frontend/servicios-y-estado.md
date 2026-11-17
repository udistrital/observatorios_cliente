# Servicios HTTP y estado AS-IS

## Clientes y autenticación

| Cliente | Base | Token | Uso |
|---|---|---|---|
| `conexion_api.js` | `MAIN_BACKEND` | Solo `localStorage` | Helper `peticionAPI` usado por componentes |
| Servicios de procesos/factores/características/aspectos/estructuras | `MAIN_BACKEND` | Solo `localStorage` | Operaciones de dominio |
| `campos.service.js` | `MAIN_BACKEND` | `localStorage` o `sessionStorage` | Campos/registros y visualización validada; GET documental con timeout 240 s |
| `gestorDocumentalService.js` | `GESTOR_DOCUMENTAL` | `localStorage` o `sessionStorage` | Carga, reemplazo y eliminación de binarios; timeout 100 s |
| `fetch` legado | base local vacía o Gestor | Inconsistente | Componentes `archivos/` |

[VERIFICADO] No hay interceptor central de 401, renovación, cancelación ni timeout
general del CRUD. `peticionAPI` relanza errores después de mostrar un diálogo; el
consumidor puede mostrar otro.

## Inventario de contratos consumidos

`MAIN_BACKEND` ya contiene `/api/v1`; las rutas siguientes son relativas.

| Familia | Métodos y rutas consumidos o declarados | Consumidor principal |
|---|---|---|
| Procesos | `GET/POST procesos/`; `GET/PUT/PATCH/DELETE procesos/{id}/` | `procesos.service.js`, `Espacios.vue` |
| Factores | `GET/POST factores/`; `GET/PUT/PATCH/DELETE factores/{id}/` | `factores.service.js`, `ProcesoFactores.vue` |
| Características | `GET/POST caracteristicas/`; `GET/PUT/PATCH/DELETE caracteristicas/{id}/` | servicio y componentes; PUT declarado sin consumidor directo |
| Aspectos | `GET/POST aspectos/`; `GET/PUT/PATCH/DELETE aspectos/{id}/` | servicio y `AspectosSection.vue`; PUT declarado sin consumidor directo |
| Estructuras | `GET/POST estructuras-evidencias/`; `GET/PATCH/DELETE estructuras-evidencias/{id}/` | servicio de estructuras |
| Campos | `GET campos/tipos`; `GET/POST campos/estructuras/`; `GET/PATCH/PUT/DELETE campos/estructuras/{id}/` | `campos.service.js`; GET detalle declarado sin consumidor directo |
| Registros | `GET/POST/DELETE campos/datos/{estructura}/`; `PUT/PATCH/DELETE campos/datos/{estructura}/{registro}/` | `campos.service.js`, `Tablero.vue`; PATCH declarado sin consumidor directo |
| Visualización documental | `POST campos/documentos/referencias/`; `GET campos/documentos/{referencia}/` | `campos.service.js`, `Tablero.vue`, `DocumentoVisor.vue` |
| Legado de datos | `GET/POST datos/{estructura}/`; `GET datosArchivo/{estructura}/`; `DELETE datosArchivo/{estructura}/{registro}/` | componentes antiguos |
| Observatorios | `GET/POST observatorios/`; `PUT/DELETE observatorios/{id}/` | administración |
| Dashboards | `GET/POST dashboards/`; `PUT/DELETE dashboards/{id}/` | paneles |
| Gráficos | `GET/POST graficos/{panel}/`; `PUT/DELETE graficos/{panel}/{grafico}/`; `GET .../construir/` | panel/gráficas |
| Constructor | GET configuración/campos/tipos; POST prueba | componentes de creación de gráfica |
| Inactivo | `GET agregaciones/observatorios` | componente no enrutado |
| Gestor | `POST document/uploadAnyFormat`; `DELETE document/{hash}` activos; `GET document/{hash}` legado | tablero; GET solo en `components/archivos/ArchivosVista.vue`, no en el visor activo |
| MID legado | `POST/PUT /documento` | `components/archivos/` |

Conteo de auditoría: 60 patrones invocados y 4 declarados sin consumidor directo.
El contrato del proveedor CRUD está en
`../../observatorios_crud/docs/api/openapi.yaml` cuando ambos repositorios son
hermanos; la referencia estable remota debe fijarse al commit de entrega.

## Flujo a interfaz

| Acción | Servicio | Tratamiento observable |
|---|---|---|
| Listados jerárquicos | Servicios de dominio | Asigna colecciones, filtra y cierra loaders; algunos errores generan doble diálogo. |
| Alta/edición | Servicio o `peticionAPI` | SweetAlert/Vuetify confirma, llama API y recarga lista. |
| DELETE con 204 | `peticionAPI` | El helper trata especialmente 200; 204 puede retornar `undefined`. |
| Carga documental | Gestor y luego campos | Extrae enlace, crea registro y refresca; alta sin compensación si falla CRUD. |
| Visualización documental | CRUD referencia y luego CRUD contenido | Envía cuatro IDs, abre `/documentos/{referencia}` y conserva renderizado local; no consulta Gestor/MID directamente. |
| Reemplazo documental | Gestor, CRUD, Gestor | Sube nuevo, actualiza registro y elimina anterior; intenta borrar nuevo si falla CRUD. |
| Eliminación documental | CRUD y luego Gestor | Puede quedar binario huérfano si falla segunda operación. |
| Limpieza de estructura | CRUD | Vacía registros; no recorre hashes para eliminar binarios. |

## Stores Pinia

| Store | Persistencia | Responsabilidad/riesgo |
|---|---|---|
| `userStore` | No | Usuario recibido asíncronamente desde OAS. |
| `factorStore` | No | Guarda factor; router intenta hidratarlo. |
| `estructuraStore` | No | Tablero puede hidratar por `estructura_id`. |
| `observatorioStore` | No | Paneles pueden depender de un valor ausente en acceso directo. |
| `panelStore` | Sí | Contexto puede quedar obsoleto entre sesiones/navegación. |
| `graficaStore` | Sí | Edición anterior puede persistir. |
| `main` | No | No se identificaron consumidores. |

## Validación

- Procesos/factores: requeridos, orden no negativo y valores numéricos.
- Jerarquía: validación mediante `preConfirm` en SweetAlert.
- Tablero: tipos, fechas, booleanos, JSON, duplicados, nombres y formatos
  documentales.
- [VERIFICADO] Solo 5 de 16 `v-form` llaman explícitamente `.validate()`.
- [VERIFICADO] No hay límite de tamaño antes de convertir el archivo completo a
  base64.
- [VERIFICADO] La referencia opaca no es autorización: puede transferirse durante
  el TTL, el CRUD solo valida sintaxis Bearer y el Gestor decide sobre el Bearer
  reenviado.
- [NO VERIFICADO] Validación y saneamiento equivalentes en proveedores.
