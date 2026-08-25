import Swal from "sweetalert2";

export function useCaracteristicaDialogs() {
  const clases = {
    popup: "popup-personalizado",
    title: "titulo-alerta-personalizado",
    confirmButton: "confirmacion-alerta-personalizado",
    cancelButton: "cancelacion-alerta-personalizado",
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

  const escaparHtml = (valor) => {
    if (valor === null || valor === undefined) {
      return "";
    }

    return String(valor)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  };

  const verCaracteristicaDialog = async (caracteristica) => {
    const orden =
      caracteristica.orden !== null && caracteristica.orden !== undefined
        ? caracteristica.orden
        : "Sin orden registrado.";

    return Swal.fire({
      title: escaparHtml(caracteristica.nombre || "Característica"),
      html: `
        <div style="text-align:left">
          <div style="margin-bottom:12px">
            <b>ID:</b>
            <div style="word-break:break-word; margin-top:4px">
              ${escaparHtml(caracteristica.id || "Sin ID")}
            </div>
          </div>

          <div style="margin-bottom:12px">
            <b>Orden:</b>
            <div style="margin-top:4px">
              ${escaparHtml(orden)}
            </div>
          </div>

          <div style="margin-bottom:12px">
            <b>Descripción:</b>
            <div style="margin-top:4px">
              ${escaparHtml(
                caracteristica.descripcion || "Sin descripción registrada."
              )}
            </div>
          </div>

          <div style="margin-bottom:12px">
            <b>Calificación:</b>
            <div style="margin-top:4px">
              ${escaparHtml(
                caracteristica.calificacion || "Sin calificación registrada."
              )}
            </div>
          </div>

          <div style="margin-bottom:12px">
            <b>Estado:</b>
            <div style="margin-top:4px">
              ${caracteristica.activo !== false ? "Activo" : "Inactivo"}
            </div>
          </div>

          <div>
            <b>Aspectos registrados:</b>
            <div style="margin-top:4px">
              ${
                Array.isArray(caracteristica.aspectos)
                  ? caracteristica.aspectos.length
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

  const crearCaracteristicaDialog = async (opciones = {}) => {
    const puedeEditarOrden = opciones.puedeEditarOrden === true;

    return Swal.fire({
      title: "Crear Característica",
      html: `
        <div style="text-align:left">
          <div style="margin-bottom:14px">
            <label
              for="nombreCaracteristica"
              style="display:block; margin-bottom:6px; font-weight:600"
            >
              Nombre
            </label>

            <input
              id="nombreCaracteristica"
              class="swal2-input"
              placeholder="Nombre de la característica"
              style="display:block; width:100%; box-sizing:border-box; margin:0"
            >
          </div>

          ${inputOrdenHtml(
            puedeEditarOrden,
            "ordenCaracteristica",
            ""
          )}

          <div style="margin-bottom:14px">
            <label
              for="descripcionCaracteristica"
              style="display:block; margin-bottom:6px; font-weight:600"
            >
              Descripción
            </label>

            <textarea
              id="descripcionCaracteristica"
              class="swal2-textarea"
              placeholder="Descripción de la característica"
              style="display:block; width:100%; box-sizing:border-box; margin:0; height:90px"
            ></textarea>
          </div>

          <div style="margin-bottom:14px">
            <label
              for="calificacionCaracteristica"
              style="display:block; margin-bottom:6px; font-weight:600"
            >
              Calificación
            </label>

            <input
              id="calificacionCaracteristica"
              class="swal2-input"
              type="text"
              inputmode="decimal"
              placeholder="Ej: 4.5"
              style="display:block; width:100%; box-sizing:border-box; margin:0"
            >
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      width: "620px",
      customClass: clases,
      buttonsStyling: false,
      didOpen: () => {
        document
          .getElementById("calificacionCaracteristica")
          .addEventListener("input", (event) => {
            const partes = event.target.value
              .replace(/[^\d.]/g, "")
              .split(".");

            event.target.value =
              partes.length <= 1
                ? partes[0]
                : `${partes[0]}.${partes.slice(1).join("")}`;
          });
      },
      preConfirm: () => {
        const nombre = document
          .getElementById("nombreCaracteristica")
          ?.value?.trim();

        const orden = leerOrdenDesdeDialog(
          "ordenCaracteristica",
          puedeEditarOrden
        );

        const descripcion = document
          .getElementById("descripcionCaracteristica")
          ?.value?.trim();

        const calificacion = document
          .getElementById("calificacionCaracteristica")
          ?.value?.trim();

        if (orden === false) {
          return false;
        }

        if (!nombre) {
          Swal.showValidationMessage(
            "El nombre de la característica es obligatorio."
          );
          return false;
        }

        if (!descripcion) {
          Swal.showValidationMessage(
            "La descripción de la característica es obligatoria."
          );
          return false;
        }

        if (calificacion && !/^\d+(\.\d+)?$/.test(calificacion)) {
          Swal.showValidationMessage(
            "La calificación debe ser un número decimal."
          );
          return false;
        }

        const payload = {
          nombre,
          descripcion,
          calificacion: calificacion || "",
        };

        if (puedeEditarOrden) {
          payload.orden = orden;
        }

        return payload;
      },
    });
  };

  const editarCaracteristicaDialog = async (
    caracteristica,
    opciones = {}
  ) => {
    const puedeEditarOrden = opciones.puedeEditarOrden === true;

    return Swal.fire({
      title: "Editar Característica",
      html: `
        <div style="text-align:left">
          <div style="margin-bottom:14px">
            <label
              for="editarNombreCaracteristica"
              style="display:block; margin-bottom:6px; font-weight:600"
            >
              Nombre
            </label>

            <textarea
              id="editarNombreCaracteristica"
              class="swal2-textarea"
              placeholder="Nombre de la característica"
              style="display:block; width:100%; box-sizing:border-box; margin:0; height:90px"
            ></textarea>
          </div>

          ${inputOrdenHtml(
            puedeEditarOrden,
            "editarOrdenCaracteristica",
            caracteristica.orden ?? ""
          )}

          <div style="margin-bottom:14px">
            <label
              for="editarDescripcionCaracteristica"
              style="display:block; margin-bottom:6px; font-weight:600"
            >
              Descripción
            </label>

            <textarea
              id="editarDescripcionCaracteristica"
              class="swal2-textarea"
              placeholder="Descripción de la característica"
              style="display:block; width:100%; box-sizing:border-box; margin:0; height:90px"
            ></textarea>
          </div>

          <div style="margin-bottom:14px">
            <label
              for="editarCalificacionCaracteristica"
              style="display:block; margin-bottom:6px; font-weight:600"
            >
              Calificación
            </label>

            <input
              id="editarCalificacionCaracteristica"
              class="swal2-input"
              type="text"
              inputmode="decimal"
              placeholder="Ej: 4.5"
              style="display:block; width:100%; box-sizing:border-box; margin:0"
            >
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      width: "620px",
      customClass: clases,
      buttonsStyling: false,
      didOpen: () => {
        document.getElementById("editarNombreCaracteristica").value =
          caracteristica.nombre || "";

        document.getElementById("editarOrdenCaracteristica").value =
          caracteristica.orden ?? "";

        document.getElementById("editarDescripcionCaracteristica").value =
          caracteristica.descripcion || "";

        document.getElementById("editarCalificacionCaracteristica").value =
          caracteristica.calificacion || "";

        document
          .getElementById("editarCalificacionCaracteristica")
          .addEventListener("input", (event) => {
            const partes = event.target.value
              .replace(/[^\d.]/g, "")
              .split(".");

            event.target.value =
              partes.length <= 1
                ? partes[0]
                : `${partes[0]}.${partes.slice(1).join("")}`;
          });
      },
      preConfirm: () => {
        const nombre = document
          .getElementById("editarNombreCaracteristica")
          ?.value?.trim();

        const orden = leerOrdenDesdeDialog(
          "editarOrdenCaracteristica",
          puedeEditarOrden
        );

        const descripcion = document
          .getElementById("editarDescripcionCaracteristica")
          ?.value?.trim();

        const calificacion = document
          .getElementById("editarCalificacionCaracteristica")
          ?.value?.trim();

        if (orden === false) {
          return false;
        }

        if (!nombre) {
          Swal.showValidationMessage(
            "El nombre de la característica es obligatorio."
          );
          return false;
        }

        if (!descripcion) {
          Swal.showValidationMessage(
            "La descripción de la característica es obligatoria."
          );
          return false;
        }

        if (calificacion && !/^\d+(\.\d+)?$/.test(calificacion)) {
          Swal.showValidationMessage(
            "La calificación debe ser un número decimal."
          );
          return false;
        }

        const payload = {
          nombre,
          descripcion,
          calificacion: calificacion || "",
        };

        if (puedeEditarOrden) {
          payload.orden = orden;
        }

        return payload;
      },
    });
  };

  const confirmarCambioEstadoCaracteristicaDialog = async (caracteristica) => {
    const nuevoEstado = caracteristica.activo === false;
    const accion = nuevoEstado ? "activar" : "desactivar";

    return Swal.fire({
      title: `${nuevoEstado ? "Activar" : "Desactivar"} Característica`,
      html: `¿Desea ${accion} la característica <b>${escaparHtml(caracteristica.nombre)}</b>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      width: "380px",
      customClass: clases,
      buttonsStyling: false,
    });
  };

  const confirmarEliminarCaracteristicaDialog = async (caracteristica) => {
    return Swal.fire({
      title: "Eliminar Característica",
      html: `
        ¿Desea eliminar la característica <b>${escaparHtml(caracteristica.nombre)}</b>?
        <br><br>
        Esta acción quitará la característica del listado del factor.
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      width: "420px",
      customClass: clases,
      buttonsStyling: false,
    });
  };

  const mostrarExito = async (titulo, texto) => {
    return Swal.fire({
      title: titulo,
      text: texto,
      icon: "success",
      width: "300px",
      customClass: clases,
      buttonsStyling: false,
    });
  };

  const mostrarError = async (texto) => {
    return Swal.fire({
      title: "Error",
      text: texto,
      icon: "error",
      width: "350px",
      customClass: clases,
      buttonsStyling: false,
    });
  };

  return {
    verCaracteristicaDialog,
    crearCaracteristicaDialog,
    editarCaracteristicaDialog,
    confirmarCambioEstadoCaracteristicaDialog,
    confirmarEliminarCaracteristicaDialog,
    mostrarExito,
    mostrarError,
  };
}
