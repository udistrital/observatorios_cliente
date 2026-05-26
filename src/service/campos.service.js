import axios from "axios";
import { environment } from "@/environments/environment";

function getToken() {
  return localStorage.getItem("access_token");
}

function getAuthHeaders() {
  const token = getToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

const api = axios.create({
  baseURL: environment.MAIN_BACKEND,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    ...getAuthHeaders(),
  };

  return config;
});

export const camposService = {
  async listarTipos() {
    const response = await api.get("/campos/tipos");

    return response.data;
  },

  async obtenerEstructura(idEstructura) {
    const response = await api.get(
      `/campos/estructuras/${idEstructura}/`
    );

    return response.data;
  },

  async actualizarEstructura(idEstructura, data) {
    const response = await api.patch(
      `/campos/estructuras/${idEstructura}/`,
      data
    );

    return response.data;
  },

  async actualizarCampos(idEstructura, campos, eliminarDataCampos = []) {
    const payload = {
      campos,
    };

    if (eliminarDataCampos.length > 0) {
      payload.eliminar_data_campos = eliminarDataCampos;
    }

    const response = await api.patch(
      `/campos/estructuras/${idEstructura}/`,
      payload
    );

    return response.data;
  },

  async limpiarCamposYData(idEstructura) {
    const response = await api.delete(
      `/campos/estructuras/${idEstructura}/`
    );

    return response.data;
  },

  async listarData(idEstructura, params = {}) {
    const response = await api.get(
      `/campos/datos/${idEstructura}/`,
      {
        params,
      }
    );

    return response.data;
  },

  async crearRegistro(idEstructura, data) {
    const response = await api.post(
      `/campos/datos/${idEstructura}/`,
      data
    );

    return response.data;
  },

  async actualizarRegistro(idEstructura, idRegistro, data) {
    const response = await api.put(
      `/campos/datos/${idEstructura}/${idRegistro}/`,
      data
    );

    return response.data;
  },

  async actualizarRegistro(idEstructura, idRegistro, data) {
    const response = await api.put(
      `/campos/datos/${idEstructura}/${idRegistro}/`,
      data
    );

    return response.data;
  },

  async eliminarRegistro(idEstructura, idRegistro) {
    const response = await api.delete(
      `/campos/datos/${idEstructura}/${idRegistro}/`
    );

    return response.data;
  },

  async eliminarTodosRegistros(idEstructura) {
    const response = await api.delete(
      `/campos/datos/${idEstructura}/`
    );

    return response.data;
  },
};
