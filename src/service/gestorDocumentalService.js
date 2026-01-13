import axios from "axios";
import { environment } from "../eviroments";

const gestorDocumentalApi = axios.create({
  baseURL: environment.GESTOR_DOCUMENTAL,
  headers: {
    "Content-Type": "application/json",
  },
});

gestorDocumentalApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

gestorDocumentalApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("❌ Error Gestor Documental:", error);
    return Promise.reject(error);
  }
);

export default gestorDocumentalApi;
