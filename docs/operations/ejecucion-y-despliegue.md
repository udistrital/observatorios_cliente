# Ejecución y despliegue AS-IS

## Referencia

`102cee4` más la implementación local de `PROY-TOBE-009`, inspeccionado el
2026-11-12. No se contactaron servicios externos ni se realizó verificación
end-to-end.

## Requisitos y scripts confirmados

Fuente única: `package.json`.

```bash
npm install
npm run dev
npm run dev:local
npm run dev:pruebas
npm run dev:prod
npm run build
npm run build:local
npm run build:pruebas
npm run build:prod
npm run preview
npm run test -- --run
```

- [VERIFICADO] No existe script `lint`.
- [VERIFICADO] `dev:*` usa `127.0.0.1:4200`.
- [VERIFICADO] `build` presupone `src/environments/environment.js`; los scripts
  por ambiente lo generan mediante copia.
- [VERIFICADO] Vitest usa `jsdom`, declarado como dependencia de desarrollo.

## Configuración por ambiente

No se usan `.env` ni claves `VITE_*`. Los archivos fuente son:

- `src/environments/environment.local.js`
- `src/environments/environment.pruebas.js`
- `src/environments/environment.producion.js`

Nombres documentables: `MAIN_BACKEND`, `GESTOR_DOCUMENTAL`,
`ID_TIPO_DOCUMENTO_GESTOR_DOCUMENTAL`, `TOKEN`, `CONFIGURACION_SERVICE` y
`ASSETS_SERVICE`. No se reproducen valores de ambientes remotos.

## Build y contenedor

- [VERIFICADO] `Dockerfile` usa Node 18 para `npm install` y `npm run build`, luego
  Nginx.
- [VERIFICADO] Un checkout limpio no contiene el `environment.js` ignorado y el
  Dockerfile no ejecuta un script `build:<ambiente>`.
- [VERIFICADO] No hay `.dockerignore`; `COPY . .` puede incorporar artefactos del
  host al contexto.
- [VERIFICADO] `docker-compose-prod.yml` publica 4200 del host hacia 80.
- [VERIFICADO] Nginx tiene fallback SPA, pero no se identificaron CSP ni cabeceras
  adicionales de seguridad.
- [NO VERIFICADO] Build Docker efectivo con el checkout actual.

## CI/CD

- Drone ejecuta Sonar y publica/despliega según rama.
- [VERIFICADO] No ejecuta tests ni lint.
- [VERIFICADO] `develop` no ejecuta un build de entrega en el pipeline observado.
- [VERIFICADO] Node 18 puede divergir de restricciones de dependencias transitivas
  resueltas por el lock; el fallo efectivo no fue reproducido.
- [NO VERIFICADO] Rollback, espera de estabilidad y controles externos.

## Verificaciones seguras

```bash
npm run test -- --run
npm run build:local
```

Vitest cubre utilidades del visor y enlaces. `build:local` modifica el archivo
ignorado `environment.js`, no el código versionado. El 2026-11-12 se ejecutaron con
Node 20.19.1 los 10 casos y el build local; ambos terminaron correctamente. No se
abrió navegador ni se contactaron CRUD, Elasticsearch o Gestor.

## Troubleshooting

| Síntoma | Evidencia y comprobación |
|---|---|
| Falta `environment.js` | Ejecutar un script `dev:*` o `build:*`; no crear configuración ad hoc. |
| Navega pero CRUD no recibe Bearer | La mayoría de servicios CRUD solo lee `localStorage`; `campos.service.js` reconoce también `sessionStorage`. |
| Visor agota tiempo | El GET al CRUD tiene timeout de 240 s; el CRUD limita a 90 s la lectura upstream total antes de servir el spool. Revisar estado HTTP y límites sin registrar referencia ni archivo. |
| UUID antiguo falla en `/documentos/...` | La ruta ahora espera una referencia `v1_` emitida por el POST del CRUD, no el hash del Gestor. |
| Ruta directa de panel falla | Comprobar stores de observatorio/panel y parámetros; algunos no se hidratan. |
| DELETE 204 no retorna datos | `peticionAPI` tiene tratamiento especial de 200. |

## Operación no cubierta

- [NO VERIFICADO] SLO, métricas reales de navegador, monitoreo de errores, CSP del
  gateway, cache/CDN, rollback y recuperación.
- [PROPUESTA] Esos controles requieren definición TO-BE y evidencia de plataforma.
