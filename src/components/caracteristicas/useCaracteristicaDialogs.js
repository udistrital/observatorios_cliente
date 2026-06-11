import Swal from "sweetalert2";
import { escaparHtml } from "./escapeHtml";

export function useCaracteristicaDialogs() {
  const clases = {
    popup: "popup-personalizado",
    title: "titulo-alerta-personalizado",
    confirmButton: "confirmacion-alerta-personalizado",
    cancelButton: "cancelacion-alerta-personalizado",
  };

  const verCaracteristicaDialog = async (caracteristica) => {
    return Swal.fire({
      title: escaparHtml(caracteristica.nombre || "Característica"),
      html: `
        <div style="text-align:left">
          <p><b>ID:</b></p>
          <p style="word-break:break-word">${escaparHtml(caracteristica.id || "Sin ID")}</p>

          <p><b>Descripción:</b></p>
          <p>${escaparHtml(caracteristica.descripcion || "Sin descripción registrada.")}</p>

          <p><b>Calificación:</b></p>
          <p>${escaparHtml(caracteristica.calificacion || "Sin calificación registrada.")}</p>

          <p><b>Estado:</b></p>
          <p>${caracteristica.activo !== false ? "Activo" : "Inactivo"}</p>

          <p><b>Aspectos registrados:</b></p>
          <p>${Array.isArray(caracteristica.aspectos) ? caracteristica.aspectos.length : 0}</p>
        </div>
      `,
      icon: "info",
      width: "560px",
      customClass: clases,
      buttonsStyling: false,
    });
  };

  const crearCaracteristicaDialog = async () => {
    return Swal.fire({
      title: "Crear Característica",
      html: `
        <div style="text-align:left">
          <label style="font-weight:600">Nombre</label>
          <input
            id="nombreCaracteristica"
            class="swal2-input"
            placeholder="Nombre de la característica"
          >

          <label style="font-weight:600">Descripción</label>
          <textarea
            id="descripcionCaracteristica"
            class="swal2-textarea"
            placeholder="Descripción de la característica"
          ></textarea>

          <label style="font-weight:600">Calificación</label>
          <input
            id="calificacionCaracteristica"
            class="swal2-input"
            type="text"
            inputmode="decimal"
            placeholder="Ej: 4.5"
          >
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      width: "520px",
      customClass: clases,
      buttonsStyling: false,
      didOpen: () => {
        document
          .getElementById("calificacionCaracteristica")
          .addEventListener("input", (event) => {
            const partes = event.target.value.replace(/[^\d.]/g, "").split(".");
            event.target.value = partes.length <= 1
              ? partes[0]
              : `${partes[0]}.${partes.slice(1).join("")}`;
          });
      },
      preConfirm: () => {
        const nombre = document
          .getElementById("nombreCaracteristica")
          ?.value?.trim();

        const descripcion = document
          .getElementById("descripcionCaracteristica")
          ?.value?.trim();

        const calificacion = document
          .getElementById("calificacionCaracteristica")
          ?.value?.trim();

        if (!nombre) {
          Swal.showValidationMessage("El nombre de la característica es obligatorio.");
          return false;
        }

        if (!descripcion) {
          Swal.showValidationMessage("La descripción de la característica es obligatoria.");
          return false;
        }

        if (calificacion && !/^\d+(\.\d+)?$/.test(calificacion)) {
          Swal.showValidationMessage("La calificación debe ser un número decimal.");
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

  const editarCaracteristicaDialog = async (caracteristica) => {
    return Swal.fire({
      title: "Editar Característica",
      html: `
        <div style="text-align:left">
          <label style="font-weight:600">Nombre</label>
          <textarea
            id="editarNombreCaracteristica"
            class="swal2-textarea"
            placeholder="Nombre de la característica"
            style="height:120px"
          ></textarea>

          <label style="font-weight:600">Descripción</label>
          <textarea
            id="editarDescripcionCaracteristica"
            class="swal2-textarea"
            placeholder="Descripción de la característica"
          ></textarea>

          <label style="font-weight:600">Calificación</label>
          <input
            id="editarCalificacionCaracteristica"
            class="swal2-input"
            type="text"
            inputmode="decimal"
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
        document.getElementById("editarNombreCaracteristica").value =
          caracteristica.nombre || "";

        document.getElementById("editarDescripcionCaracteristica").value =
          caracteristica.descripcion || "";

        document.getElementById("editarCalificacionCaracteristica").value =
          caracteristica.calificacion || "";

        document
          .getElementById("editarCalificacionCaracteristica")
          .addEventListener("input", (event) => {
            const partes = event.target.value.replace(/[^\d.]/g, "").split(".");
            event.target.value = partes.length <= 1
              ? partes[0]
              : `${partes[0]}.${partes.slice(1).join("")}`;
          });
      },
      preConfirm: () => {
        const nombre = document
          .getElementById("editarNombreCaracteristica")
          ?.value?.trim();

        const descripcion = document
          .getElementById("editarDescripcionCaracteristica")
          ?.value?.trim();

        const calificacion = document
          .getElementById("editarCalificacionCaracteristica")
          ?.value?.trim();

        if (!nombre) {
          Swal.showValidationMessage("El nombre de la característica es obligatorio.");
          return false;
        }

        if (!descripcion) {
          Swal.showValidationMessage("La descripción de la característica es obligatoria.");
          return false;
        }

        if (calificacion && !/^\d+(\.\d+)?$/.test(calificacion)) {
          Swal.showValidationMessage("La calificación debe ser un número decimal.");
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
