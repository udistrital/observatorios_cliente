import axios from "axios";
import Swal from "sweetalert2";
import { environment } from "@/environments/environment";
import { useUserStore } from "@/stores/userStore";

const api = axios.create({
  baseURL: environment.MAIN_BACKEND,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Función para hacer peticiones a la API
 * @param {string} path - Ruta del endpoint (sin la URL base)
 * @param {string} method - Método HTTP ('GET', 'POST', 'PUT', 'DELETE', etc.)
 * @param {Object|FormData} data - Datos a enviar (puede ser un objeto JSON o FormData)
 * @returns {Promise} - Retorna la promesa de la petición
 */
const peticionAPI = async (
  path,
  method = "GET",
  data = null,
  params = null
) => {
  try {
    const userStore = useUserStore();

    const token = localStorage.getItem("access_token");

    const config = {
      method,
      url: path,
      headers: {},
      params,
    };

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    if (data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    if (data) {
      config.data = data;
    }

    const response = await api(config);

    if (method === "DELETE"  && response.status === 200) {
      return response.status;
    }

    return response.data;
  } catch (error) {
    console.error("Error en la petición:", error.response || error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error?.response?.data?.detail ||
        "Ocurrió un error al procesar la solicitud.",
      customClass: {
        popup: "popup-personalizado",
        title: "titulo-alerta-personalizado",
        confirmButton: "confirmacion-alerta-personalizado",
        cancelButton: "cancelacion-alerta-personalizado",
      },
    });
    throw error;
  }
};

export default peticionAPI;
