# AGENTS.md — Punto de entrada técnico

## Propósito del repositorio
Frontend SPA del ecosistema Observatorios. Responsable de experiencia de usuario, navegación, validaciones de entrada y consumo de APIs.

## Dónde empezar
1. `README.md`
2. `docs/README.md`
3. `docs/specs/README.md`

## Interacciones obligatorias con otros repositorios
- Consume `observatorios_crud` para operaciones CRUD del dominio.
- Consume `observatorios_mid` para el flujo documental (`/api/v1/documento`).

## Convención SDD
- Toda evolución funcional inicia con spec en `docs/specs/`.
- Si el cambio impacta contrato inter-repo, actualizar también `docs/sdd/matriz_interacciones.md` de este repositorio.

## Flujo documental obligatorio
1. Levantar contexto real desde `README.md`, `docs/` y configuración (`.drone.yml`, `Dockerfile`, `package.json`).
2. Marcar como **INFERENCIA** todo dato no verificable en código/configuración.
3. Documentar primero estado **AS-IS** y luego evolución **TO-BE** en backlog.
4. Mantener trazabilidad historia funcional → criterios → evidencia (ruta/archivo/endpoint).
5. Si cambia contrato, flujo o variable, actualizar documentación en el mismo cambio.
