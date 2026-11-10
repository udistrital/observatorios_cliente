# Arquitectura AS-IS

## Referencia

Inspección de `observatorios_cliente@8537cb7104042cb1bd7874bb0d3cf8baa991d45e`
el 2026-11-10. Se aplican conceptos de C4 y vistas de ISO/IEC/IEEE 42010 sin
declarar conformidad.

## Contexto

```mermaid
flowchart LR
    U[Usuario] -->|Navegador| SPA[observatorios_cliente]
    SPA -->|REST JSON y multipart| CRUD[observatorios_crud]
    SPA -->|Carga consulta eliminación| GD[Gestor Documental]
    SPA -->|Autenticación y perfil| OAS[Servicios OAS]
    SPA -.->|Componentes legados| MID[observatorios_mid]
```

- [VERIFICADO] CRUD y Gestor son integraciones activas.
- [VERIFICADO] MID permanece en componentes legados con base vacía.
- [NO VERIFICADO] Implementación y controles internos de Gestor/OAS.

## Contenedor SPA

```mermaid
flowchart TB
    R[Vue Router y guarda]
    V[Vistas]
    C[Componentes]
    S[Servicios Axios y fetch]
    P[Stores Pinia]
    E[environment.js generado]
    UI[Vuetify y SweetAlert2]
    R --> V --> C
    C <--> P
    C --> S
    E --> S
    C --> UI
```

| Componente | Responsabilidad | Evidencia |
|---|---|---|
| `router/index.js` | Rutas, redirecciones, token, rol e hidratación de factor | `src/router/index.js` |
| `views/` | Entradas asociadas a navegación | `src/views/*.vue` |
| `components/` | Flujos y formularios por dominio | `src/components/**` |
| `service/` | Clientes HTTP y adaptación parcial | `src/service/*.js` |
| `stores/` | Contexto de usuario, factor, estructura, observatorio, panel y gráfica | `src/stores/*.js` |
| `environments/` | URLs y configuración pública por ambiente | scripts de `package.json` |

## Secuencia de carga documental activa

```mermaid
sequenceDiagram
    actor U as Usuario
    participant T as Tablero.vue
    participant G as Gestor Documental
    participant C as observatorios_crud
    U->>T: selecciona archivo y metadatos
    T->>T: valida extensión y MIME informado
    T->>T: convierte archivo completo a base64
    T->>G: POST document/uploadAnyFormat
    G-->>T: Enlace o hash
    T->>C: POST campos/datos/{estructura}/
    C-->>T: registro creado
    T-->>U: refresca tabla o muestra error
```

[VERIFICADO] No hay límite de tamaño en el cliente. [INFERIDO] si el último POST
falla queda un archivo huérfano, porque el flujo de alta no compensa esa ruta.

## Secuencia de visualización

```mermaid
sequenceDiagram
    actor U as Usuario
    participant T as Tablero.vue
    participant R as Vue Router
    participant V as DocumentoVisor.vue
    participant G as Gestor Documental
    U->>T: abrir documento
    T->>R: /documentos/{hash}
    R->>V: carga vista autenticada
    V->>G: GET document/{hash}
    G-->>V: base64 y metadatos
    V->>V: representa PDF Word o Excel localmente
    V-->>U: vista de solo lectura
```

## Estado y acceso

- [VERIFICADO] La guarda espera token hasta 2 segundos y luego usuario hasta 2
  segundos (`router/index.js:180-201`).
- [VERIFICADO] `localStorage` o `sessionStorage` habilitan navegación, pero la
  mayoría de clientes CRUD solo adjunta el primero.
- [VERIFICADO] Las rutas permitidas y la regla `to.path.includes("/panel")` no son
  equivalentes a autorización por operación.
- [VERIFICADO] La guarda hidrata el factor desde el servicio; si falla crea un
  objeto mínimo y permite continuar.
- [VERIFICADO] Stores de panel y gráfica persisten; el de observatorio no, aunque
  varias vistas de panel dependen de él.

## Límites y deuda arquitectónica

- Ocho instancias Axios y seis interceptores repiten autenticación.
- Componentes contienen orquestación HTTP, compensaciones y presentación.
- Flujos vigentes y legados coexisten en rutas y componentes.
- Errores pueden mostrarse en el helper y otra vez en el consumidor.
- [NO VERIFICADO] No hay ADR que formalicen estas decisiones.

## Correspondencias

- Navegación: [`../frontend/navegacion-y-modulos.md`](../frontend/navegacion-y-modulos.md).
- Servicios y estado: [`../frontend/servicios-y-estado.md`](../frontend/servicios-y-estado.md).
- Accesibilidad: [`../frontend/experiencia-y-accesibilidad.md`](../frontend/experiencia-y-accesibilidad.md).
- Integraciones: [`matriz_interacciones.md`](matriz_interacciones.md).
- Riesgos: [`brechas-y-riesgos.md`](brechas-y-riesgos.md).
