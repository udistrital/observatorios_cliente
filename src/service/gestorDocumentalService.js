import { environment } from "../eviroments";

const authHeader = () => {
  const token = localStorage.getItem("access_token");

  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`,
  };
};

const gestorApi = axios.create({
    baseURL: environment.GESTOR_DOCUMENTAL,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 30000,
  });

const request = async (method, path, data = null, params = null) => {
  const config = {
    method,
    url: path,
    headers: {
      ...authHeader(),
    },
    params,
  };

  if (data) {
    config.data = data;
  }

  const response = await gestorApi(config);
  return response.data;
};

export const gestorGet = (path, params = null) =>
  request("GET", path, null, params);

export const gestorPost = (path, data) =>
  request("POST", path, data);

export const gestorPut = (path, data) =>
  request("PUT", path, data);

export const gestorDelete = (path) =>
  request("DELETE", path);

export default {
  get: gestorGet,
  post: gestorPost,
  put: gestorPut,
  delete: gestorDelete,
};

