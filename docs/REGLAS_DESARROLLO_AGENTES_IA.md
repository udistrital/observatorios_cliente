# Historia de Usuario
Como equipo de `observatorios_cliente`,
quiero reglas claras para agentes de IA,
para implementar cambios frontend sin romper navegación, permisos ni contratos con `observatorios_crud` y `observatorios_mid`.

## Criterios de aceptación funcionales
1. Debe existir una guía local de reglas para agentes IA.
2. Todo cambio debe declarar actor, flujo y contrato impactado.
3. Debe diferenciar AS-IS vs TO-BE y marcar **INFERENCIA** cuando aplique.
4. Si cambia endpoint/flujo/variables, debe actualizar documentación en el mismo cambio.

---

## Problema funcional
Sin reglas locales, cambios automáticos pueden generar regresiones en rutas, permisos de UI o consumo de APIs inter-repo.

## Objetivo del usuario
Estandarizar la forma en que agentes IA analizan, implementan y documentan cambios del frontend.

## Impacto institucional
- Menos retrabajo en PR.
- Menor riesgo de romper integración con MID/CRUD.
- Mayor trazabilidad funcional-técnica.

---

## Reglas de desarrollo (AS-IS vigente)

### 1) Entrada funcional obligatoria
Antes de editar código, declarar:
1. Actor afectado.
2. Resultado esperado en UI.
3. Contrato impactado (ruta UI, endpoint backend, payload/código HTTP).

### 2) Estructura de código frontend
- Mantener organización por responsabilidad:
  - `src/views/` para pantallas,
  - `src/components/` para componentes reutilizables,
  - `src/stores/` para estado Pinia,
  - `src/service/` para integración HTTP,
  - `src/router/` para navegación y guardas.

### 3) Convenciones de rutas y acceso
- Respetar guard global en `src/router/index.js`.
- Cualquier cambio de permisos por rol debe reflejarse en spec AS-IS/TO-BE.
- Rutas no reconocidas deben conservar fallback a `/espacios` salvo decisión documentada.

### 4) Integraciones HTTP
- Priorizar consistencia entre `conexion_api.js` y `gestorDocumentalService.js`.
- No hardcodear nuevos endpoints en componentes; centralizar en capa `src/service/`.
- Token bearer desde `localStorage` debe manejarse de forma consistente y documentada.

### 5) Seguridad mínima por entorno
- No introducir secretos en código fuente.
- Revisar `src/eviroments.js` al cambiar URLs, flags o endpoints.
- **INFERENCIA:** el archivo de entornos actual contiene valores de prueba embebidos; su hardening depende de política externa de despliegue.

### 6) Pruebas/verificación mínima
Para todo cambio de agente:
1. `npm run build` sin errores.
2. Verificación de navegación del flujo afectado.
3. Verificación de consumo API impactado (CRUD/MID) en escenario funcional.

### 7) No regresión documental
Si cambia:
- ruta de UI,
- regla de acceso por rol,
- endpoint/payload consumido,
- variable de entorno,
actualizar en el mismo cambio:
- `README.md`,
- `docs/specs/*`,
- `docs/sdd/matriz_interacciones.md` si aplica inter-repo.

### 8) Ciclo SDD obligatorio
1. Registrar requerimiento en `docs/specs/backlog_specs.md` con ID `PROY-TOBE-XXX`.
2. Crear/actualizar spec TO-BE correspondiente.
3. Implementar cambio de código.
4. Actualizar spec AS-IS impactada.

---

## Evidencia verificable
- `src/router/index.js`
- `src/service/conexion_api.js`
- `src/service/gestorDocumentalService.js`
- `src/eviroments.js`
- `.drone.yml`
