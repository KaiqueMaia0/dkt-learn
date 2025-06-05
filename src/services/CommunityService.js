import BaseService from "./BaseService";

class CommunityService extends BaseService {
  /**
   * Obtém todos os posts da comunidade
   * @returns {Promise} - Lista de posts
   */
  async getPosts() {
    try {
      return await this.get("/api/Community/posts");
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Cria um novo post
   * @param {string} titulo - Título do post
   * @param {string} conteudo - Conteúdo do post
   * @returns {Promise} - Post criado
   */
  async createPost(titulo, conteudo) {
    try {
      return await this.post("/api/Community/posts", {
        Titulo: titulo,
        Conteudo: conteudo,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Atualiza um post existente
   * @param {string} id - ID único do post
   * @param {string} titulo - Novo título do post
   * @param {string} conteudo - Novo conteúdo do post
   * @returns {Promise} - Post atualizado
   */
  async updatePost(id, titulo, conteudo) {
    try {
      return await this.put(`/api/Community/posts/${id}`, {
        Titulo: titulo,
        Conteudo: conteudo,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Deleta um post
   * @param {string} id - ID único do post
   * @returns {Promise} - Resposta da operação
   */
  async deletePost(id) {
    try {
      return await this.delete(`/api/Community/posts/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Adiciona uma resposta a um post
   * @param {string} postId - ID único do post
   * @param {string} conteudo - Conteúdo da resposta
   * @returns {Promise} - Resposta criada
   */
  async replyToPost(postId, conteudo) {
    try {
      return await this.post(`/api/Community/posts/${postId}/replies`, {
        Conteudo: conteudo,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Curte um post
   * @param {string} id - ID único do post
   * @returns {Promise} - Resposta da operação
   */
  async likePost(id) {
    try {
      return await this.post(`/api/Community/posts/${id}/like`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      return new Error(error.response.data.message || "Erro na operação");
    } else if (error.response && error.response.data) {
      // If there's data but no specific message field
      return new Error(JSON.stringify(error.response.data));
    }
    return error;
  }
}

export default new CommunityService();
