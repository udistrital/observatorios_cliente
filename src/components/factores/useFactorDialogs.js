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

  const verFactorDialog = async (factor) => {
    return Swal.fire({
      title: escaparHtml(factor.nombre || "Factor"),
      html: `
        <div style="text-align:left">
          <p><b>ID:</b></p>
          <p style="word-break:break-word">${escaparHtml(factor.id || "Sin ID")}</p>

          <p><b>Descripción:</b></p>
          <p>${escaparHtml(factor.descripcion || "Sin descripción registrada.")}</p>

          <p><b>Calificación:</b></p>
          <p>${escaparHtml(factor.calificacion || "Sin calificación registrada.")}</p>

          <p><b>Estado:</b></p>
          <p>${factor.activo !== false ? "Activo" : "Inactivo"}</p>

          <p><b>Características asociadas:</b></p>
          <p>${Array.isArray(factor.caracteristicas) ? factor.caracteristicas.length : 0}</p>
        </div>
      `,
      icon: "info",
      width: "560px",
      customClass: clases,
      buttonsStyling: false,
    });
  };

  const editarFactorDialog = async (factor) => {
    return Swal.fire({
      title: "Editar factor",
      html: `
        <div style="text-align:left">
          <label style="font-weight:600">Nombre</label>
          <textarea
            id="editarNombreFactor"
            class="swal2-textarea"
            placeholder="Nombre del factor"
            style="height:90px"
          ></textarea>

          <label style="font-weight:600">Descripción</label>
          <textarea
            id="editarDescripcionFactor"
            class="swal2-textarea"
            placeholder="Descripción del factor"
          ></textarea>

          <label style="font-weight:600">Calificación</label>
          <input
            id="editarCalificacionFactor"
            class="swal2-input"
            placeholder="Ej: 4.5"
          >
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

        document.getElementById("editarDescripcionFactor").value =
          factor.descripcion || "";

        document.getElementById("editarCalificacionFactor").value =
          factor.calificacion || "";
      },
      preConfirm: () => {
        const nombre = document
          .getElementById("editarNombreFactor")
          ?.value?.trim();

        const descripcion = document
          .getElementById("editarDescripcionFactor")
          ?.value?.trim();

        const calificacion = document
          .getElementById("editarCalificacionFactor")
          ?.value?.trim();

        if (!nombre) {
          Swal.showValidationMessage("El nombre del factor es obligatorio.");
          return false;
        }

        if (!descripcion) {
          Swal.showValidationMessage("La descripción del factor es obligatoria.");
          return false;
        }

        return {
          nombre,
          descripcion,
          calificacion: calificacion || "",
        };
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
