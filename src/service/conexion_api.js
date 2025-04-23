import axios from "axios";
import Swal from 'sweetalert2';
// import API_DIR from "../../.env";
// const _API_DIR = 'http://localhost:8000/api/v1';
// const _API_DIR = 'http://observatoriospruebas.portaloas.udistrital.edu.co:8080/api/v1';
// Crear instancia de Axios con la URL base del API desde .env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_DIR,
  // baseURL: _API_DIR,
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
const peticionAPI = async (path, method = "GET", data = null, params = null) => {
  try {
    const config = {
      method,
      url: path,
      headers: {},
      params,
    };

    if (data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    if (data) {
      config.data = data;
    }

    const response = await api(config);
    return response.data;
  } catch (error) {

    console.error("Error en la petición:", error.response || error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error?.response?.data?.detail || 'Ocurrió un error al procesar la solicitud.',
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
