import axios from "axios";
import { ProcesoModel } from "@/model/proceso.model";
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

export const procesosService = {
  async listar() {
    const response = await api.get("/procesos/");
    return ProcesoModel.fromApiList(response.data);
  },

  async obtener(id) {
    const response = await api.get(`/procesos/${id}/`);
    return ProcesoModel.fromApi(response.data);
  },

  async crear(data) {
    const proceso = data instanceof ProcesoModel
      ? data
      : new ProcesoModel(data);

    const response = await api.post("/procesos/", proceso.toPayload());
    return ProcesoModel.fromApi(response.data);
  },

  async actualizar(id, data) {
    const proceso = data instanceof ProcesoModel
      ? data
      : new ProcesoModel(data);

    const response = await api.put(`/procesos/${id}/`, proceso.toPayload());
    return ProcesoModel.fromApi(response.data);
  },

  async actualizarParcial(id, data) {
    const response = await api.patch(`/procesos/${id}/`, data);
    return ProcesoModel.fromApi(response.data);
  },

  async desactivar(id) {
    const response = await api.delete(`/procesos/${id}/`);
    return response.data;
  },
};
