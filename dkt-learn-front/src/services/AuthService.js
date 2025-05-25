import BaseService from "./BaseService";

class AuthService extends BaseService {
  /**
   * Registra um novo usuário
   * @param {string} name - Nome de usuário
   * @param {string} email - Email do usuário
   * @param {string} password - Senha
   * @param {boolean} isProfessor - Indica se é professor
   * @param {string} inviteCode - Código de convite (apenas para professores)
   * @returns {Promise} - Dados do usuário registrado
   */
  async register(
    name,
    email,
    password,
    isProfessor = false,
    inviteCode = null
  ) {
    try {
      const response = await this.post("/api/Auth/register", {
        username: name,
        email,
        password,
        confirmPassword: password,
        isProfessor,
        inviteCode,
      });
      return response;
    } catch (error) {
      throw this.handleError(error);
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
      const response = await this.post("/api/Auth/login", {
        username: emailOrUsername,
        password,
        rememberMe,
      });

      if (response.accessToken) {
        localStorage.setItem("token", response.accessToken);
        if (response.refreshToken) {
          localStorage.setItem("refreshToken", response.refreshToken);
        }
        // Parse user info from token
        const user = this._parseUserFromToken(response.accessToken);
        localStorage.setItem("user", JSON.stringify(user));
      }

      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Desloga o usuário atual
   * @returns {Promise}
   */
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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

      const response = await this.post("/api/Auth/refresh-token", {
        refreshToken: refreshToken,
      });

      if (response && response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("refreshToken", response.refreshToken);
      }

      return response;
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      throw this.handleError(error);
    }
  }

  /**
   * Redefine a senha do usuário usando um código de reset
   * @param {string} code - Código de reset de senha
   * @param {string} newPassword - Nova senha
   * @param {string} email - Email do usuário
   * @returns {Promise} - Resposta da operação
   */
  async resetPassword(code, newPassword, email) {
    try {
      if (!code || !newPassword || !email) {
        throw new Error("Código, nova senha e email são obrigatórios");
      }

      const response = await this.post("/api/Auth/reset-password", {
        code: code,
        newPassword,
        confirmPassword: newPassword,
        email,
      });

      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Verifica se o usuário está autenticado
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!localStorage.getItem("token");
  }

  /**
   * Retorna o usuário atual
   * @returns {object|null}
   */
  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user;
      } catch (error) {
        console.error(
          "AuthService: Erro ao parsear usuário do localStorage:",
          error
        );
        return null;
      }
    }
    return null;
  }

  /**
   * Verifica se o usuário atual tem determinada role
   * @param {string} role - Nome do papel a verificar
   * @returns {boolean}
   */
  hasRole(role) {
    const user = this.getCurrentUser();
    if (!user || !user.role) return false;

    const roles = Array.isArray(user.role) ? user.role : [user.role];
    return roles.includes(role);
  }

  /**
   * Extrai as informações do usuário do token JWT
   * @param {string} token - Token JWT
   * @returns {object} - Dados do usuário
   * @private
   */
  _parseUserFromToken(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      const payload = JSON.parse(jsonPayload);
      const user = {
        id: payload[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ],
        username:
          payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
        email: payload.email,
        role: payload[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ],
        fotoUrl: payload.fotoUrl,
      };
      return user;
    } catch (error) {
      console.error("AuthService: Erro ao parsear token JWT:", error);
      return {}; // Retorna objeto vazio em caso de erro, para evitar undefined
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
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
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
          errorMessage =
            "Acesso proibido. Você não tem permissão para acessar este recurso";
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
      errorMessage =
        "Não foi possível conectar ao servidor. Verifique sua conexão";
    } else {
      // Erro na configuração da requisição
      errorMessage = error.message;
    }

    const formattedError = new Error(errorMessage);
    formattedError.originalError = error;
    return formattedError;
  }

  async forgotPassword(email) {
    try {
      if (!email) {
        throw new Error("Email é obrigatório");
      }

      const response = await this.post("/api/Auth/request-reset-code", {
        email,
      });

      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    return this._handleError(error);
  }
}

export default new AuthService();
