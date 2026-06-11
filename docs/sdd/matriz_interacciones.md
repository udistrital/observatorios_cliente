# Matriz de interacciones (AS-IS)

| Origen | Destino | Contrato observado | Riesgo | Evidencia |
|---|---|---|---|---|
| observatorios_cliente | observatorios_crud | CRUD `api/v1/...` | Medio | `src/service/conexion_api.js`, `src/eviroments.js` |
| observatorios_cliente | observatorios_mid | `POST/PUT /api/v1/documento`; usa `environment.ID_TIPO_DOCUMENTO_GESTOR_DOCUMENTAL` para `IdTipoDocumento` | Alto | `docs/arquitectura_e_integraciones.md`, `src/environments/environment*.js`, `src/components/archivos/AgregarArchivo.vue`, `src/components/archivos/RegistroArchiGestion.vue` |
| observatorios_cliente | gestor_documental_mid | `POST document/uploadAnyFormat`; usa `environment.ID_TIPO_DOCUMENTO_GESTOR_DOCUMENTAL` para `IdTipoDocumento` | Medio | `src/service/gestorDocumentalService.js`, `src/components/tablero/Tablero.vue`, `src/environments/environment*.js` |

## INFERENCIA y brechas
- **INFERENCIA:** La separación operativa entre consumo a `OBSERVATORIOS_MID` y `GESTOR_DOCUMENTAL` no está completamente formalizada en contrato funcional único dentro del repositorio.
