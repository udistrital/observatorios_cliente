# PROY-ASIS-003 — Consumo UI del flujo documental hacia MID

> Estado: histórico/legado. El flujo activo está en
> [`PROY-ASIS-008_tablero_y_documentos.md`](PROY-ASIS-008_tablero_y_documentos.md).
> Los componentes bajo `components/archivos/` conservan una URL base vacía y no
> representan el camino principal. El visor activo usa CRUD
> `/campos/documentos/*`; no consulta MID ni Gestor directamente.

## Historia de Usuario (AS-IS)
**Como** usuario del módulo documental
**Quiero** cargar y actualizar documentos desde la UI
**Para** mantener evidencia asociada a registros del observatorio.

## Criterios de aceptación funcionales
1. La UI construye requests documentales con bearer token cuando existe.
2. La UI consume operaciones HTTP documentales y retorna payload al componente.
3. La UI informa errores de integración de forma controlada.

---

## Problema funcional
La estrategia documental coexistía con múltiples clientes HTTP y requería consolidación AS-IS vigente.

## Objetivo del usuario
Estandarizar referencia del consumo documental para futuras mejoras TO-BE.

## Impacto institucional
- Reduce ambigüedad entre integración con MID y gestor documental.
- Mejora trazabilidad del flujo documental inter-repo.

---

## Soporte técnico
### Contrato observado
- Base URL documental desde `environment.GESTOR_DOCUMENTAL`.
- Tipo de documento para carga en gestor documental desde `environment.ID_TIPO_DOCUMENTO_GESTOR_DOCUMENTAL`.
- Métodos: `gestorGet`, `gestorPost`, `gestorPut`, `gestorDelete`.

### Evidencia verificable
- `src/service/gestorDocumentalService.js`
- `src/environments/environment*.js`
- `src/components/archivos/AgregarArchivo.vue`
- `src/components/archivos/RegistroArchiGestion.vue`
- `src/components/tablero/Tablero.vue`

### Riesgos
- Doble estrategia HTTP (`conexion_api` + `gestorDocumentalService`) puede generar divergencia de comportamiento.
- Confundir estos componentes con el tablero activo puede reintroducir contratos
  MID antiguos o un GET directo que omita la validación del CRUD.

### Distinción vigente
- `Tablero.vue` usa Gestor directamente para carga/reemplazo/eliminación y CRUD
  para metadatos y visualización.
- `DocumentoVisor.vue` usa `campos.service.js` con una referencia `v1_`.
- MID solo aparece en componentes legados y no participa en el flujo activo.
