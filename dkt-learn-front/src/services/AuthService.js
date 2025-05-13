import axios from "axios";

const API_URL = "http://localhost:5027";

// Configuração do axios para incluir os tokens em requisições autenticadas
const authAxios = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar o token às requisições
authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com tokens expirados
authAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Se o token expirou (401) e não é uma tentativa de refresh
    if (error.response.status === 401 && !originalRequest._retry && originalRequest.url !== "/api/Auth/refresh-token") {
      originalRequest._retry = true;
      
      try {
        // Tenta renovar o token
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("Refresh token não encontrado");
        }
        
        const response = await axios.post(`${API_URL}/api/Auth/refresh-token`, {
          refreshToken: refreshToken
        });
        
        // Atualiza os tokens no localStorage
        const { token, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", newRefreshToken);
        
        // Refaz a requisição original com o novo token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return authAxios(originalRequest);
      } catch (error) {
        // Se não conseguir renovar, desloga o usuário
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        
        // Redireciona para login se necessário
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

class AuthService {
  /**
   * Registra um novo usuário
   * @param {string} username - Nome de usuário
   * @param {string} email - Email do usuário
   * @param {string} password - Senha
   * @param {boolean} isProfessor - Indica se é professor
   * @param {string} inviteCode - Código de convite (apenas para professores)
   * @returns {Promise} - Dados do usuário registrado
   */
  async register(username, email, password, isProfessor = false, inviteCode = "") {
    try {
      // Define o papel do usuário com base no tipo
      const role = isProfessor ? "Professor" : "Aluno";
      
      const response = await axios.post(`${API_URL}/api/Auth/register`, {
        username,
        email,
        password,
        role,
        inviteCode: isProfessor ? inviteCode : null
      });
      
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Autentica um usuário e armazena o token
   * @param {string} emailOrUsername - Email ou nome de usuário
   * @param {string} password - Senha
   * @param {boolean} rememberMe - Se deve manter a sessão ativa
   * @returns {Promise} - Dados do usuário autenticado
   */
  async login(emailOrUsername, password, rememberMe = false) {
    try {
      // Determina se o input é um email ou um nome de usuário
      const isEmail = emailOrUsername.includes('@');
      
      const loginData = {
        [isEmail ? 'email' : 'username']: emailOrUsername,
        password: password
      };
      
      const response = await axios.post(`${API_URL}/api/Auth/login`, loginData);
      
      // Armazena os tokens no localStorage
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        
        // Armazena informações do usuário decodificadas do JWT
        const user = this._parseUserFromToken(response.data.token);
        localStorage.setItem("user", JSON.stringify(user));
        
        // Se não for para lembrar, configura um temporizador para deslogar
        if (!rememberMe) {
          // Define um tempo de expiração - por exemplo, 1 hora
          const expirationTime = new Date().getTime() + 3600000; // 1 hora
          localStorage.setItem("sessionExpires", expirationTime);
        }
      }
      
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Desloga o usuário atual
   * @returns {Promise}
   */
  async logout() {
    try {
      const user = this.getCurrentUser();
      if (!user) {
        throw new Error("Nenhum usuário autenticado");
      }
      
      // Chama a API para invalidar o token no backend
      await authAxios.post(`/api/Auth/logout`);
      
      // Limpa os dados locais
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("sessionExpires");
      
      return { success: true, message: "Logout realizado com sucesso" };
    } catch (error) {
      // Mesmo em caso de erro na API, sempre limpa os tokens locais
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      
      throw this._handleError(error);
    }
  }

  /**
   * Renova o token de acesso usando o refresh token
   * @returns {Promise}
   */
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("Refresh token não encontrado");
      }
      
      const response = await axios.post(`${API_URL}/api/Auth/refresh-token`, {
        refreshToken: refreshToken
      });
      
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }
      
      return response.data;
    } catch (error) {
      // Em caso de erro, desloga o usuário
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      
      throw this._handleError(error);
    }
  }

  /**
   * Verifica se o usuário está autenticado
   * @returns {boolean}
   */
  isAuthenticated() {
    const token = localStorage.getItem("token");
    if (!token) return false;
    
    // Verifica se há uma expiração de sessão e se ela já passou
    const sessionExpires = localStorage.getItem("sessionExpires");
    if (sessionExpires && new Date().getTime() > parseInt(sessionExpires)) {
      this.logout();
      return false;
    }
    
    // Verifica se o token não está expirado
    const tokenExpiration = this._getTokenExpiration(token);
    return tokenExpiration > new Date().getTime() / 1000;
  }

  /**
   * Retorna o usuário atual
   * @returns {object|null}
   */
  getCurrentUser() {
    const userJson = localStorage.getItem("user");
    return userJson ? JSON.parse(userJson) : null;
  }

  /**
   * Verifica se o usuário atual tem determinada role
   * @param {string} role - Nome do papel a verificar
   * @returns {boolean}
   */
  hasRole(role) {
    const user = this.getCurrentUser();
    if (!user || !user.role) return false;
    
    // Se o role do usuário for uma string, converte para array para verificação
    const roles = Array.isArray(user.role) ? user.role : [user.role];
    return roles.includes(role);
  }

  /**
   * Verifica se um endpoint está acessível com as permissões atuais
   * @returns {Promise}
   */
  async checkAuthEndpoint() {
    try {
      const response = await authAxios.get(`/api/Auth/Auth-endpoint`);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Verifica se tem acesso ao endpoint de Admin
   * @returns {Promise}
   */
  async checkAdminEndpoint() {
    try {
      const response = await authAxios.get(`/api/Auth/Admin-endpoint`);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Métodos privados auxiliares
  
  /**
   * Extrai as informações do usuário do token JWT
   * @param {string} token - Token JWT
   * @returns {object} - Dados do usuário
   * @private
   */
  _parseUserFromToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const payload = JSON.parse(jsonPayload);
      
      // Extrai as claims relevantes
      const user = {
        id: payload.nameid || payload.sub,
        username: payload.unique_name,
        email: payload.email,
        role: payload.role
      };
      
      return user;
    } catch (error) {
      console.error("Erro ao parsear token:", error);
      return null;
    }
  }

  /**
   * Obtém o timestamp de expiração do token JWT
   * @param {string} token - Token JWT
   * @returns {number} - Timestamp da expiração
   * @private
   */
  _getTokenExpiration(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const payload = JSON.parse(jsonPayload);
      return payload.exp;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Trata os erros da API de forma padronizada
   * @param {Error} error - Objeto de erro
   * @returns {Error} - Erro tratado
   * @private
   */
  _handleError(error) {
    let errorMessage = "Ocorreu um erro inesperado";
    
    if (error.response) {
      // Resposta da API com código de erro
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          errorMessage = data.message || data || "Dados inválidos fornecidos";
          break;
        case 401:
          errorMessage = "Não autorizado. Faça login novamente";
          break;
        case 403:
          errorMessage = "Acesso proibido. Você não tem permissão para acessar este recurso";
          break;
        case 404:
          errorMessage = "Recurso não encontrado";
          break;
        case 500:
          errorMessage = "Erro do servidor. Tente novamente mais tarde";
          break;
        default:
          errorMessage = data.message || "Erro ao processar a solicitação";
      }
    } else if (error.request) {
      // Sem resposta da API
      errorMessage = "Não foi possível conectar ao servidor. Verifique sua conexão";
    } else {
      // Erro na configuração da requisição
      errorMessage = error.message;
    }
    
    const formattedError = new Error(errorMessage);
    formattedError.originalError = error;
    return formattedError;
  }
}

export default new AuthService();