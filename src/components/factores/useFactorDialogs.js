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

const leerOrdenDesdeDialog = (id = "orden", puedeEditarOrden = false) => {
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

export function useFactorDialogs() {
  const mostrarCargando = async (titulo = "Cargando", texto = "Por favor espera…") => {
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

  const cerrarCargando = () => {
    Swal.close();
  };

  const inputOrdenHtml = (
    puedeEditarOrden = false,
    id = "orden",
    valor = ""
  ) => {
    const disabled = puedeEditarOrden ? "" : "disabled";

    return `
      <label style="font-weight:600">Orden</label>
      <input
        id="${id}"
        class="swal2-input"
        type="number"
        min="0"
        placeholder="Ej: 1"
        value="${valor ?? ""}"
        ${disabled}
      >
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

  const verFactorDialog = async (factor) => {
    return Swal.fire({
      title: escaparHtml(factor.nombre || "Factor"),
      html: `
        <div style="text-align:left">
          <div style="margin-bottom:12px">
            <b>ID:</b>
            <div style="word-break:break-word; margin-top:4px">
              ${escaparHtml(factor.id || factor.factor_id || "Sin ID")}
            </div>
          </div>

          <div style="margin-bottom:12px">
            <b>Orden:</b>
            <div style="margin-top:4px">
              ${factor.orden !== null && factor.orden !== undefined ? escaparHtml(factor.orden) : "Sin orden registrado."}
            </div>
          </div>

          <div style="margin-bottom:12px">
            <b>Descripción:</b>
            <div style="margin-top:4px">
              ${escaparHtml(factor.descripcion || "Sin descripción registrada.")}
            </div>
          </div>

          <div style="margin-bottom:12px">
            <b>Calificación:</b>
            <div style="margin-top:4px">
              ${escaparHtml(factor.calificacion || "Sin calificación registrada.")}
            </div>
          </div>

          <div style="margin-bottom:12px">
            <b>Estado:</b>
            <div style="margin-top:4px">
              ${factor.activo !== false ? "Activo" : "Inactivo"}
            </div>
          </div>

          <div>
            <b>Características asociadas:</b>
            <div style="margin-top:4px">
              ${Array.isArray(factor.caracteristicas) ? factor.caracteristicas.length : 0}
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

  const editarFactorDialog = async (factor, opciones = {}) => {
    const puedeEditarOrden = opciones.puedeEditarOrden === true;

    return Swal.fire({
      title: "Editar factor",
      html: `
        <div style="text-align:left">
          <div style="margin-bottom:14px">
            <label
              for="editarNombreFactor"
              style="display:block; margin-bottom:6px; font-weight:600"
            >
              Nombre
            </label>

            <textarea
              id="editarNombreFactor"
              class="swal2-textarea"
              placeholder="Nombre del factor"
              style="display:block; width:100%; box-sizing:border-box; margin:0; height:80px"
            ></textarea>
          </div>

          ${inputOrdenHtml(
            puedeEditarOrden,
            "editarOrdenFactor",
            factor.orden ?? ""
          )}

          <div style="margin-bottom:14px">
            <label
              for="editarDescripcionFactor"
              style="display:block; margin-bottom:6px; font-weight:600"
            >
              Descripción
            </label>

            <textarea
              id="editarDescripcionFactor"
              class="swal2-textarea"
              placeholder="Descripción del factor"
              style="display:block; width:100%; box-sizing:border-box; margin:0; height:110px"
            ></textarea>
          </div>

          <div style="margin-bottom:14px">
            <label
              for="editarCalificacionFactor"
              style="display:block; margin-bottom:6px; font-weight:600"
            >
              Calificación
            </label>

            <input
              id="editarCalificacionFactor"
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
        document.getElementById("editarNombreFactor").value =
          factor.nombre || "";

        document.getElementById("editarOrdenFactor").value =
          factor.orden ?? "";

        document.getElementById("editarDescripcionFactor").value =
          factor.descripcion || "";

        document.getElementById("editarCalificacionFactor").value =
          factor.calificacion || "";

        document
          .getElementById("editarCalificacionFactor")
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
          .getElementById("editarNombreFactor")
          ?.value?.trim();

        const orden = leerOrdenDesdeDialog(
          "editarOrdenFactor",
          puedeEditarOrden
        );

        const descripcion = document
          .getElementById("editarDescripcionFactor")
          ?.value?.trim();

        const calificacion = document
          .getElementById("editarCalificacionFactor")
          ?.value?.trim();

        if (orden === false) {
          return false;
        }

        if (!nombre) {
          Swal.showValidationMessage("El nombre del factor es obligatorio.");
          return false;
        }

        if (!descripcion) {
          Swal.showValidationMessage(
            "La descripción del factor es obligatoria."
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

  const confirmarCambioEstadoFactorDialog = async (factor) => {
    const nuevoEstado = factor.activo === false;
    const accion = nuevoEstado ? "activar" : "desactivar";

    return Swal.fire({
      title: `${nuevoEstado ? "Activar" : "Desactivar"} factor`,
      html: `¿Desea ${accion} el factor <b>${escaparHtml(factor.nombre)}</b>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      width: "380px",
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
    mostrarCargando,
    cerrarCargando,
    verFactorDialog,
    editarFactorDialog,
    confirmarCambioEstadoFactorDialog,
    mostrarExito,
    mostrarError,
  };
}
