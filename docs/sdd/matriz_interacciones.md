# Matriz de interacciones AS-IS

Referencia: cliente `8537cb7`, CRUD `3de996b` y MID `92e9ca9`, inspeccionados el
2026-11-10.

| ID | Estado | Origen | Destino | Disparador/contrato | Respuesta y actualización UI | Fallos/efectos | Evidencia |
|---|---|---|---|---|---|---|---|
| INT-CLI-001 | [VERIFICADO] activo | Router/App | OAS | Web component entrega token/usuario. | Store de usuario y navegación. | Hidratación asíncrona; espera finita. | `App.vue`; `router/index.js`; `userStore.js` |
| INT-CLI-002 | [VERIFICADO] activo | Pantallas de jerarquía | CRUD | REST sobre procesos, factores, características, aspectos y estructuras usando `MAIN_BACKEND`. | Recarga listas/stores y muestra diálogo. | Error heterogéneo; Bearer solo desde `localStorage`. | `src/service/*.service.js`; componentes de dominio |
| INT-CLI-003 | [VERIFICADO] activo | Tablero | CRUD | Campos y registros en `/campos/...`. | Actualiza estructura, tabla y paginación. | ID posicional; limpieza elimina solo metadatos. | `campos.service.js`; `Tablero.vue` |
| INT-CLI-004 | [VERIFICADO] activo | Tablero | Gestor Documental | `POST document/uploadAnyFormat` con arreglo y base64. | Extrae enlace y continúa por INT-CLI-003. | Si falla CRUD puede quedar archivo huérfano. | `gestorDocumentalService.js`; `Tablero.vue` |
| INT-CLI-005 | [VERIFICADO] activo | Visor | Gestor Documental | `GET document/{hash}`. | Representa PDF/Word/Excel localmente. | Timeout 100 s; contrato proveedor no disponible. | `DocumentoVisor.vue`; `documentViewer.js` |
| INT-CLI-006 | [VERIFICADO] activo | Tablero | Gestor Documental | `DELETE document/{hash}` después de eliminar/reemplazar metadato. | Confirma o advierte operación parcial. | Puede quedar binario huérfano. | `Tablero.vue`; servicio Gestor |
| INT-CLI-007 | [VERIFICADO] activo | Panel/administración | CRUD | Dashboards, gráficos, constructor y observatorios. | Actualiza paneles/diálogos. | Rutas de gráfica permitidas a no admin; backend sin autorización verificada. | `components/panel/`; `components/administracion/` |
| INT-CLI-008 | [VERIFICADO] legado / [INFERIDO] no operativo | Componentes `archivos/` | MID | `POST/PUT /documento` sobre base vacía. | Pretende registrar evidencia. | Mismo origen, sin Bearer; MID usa `datosArchivo` incompatible. | `AgregarArchivo.vue`; `RegistroArchiGestion.vue`; MID local |

## Compatibilidad

- Cambios de contrato deben actualizar esta matriz, servicios, contrato CRUD y
  criterios de aceptación de la spec afectada.
- El control visual por rol no sustituye autorización del API.
- `GESTOR_DOCUMENTAL` no debe renombrarse ni interpretarse como MID sin evidencia.
- No se copian URLs de ambientes ni tokens en documentación.
