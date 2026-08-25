import Swal from "sweetalert2";

const clases = {
  popup: "popup-personalizado",
  title: "titulo-alerta-personalizado",
  confirmButton: "confirmacion-alerta-personalizado",
  cancelButton: "cancelacion-alerta-personalizado",
};

function escaparHtml(valor = "") {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function useAspectoDialogs() {
  const mostrarCargandoAspecto = async (
    titulo = "Procesando aspecto",
    texto = "Por favor espera…"
  ) => {
    Swal.fire({
      title: titulo,
      text: texto,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };

  const cerrarCargandoAspecto = () => {
    Swal.close();
  };

  const inputOrdenHtml = (
    puedeEditarOrden = false,
    id = "orden",
    valor = ""
  ) => {
    const disabled = puedeEditarOrden ? "" : "disabled";

    return `
      <div style="margin-bottom:14px">
        <label
          for="${id}"
          style="display:block; margin-bottom:6px; font-weight:600"
        >
          Orden
        </label>

        <input
          id="${id}"
          class="swal2-input"
          type="number"
          min="0"
          placeholder="Ej: 1"
          value="${valor ?? ""}"
          ${disabled}
          style="display:block; width:100%; box-sizing:border-box; margin:0"
        >
      </div>
    `;
  };

  const leerOrdenDesdeDialog = (
    id = "orden",
    puedeEditarOrden = false
  ) => {
    if (!puedeEditarOrden) {
      return undefined;
    }

    const orden = document.getElementById(id)?.value?.trim();

    if (orden && !/^\d+$/.test(orden)) {
      Swal.showValidationMessage(
        "El orden debe ser un número entero mayor o igual a cero."
      );
      return false;
    }

    return orden ? Number(orden) : null;
  };

  const verAspectoDialog = async (aspecto) => {
    const orden =
      aspecto.orden !== null && aspecto.orden !== undefined
        ? aspecto.orden
        : "Sin orden registrado.";

    return Swal.fire({
      title: escaparHtml(aspecto.nombre || "Aspecto"),
      html: `
        <div style="text-align:left">
          <div style="margin-bottom:12px">
            <b>ID:</b>
            <div style="word-break:break-word; margin-top:4px">
              ${escaparHtml(aspecto.id || "Sin ID")}
            </div>
          </div>

          <div style="margin-bottom:12px">
            <b>Orden:</b>
            <div style="margin-top:4px">
              ${escaparHtml(orden)}
            </div>
          </div>

          <div style="margin-bottom:12px">
            <b>Característica:</b>
            <div style="word-break:break-word; margin-top:4px">
              ${escaparHtml(aspecto.caracteristica_id || "Sin característica")}
            </div>
          </div>

          <div style="margin-bottom:12px">
            <b>Estado:</b>
            <div style="margin-top:4px">
              ${aspecto.activo !== false ? "Activo" : "Inactivo"}
            </div>
          </div>

          <div>
            <b>Estructuras de evidencias:</b>
            <div style="margin-top:4px">
              ${
                Array.isArray(aspecto.estructuras_evidencias)
                  ? aspecto.estructuras_evidencias.length
                  : 0
              }
            </div>
          </div>
        </div>
      `,
      icon: "info",
      width: "560px",
      customClass: clases,
      buttonsStyling: false,
    });
  };

  const crearAspectoDialog = async (opciones = {}) => {
    const puedeEditarOrden = opciones.puedeEditarOrden === true;

    return Swal.fire({
      title: "Crear Aspecto",
      html: `
        <div style="text-align:left">
          <div style="margin-bottom:14px">
            <label
              for="nombreAspecto"
              style="display:block; margin-bottom:6px; font-weight:600"
            >
              Nombre
            </label>

            <input
              id="nombreAspecto"
              class="swal2-input"
              placeholder="Nombre del aspecto"
              style="display:block; width:100%; box-sizing:border-box; margin:0"
            >
          </div>

          ${inputOrdenHtml(
            puedeEditarOrden,
            "ordenAspecto",
            ""
          )}
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      width: "480px",
      customClass: clases,
      buttonsStyling: false,
      preConfirm: () => {
        const nombre = document
          .getElementById("nombreAspecto")
          ?.value?.trim();

        const orden = leerOrdenDesdeDialog(
          "ordenAspecto",
          puedeEditarOrden
        );

        if (orden === false) {
          return false;
        }

        if (!nombre) {
          Swal.showValidationMessage("El nombre del aspecto es obligatorio.");
          return false;
        }

        const payload = {
          nombre,
        };

        if (puedeEditarOrden) {
          payload.orden = orden;
        }

        return payload;
      },
    });
  };

  const editarAspectoDialog = async (aspecto, opciones = {}) => {
    const puedeEditarOrden = opciones.puedeEditarOrden === true;

    return Swal.fire({
      title: "Editar Aspecto",
      html: `
        <div style="text-align:left">
          <div style="margin-bottom:14px">
            <label
              for="editarNombreAspecto"
              style="display:block; margin-bottom:6px; font-weight:600"
            >
              Nombre
            </label>

            <input
              id="editarNombreAspecto"
              class="swal2-input"
              placeholder="Nombre del aspecto"
              style="display:block; width:100%; box-sizing:border-box; margin:0"
            >
          </div>

          ${inputOrdenHtml(
            puedeEditarOrden,
            "editarOrdenAspecto",
            aspecto.orden ?? ""
          )}
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      width: "480px",
      customClass: clases,
      buttonsStyling: false,
      didOpen: () => {
        document.getElementById("editarNombreAspecto").value =
          aspecto.nombre || "";

        document.getElementById("editarOrdenAspecto").value =
          aspecto.orden ?? "";
      },
      preConfirm: () => {
        const nombre = document
          .getElementById("editarNombreAspecto")
          ?.value?.trim();

        const orden = leerOrdenDesdeDialog(
          "editarOrdenAspecto",
          puedeEditarOrden
        );

        if (orden === false) {
          return false;
        }

        if (!nombre) {
          Swal.showValidationMessage("El nombre del aspecto es obligatorio.");
          return false;
        }

        const payload = {
          nombre,
        };

        if (puedeEditarOrden) {
          payload.orden = orden;
        }

        return payload;
      },
    });
  };

  const confirmarCambioEstadoAspectoDialog = async (aspecto) => {
    const nuevoEstado = aspecto.activo === false;
    const accion = nuevoEstado ? "activar" : "desactivar";

    return Swal.fire({
      title: `${nuevoEstado ? "Activar" : "Desactivar"} Aspecto`,
      html: `¿Desea ${accion} el aspecto <b>${escaparHtml(aspecto.nombre)}</b>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      width: "380px",
      customClass: clases,
      buttonsStyling: false,
    });
  };

  const confirmarEliminarAspectoDialog = async (aspecto) => {
    return Swal.fire({
      title: "Eliminar Aspecto",
      html: `
        ¿Desea eliminar el aspecto <b>${escaparHtml(aspecto.nombre)}</b>?
        <br><br>
        Esta acción también quitará el ID del aspecto dentro de la característica.
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      width: "430px",
      customClass: clases,
      buttonsStyling: false,
    });
  };

  const mostrarExitoAspecto = async (titulo, texto) => {
    return Swal.fire({
      title: titulo,
      text: texto,
      icon: "success",
      width: "320px",
      customClass: clases,
      buttonsStyling: false,
    });
  };

  const mostrarErrorAspecto = async (texto) => {
    return Swal.fire({
      title: "Error",
      text: texto,
      icon: "error",
      width: "360px",
      customClass: clases,
      buttonsStyling: false,
    });
  };

  const crearEstructuraEvidenciaDialog = async (
    estructura = null,
    opciones = {}
  ) => {
    const esEdicion = Boolean(
      estructura?.id ||
      estructura?.tipo_evidencia ||
      estructura?.nombre
    );

    const puedeEditarOrden = opciones.puedeEditarOrden === true;

    return Swal.fire({
      title: esEdicion
        ? "Editar Estructura Evidencia"
        : "Crear Estructura Evidencia",
      html: `
        <div style="text-align:left">
          <div style="margin-bottom:14px">
            <label
              for="tipoEvidencia"
              style="display:block; margin-bottom:6px; font-weight:600"
            >
              Tipo de evidencia
            </label>

            <select
              id="tipoEvidencia"
              class="swal2-select"
              style="display:block; width:100%; box-sizing:border-box; margin:0"
              ${esEdicion ? "disabled" : ""}
            >
              <option value="">Seleccione un tipo</option>
              <option value="Documental">Documental</option>
              <option value="Tabla">Tabla</option>
            </select>
          </div>

          <div style="margin-bottom:14px">
            <label
              for="nombreEstructuraEvidencia"
              style="display:block; margin-bottom:6px; font-weight:600"
            >
              Nombre
            </label>

            <input
              id="nombreEstructuraEvidencia"
              class="swal2-input"
              placeholder="Nombre de la estructura evidencia"
              style="display:block; width:100%; box-sizing:border-box; margin:0"
            >
          </div>

          ${inputOrdenHtml(
            puedeEditarOrden,
            "ordenEstructuraEvidencia",
            estructura?.orden ?? ""
          )}
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      width: "520px",
      customClass: clases,
      buttonsStyling: false,
      didOpen: () => {
        document.getElementById("tipoEvidencia").value =
          estructura?.tipo_evidencia || "";

        document.getElementById("nombreEstructuraEvidencia").value =
          estructura?.nombre || "";

        document.getElementById("ordenEstructuraEvidencia").value =
          estructura?.orden ?? "";
      },
      preConfirm: () => {
        const tipoEvidencia = esEdicion
          ? estructura.tipo_evidencia
          : document.getElementById("tipoEvidencia")?.value?.trim();

        const nombre = document
          .getElementById("nombreEstructuraEvidencia")
          ?.value?.trim();

        const orden = leerOrdenDesdeDialog(
          "ordenEstructuraEvidencia",
          puedeEditarOrden
        );

        if (orden === false) {
          return false;
        }

        if (!tipoEvidencia) {
          Swal.showValidationMessage("Debe seleccionar el tipo de evidencia.");
          return false;
        }

        if (!nombre) {
          Swal.showValidationMessage("El nombre es obligatorio.");
          return false;
        }

        const payload = {
          tipo_evidencia: tipoEvidencia,
          nombre,
          activo: true,
        };

        if (puedeEditarOrden) {
          payload.orden = orden;
        }

        return payload;
      },
    });
  };

  return {
    mostrarCargandoAspecto,
    cerrarCargandoAspecto,
    verAspectoDialog,
    crearAspectoDialog,
    editarAspectoDialog,
    confirmarCambioEstadoAspectoDialog,
    confirmarEliminarAspectoDialog,
    mostrarExitoAspecto,
    mostrarErrorAspecto,
    crearEstructuraEvidenciaDialog,
  };
}
