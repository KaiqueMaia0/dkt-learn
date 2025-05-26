import axios from "axios";

const API_URL = "http://localhost:5027";

class BaseService 
{
  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        console.log("Requisição sendo enviada:", {
          url: config.url,
          method: config.method,
          headers: config.headers,
        });
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error("Erro na configuração da requisição:", error);
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => {
        console.log("Resposta recebida:", {
          status: response.status,
          data: response.data,
          headers: response.headers,
        });

        // Verifica se a resposta tem dados
        if (!response.data) {
          console.warn("Resposta sem dados:", response);
          return [];
        }

        // Se a resposta for um array, retorna diretamente
        if (Array.isArray(response.data)) {
          return response.data;
        }

        // Se a resposta tiver uma propriedade data, retorna ela
        if (response.data.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }

        // Se não for nenhum dos casos acima, retorna os dados como estão
        return response.data;
      },
      (error) => {
        console.error("Erro na resposta:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
          },
        });
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  async get(url, config = {}) {
    try {
      return await this.api.get(url, config);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post(url, data = {}, config = {}) {
    try {
      return await this.api.post(url, data, config);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put(url, data = {}, config = {}) {
    try {
      return await this.api.put(url, data, config);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(url, config = {}) {
    try {
      return await this.api.delete(url, config);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response && error.response.data && error.response.data.message) {
      return new Error(error.response.data.message);
    } else if (error.response && error.response.data) {
      // If there's data but no specific message field
      return new Error(JSON.stringify(error.response.data));
    }
    return error;
  }
}

export default BaseService;
