# Matriz de interacciones AS-IS

Referencia: checkouts locales con cliente `PROY-TOBE-009` y CRUD
`PROY-TOBE-008`, inspeccionados el 2026-11-12.

| ID | Estado | Origen | Destino | Disparador/contrato | Respuesta y actualización UI | Fallos/efectos | Evidencia |
|---|---|---|---|---|---|---|---|
| INT-CLI-001 | [VERIFICADO] activo | Router/App | OAS | Web component entrega token/usuario. | Store de usuario y navegación. | Hidratación asíncrona; espera finita. | `App.vue`; `router/index.js`; `userStore.js` |
| INT-CLI-002 | [VERIFICADO] activo | Pantallas de jerarquía | CRUD | REST sobre procesos, factores, características, aspectos y estructuras usando `MAIN_BACKEND`. | Recarga listas/stores y muestra diálogo. | Error heterogéneo; Bearer solo desde `localStorage`. | `src/service/*.service.js`; componentes de dominio |
| INT-CLI-003 | [VERIFICADO] activo | Tablero | CRUD | Campos y registros en `/campos/...`; `tipo_campo: link` envía URL HTTP(S) o `null`. | Actualiza estructura, tabla y paginación; representa enlaces seguros. | ID posicional, rechazo 400 de URL inválida; limpieza elimina solo metadatos. | `campos.service.js`; `Tablero.vue`; `utils/enlaces.js` |
| INT-CLI-004 | [VERIFICADO] activo | Tablero | Gestor Documental | `POST document/uploadAnyFormat` con arreglo y base64. | Extrae enlace y continúa por INT-CLI-003. | Si falla CRUD puede quedar archivo huérfano. | `gestorDocumentalService.js`; `Tablero.vue` |
| INT-CLI-005 | [VERIFICADO] activo | Tablero | CRUD | POST `/campos/documentos/referencias/` con proceso, factor, estructura, documento y Bearer. | Recibe `{referencia}`, abre `/documentos/{referencia}` sin `window.opener`. | 400/401/404/429/503; cierra la pestaña si falla. CRUD no valida JWT ni ACL por proceso. | `Tablero.vue`; `campos.service.js` |
| INT-CLI-006 | [VERIFICADO] activo | Tablero | Gestor Documental | `DELETE document/{hash}` después de eliminar/reemplazar metadato. | Confirma o advierte operación parcial. | Puede quedar binario huérfano. | `Tablero.vue`; servicio Gestor |
| INT-CLI-007 | [VERIFICADO] activo | Panel/administración | CRUD | Dashboards, gráficos, constructor y observatorios. | Actualiza paneles/diálogos. | Rutas de gráfica permitidas a no admin; backend sin autorización verificada. | `components/panel/`; `components/administracion/` |
| INT-CLI-008 | [VERIFICADO] legado / [INFERIDO] no operativo | Componentes `archivos/` | MID | `POST/PUT /documento` sobre base vacía. | Pretende registrar evidencia. | Mismo origen, sin Bearer; MID usa `datosArchivo` incompatible. | `AgregarArchivo.vue`; `RegistroArchiGestion.vue`; MID local |
| INT-CLI-009 | [VERIFICADO] activo | Visor | CRUD | GET `/campos/documentos/{referencia}/` con Bearer. | Recibe JSON y representa PDF/Word/Excel localmente sin cambiar el renderizado. | 401/403/404/413/429/502/503/504; timeout cliente 240 s. Referencia transferible durante TTL. | `DocumentoVisor.vue`; `campos.service.js`; `documentViewer.js` |
| INT-CLI-010 | [VERIFICADO] indirecto | CRUD | Gestor Documental | CRUD revalida ES y GET fijo `document/{documento_id}` con Bearer reenviado. | JSON sujeto a límite/spool antes del 200. | El Gestor decide permisos; una credencial amplia conserva acceso directo como riesgo residual. | CRUD `PROY-TOBE-008`; OpenAPI CRUD |
| INT-CLI-011 | [VERIFICADO] legado | `components/archivos/ArchivosVista.vue` | Gestor Documental | GET directo `document/{hash}` del componente anterior. | Pretende mostrar el archivo en el módulo legado. | No pertenece al visor activo ni pasa por la referencia cifrada del CRUD. | `ArchivosVista.vue`; `gestorDocumentalService.js` |

## Compatibilidad

- Cambios de contrato deben actualizar esta matriz, servicios, contrato CRUD y
  criterios de aceptación de la spec afectada.
- El control visual por rol no sustituye autorización del API.
- `GESTOR_DOCUMENTAL` sigue gobernando carga/reemplazo/eliminación; no debe
  interpretarse como destino directo del visor activo ni como MID.
- No se copian URLs de ambientes ni tokens en documentación.
