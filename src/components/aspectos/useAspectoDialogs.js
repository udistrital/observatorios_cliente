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

  const verAspectoDialog = async (aspecto) => {
    return Swal.fire({
      title: escaparHtml(aspecto.nombre || "Aspecto"),
      html: `
        <div style="text-align:left">
          <p><b>ID:</b></p>
          <p style="word-break:break-word">${escaparHtml(aspecto.id || "Sin ID")}</p>

          <p><b>Característica:</b></p>
          <p style="word-break:break-word">${escaparHtml(aspecto.caracteristica_id || "Sin característica")}</p>

          <p><b>Estado:</b></p>
          <p>${aspecto.activo !== false ? "Activo" : "Inactivo"}</p>

          <p><b>Estructuras de evidencias:</b></p>
          <p>${Array.isArray(aspecto.estructuras_evidencias) ? aspecto.estructuras_evidencias.length : 0}</p>
        </div>
      `,
      icon: "info",
      width: "560px",
      customClass: clases,
      buttonsStyling: false,
    });
  };

  const crearAspectoDialog = async () => {
    return Swal.fire({
      title: "Crear Aspecto",
      html: `
        <div style="text-align:left">
          <label style="font-weight:600">Nombre</label>
          <input
            id="nombreAspecto"
            class="swal2-input"
            placeholder="Nombre del aspecto"
          >
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

        if (!nombre) {
          Swal.showValidationMessage("El nombre del aspecto es obligatorio.");
          return false;
        }

        return {
          nombre,
        };
      },
    });
  };

  const editarAspectoDialog = async (aspecto) => {
    return Swal.fire({
      title: "Editar Aspecto",
      html: `
        <div style="text-align:left">
          <label style="font-weight:600">Nombre</label>
          <input
            id="editarNombreAspecto"
            class="swal2-input"
            placeholder="Nombre del aspecto"
          >
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
      },
      preConfirm: () => {
        const nombre = document
          .getElementById("editarNombreAspecto")
          ?.value?.trim();

        if (!nombre) {
          Swal.showValidationMessage("El nombre del aspecto es obligatorio.");
          return false;
        }

        return {
          nombre,
        };
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

  const crearEstructuraEvidenciaDialog = async () => {
    return Swal.fire({
      title: "Crear Estructura Evidencia",
      html: `
        <div style="text-align:left">
          <label style="font-weight:600">Tipo de evidencia</label>
          <select
            id="tipoEvidencia"
            class="swal2-select"
            style="width:100%; margin: 8px 0 14px;"
          >
            <option value="">Seleccione un tipo</option>
            <option value="Documental">Documental</option>
            <option value="Tabla">Tabla</option>
          </select>

          <label style="font-weight:600">Nombre</label>
          <input
            id="nombreEstructuraEvidencia"
            class="swal2-input"
            placeholder="Nombre de la estructura evidencia"
          >
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      width: "500px",
      customClass: clases,
      buttonsStyling: false,
      preConfirm: () => {
        const tipoEvidencia = document
          .getElementById("tipoEvidencia")
          ?.value?.trim();

        const nombre = document
          .getElementById("nombreEstructuraEvidencia")
          ?.value?.trim();

        if (!tipoEvidencia) {
          Swal.showValidationMessage("Debe seleccionar el tipo de evidencia.");
          return false;
        }

        if (!nombre) {
          Swal.showValidationMessage("El nombre es obligatorio.");
          return false;
        }

        return {
          tipo_evidencia: tipoEvidencia,
          nombre,
          activo: true,
        };
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
