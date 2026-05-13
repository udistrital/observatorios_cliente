import axios from "axios";
import { CaracteristicaModel } from "../model/caracteristica.model";
import { environment } from "../eviroments";

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

export const caracteristicasService = {
  async listarPorFactor(factorId) {
    const response = await api.get("/caracteristicas/", {
      params: {
        factor_id: factorId,
      },
    });

    return CaracteristicaModel.fromApiList(response.data);
  },

  async obtener(id) {
    const response = await api.get(`/caracteristicas/${id}/`);
    return CaracteristicaModel.fromApi(response.data);
  },

  async crear(data) {
    const caracteristica =
      data instanceof CaracteristicaModel
        ? data
        : new CaracteristicaModel(data);

    const response = await api.post(
      "/caracteristicas/",
      caracteristica.toPayload()
    );

    return CaracteristicaModel.fromApi(response.data);
  },

  async actualizar(id, data) {
    const caracteristica =
      data instanceof CaracteristicaModel
        ? data
        : new CaracteristicaModel(data);

    const response = await api.put(
      `/caracteristicas/${id}/`,
      caracteristica.toPayload()
    );

    return CaracteristicaModel.fromApi(response.data);
  },

  async actualizarParcial(id, data) {
    const response = await api.patch(`/caracteristicas/${id}/`, data);
    return CaracteristicaModel.fromApi(response.data);
  },

  async desactivar(id) {
    const response = await api.delete(`/caracteristicas/${id}/`);
    return response.data;
  },

  async eliminar(id) {
    const response = await api.delete(`/caracteristicas/${id}/`);
    return response.data;
  },
};
