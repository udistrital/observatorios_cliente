# Experiencia, accesibilidad e internacionalización AS-IS

## Alcance

Revisión estática contra WCAG 2.2 como referencia de evaluación. No se ejecutaron
auditorías automáticas, lector de pantalla, pruebas de teclado ni contraste; no se
afirma conformidad.

## Estados de interfaz

| Flujo | Carga | Vacío | Error | Observación |
|---|---|---|---|---|
| Procesos/factores/jerarquía | Skeletons o loaders | Mensajes/tarjetas | SweetAlert | [VERIFICADO] presente con variaciones. |
| Tablero | Loader y paginación | Mensajes de estructura/datos | Diálogos | Algunos loaders solo se cierran en éxito. |
| Visor documental | `role="status"` | [NO APLICA] | Reintento visible | Error no usa `role="alert"` o `aria-live`. |
| Paneles | Indicadores parciales | Depende de estado previo | Diálogos/console | Acceso directo puede encontrar stores nulos. |

## Hallazgos WCAG 2.2

| ID | Criterio relacionado | Evidencia AS-IS | Estado |
|---|---|---|---|
| A11Y-001 | 3.1.1 Idioma de la página | `index.html` declara `lang="en"`; contenido está en español. | [VERIFICADO] brecha |
| A11Y-002 | 2.1.1 Teclado | Tarjetas y cabeceras con click carecen de `tabindex`, tecla y rol. | [VERIFICADO] brecha |
| A11Y-003 | 4.1.2 Nombre, función, valor | Botones de icono dependen a menudo de `title`; faltan nombres accesibles. | [VERIFICADO] brecha parcial |
| A11Y-004 | 1.3.1 Información y relaciones | Algunas tablas de estructuras se construyen con `div`. | [VERIFICADO] brecha |
| A11Y-005 | 4.1.3 Mensajes de estado | El visor marca carga, no error; otros mensajes dependen de diálogos. | [VERIFICADO] parcial |
| A11Y-006 | 1.4.3 Contraste | No se midió contraste de temas/componentes. | [NO VERIFICADO] |
| A11Y-007 | 2.4 Navegable | No se verificó orden de foco al abrir/cerrar SweetAlert/Vuetify. | [NO VERIFICADO] |
| A11Y-008 | 2.2.2 Pausar/detener | Temporizadores de cierre/navegación existen en paneles; impacto no medido. | [INFERIDO] |

## Internacionalización

- [VERIFICADO] No existe biblioteca ni catálogo i18n.
- [VERIFICADO] Los textos están codificados en español dentro de componentes.
- [VERIFICADO] `Home.vue` contiene la cadena `Obserbatorios`.
- [PROPUESTA] Un objetivo multilingüe requiere spec TO-BE, inventario de cadenas y
  política de formatos; no debe inferirse como requisito aprobado.

## Seguridad de presentación

[VERIFICADO] Existen usos de `Swal.fire({ html: ... })` con nombres, campos o
errores potencialmente externos, entre otros en:

- `src/views/Espacios.vue`
- `src/components/procesos/ProcesoFactores.vue`
- `src/components/aspectos/AspectosSection.vue`
- `src/components/tablero/Tablero.vue`
- `src/components/panel/Panel.vue`

[NO VERIFICADO] El proveedor sanea todos esos valores. Debe tratarse como riesgo
XSS hasta demostrar codificación o saneamiento en el punto de salida.

## Puerta documental para cambios UI

- Identificar ruta, rol, estados carga/vacío/error y servicio.
- Definir AC de teclado, foco, nombre accesible y mensajes de estado.
- Probar al menos viewport móvil y escritorio.
- Registrar herramientas realmente ejecutadas; no afirmar WCAG por inspección.
