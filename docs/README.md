# Documentación técnica — observatorios_cliente

## Navegación recomendada
1. `../AGENTS.md`
2. `./arquitectura_e_integraciones.md`
3. `./flujos.md`
4. `./sdd/arquitectura_distribuida.md`
5. `./sdd/matriz_interacciones.md`
6. `./specs/README.md`
7. `./REGLAS_DESARROLLO_AGENTES_IA.md`

## Responsabilidad del repositorio
`observatorios_cliente` es el **frontend web** del ecosistema Observatorios. Su responsabilidad es ofrecer la experiencia de usuario, validaciones de formulario, navegación por roles y consumo de APIs.

## Alcance
- Renderizado de vistas administrativas/operativas.
- Gestión de estado de UI y sesión.
- Consumo de servicios backend para CRUD y flujo documental.

## Fuera de alcance
- Persistencia de datos de negocio.
- Lógica de almacenamiento documental.
- Escaneo antivirus.

## Interacciones con otros repositorios
- **Con `observatorios_crud`**: consume endpoints REST para catálogos, estructuras y datos.
- **Con `observatorios_mid`**: consume endpoint `/api/v1/documento` para creación/actualización de metadatos documentales y procesamiento de archivos.

Ver detalle en: `docs/arquitectura_e_integraciones.md` y `docs/flujos.md`.

## Convención de certeza documental
- **EVIDENCIA**: dato verificable en código/configuración del repositorio.
- **INFERENCIA**: hipótesis o dato no comprobable directamente.
