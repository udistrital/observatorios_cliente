import axios from "axios";
import { AspectoModel } from "@/model/aspecto.model";
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

export const aspectosService = {
  async listarPorCaracteristica(caracteristicaId) {
    const response = await api.get("/aspectos/", {
      params: {
        caracteristica_id: caracteristicaId,
      },
    });

    return AspectoModel.fromApiList(response.data);
  },

  async obtener(id) {
    const response = await api.get(`/aspectos/${id}/`);
    return AspectoModel.fromApi(response.data);
  },

  async crear(data) {
    const aspecto = data instanceof AspectoModel
      ? data
      : new AspectoModel(data);

    const response = await api.post("/aspectos/", aspecto.toPayload());

    return AspectoModel.fromApi(response.data);
  },

  async actualizar(id, data) {
    const aspecto = data instanceof AspectoModel
      ? data
      : new AspectoModel(data);

    const response = await api.put(`/aspectos/${id}/`, aspecto.toPayload());

    return AspectoModel.fromApi(response.data);
  },

  async actualizarParcial(id, data) {
    const response = await api.patch(`/aspectos/${id}/`, data);
    return AspectoModel.fromApi(response.data);
  },

  async eliminar(id) {
    const response = await api.delete(`/aspectos/${id}/`);
    return response.data;
  },
};
