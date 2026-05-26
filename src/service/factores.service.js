import axios from "axios";
import { FactorModel } from "../model/factor.model";
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

export const factoresService = {
  async listar() {
    const response = await api.get("/factores/");
    return FactorModel.fromApiList(response.data);
  },

  async obtener(id) {
    const response = await api.get(`/factores/${id}/`);
    return FactorModel.fromApi(response.data);
  },

  async crear(data) {
    const factor = data instanceof FactorModel ? data : new FactorModel(data);
    const response = await api.post("/factores/", factor.toPayload());
    return FactorModel.fromApi(response.data);
  },

  async actualizar(id, data) {
    const factor = data instanceof FactorModel ? data : new FactorModel(data);
    const response = await api.put(`/factores/${id}/`, factor.toPayload());
    return FactorModel.fromApi(response.data);
  },

  async actualizarParcial(id, data) {
    const response = await api.patch(`/factores/${id}/`, data);
    return FactorModel.fromApi(response.data);
  },

  async desactivar(id) {
    const response = await api.delete(`/factores/${id}/`);
    return response.data;
  },
};
