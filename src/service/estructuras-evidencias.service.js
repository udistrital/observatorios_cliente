import axios from "axios";
import { environment } from "@/environments/environment";
import { EstructuraEvidenciaModel } from "@/model/estructura-evidencia.model";

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

export const estructurasEvidenciasService = {
  async listarPorAspecto(aspectoId) {
    const response = await api.get("/estructuras-evidencias/", {
      params: {
        aspecto_id: aspectoId,
      },
    });

    return EstructuraEvidenciaModel.fromApiList(response.data);
  },

  async obtener(id) {
    const response = await api.get(`/estructuras-evidencias/${id}/`);

    return EstructuraEvidenciaModel.fromApi(response.data);
  },

  async crear(data) {
    const estructura =
      data instanceof EstructuraEvidenciaModel
        ? data
        : new EstructuraEvidenciaModel(data);

    const response = await api.post(
      "/estructuras-evidencias/",
      estructura.toCreatePayload()
    );

    return {
      estructura: EstructuraEvidenciaModel.fromApi(response.data.estructura),
      estructuras_evidencias: EstructuraEvidenciaModel.fromApiList(
        response.data.estructuras_evidencias || []
      ),
    };
  },

  async actualizar(id, data) {
    const estructura =
      data instanceof EstructuraEvidenciaModel
        ? data
        : new EstructuraEvidenciaModel(data);

    const response = await api.patch(
      `/estructuras-evidencias/${id}/`,
      estructura.toUpdatePayload()
    );

    return {
      estructura: EstructuraEvidenciaModel.fromApi(response.data.estructura),
      estructuras_evidencias: EstructuraEvidenciaModel.fromApiList(
        response.data.estructuras_evidencias || []
      ),
    };
  },

  async eliminar(id) {
    const response = await api.delete(`/estructuras-evidencias/${id}/`);

    return response.data;
  },

  async desactivar(id) {
    const response = await api.delete(`/estructuras-evidencias/${id}/`);

    return {
      id: response.data.id,
      aspecto_id: response.data.aspecto_id,
      estructuras_evidencias: EstructuraEvidenciaModel.fromApiList(
        response.data.estructuras_evidencias || []
      ),
    };
  },
};
