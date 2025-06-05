import BaseService from "./BaseService";

class UserService extends BaseService {
  /**
   * Atualiza os dados do usuário
   * @param {Object} userData - Dados do usuário para atualização
   * @returns {Promise} - Dados do usuário atualizados
   */
  async updateUser(userData) {
    try {
      const response = await this.put("/api/User/update-user", userData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtém a lista de todos os usuários (apenas para Admin)
   * @returns {Promise} - Lista de usuários
   */
  async getUsers() {
    return this.get("/api/User/get-users");
  }

  /**
   * Deleta um usuário (apenas para Admin)
   * @param {Object} userData - Dados do usuário para deletar
   * @returns {Promise} - Resposta da operação
   */
  async deleteUser(userData) {
    return this.delete("/api/User/delete-users", userData);
  }

  async getUserProfile() {
    try {
      const response = await this.get("/api/User/profile");
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      const response = await this.post("/api/User/change-password", {
        currentPassword,
        newPassword,
        confirmPassword: newPassword,
      });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      return new Error(error.response.data.message || "Erro na operação");
    }
    return error;
  }
}

export default new UserService();
