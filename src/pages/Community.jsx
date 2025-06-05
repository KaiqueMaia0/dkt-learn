import React, { useState, useEffect, useCallback } from "react";
import CommunityService from "../services/CommunityService";
import AuthService from "../services/AuthService";

const getUserAvatar = (user) => {
  if (user?.fotoUrl) return user.fotoUrl;
  const name = user?.username || user?.email || "U";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=4b0082&color=fff`;
};

const ReplyField = ({ postId, authorName, onReply, disabled, currentUser }) => {
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!replyText.trim()) return;
    setIsSubmitting(true);
    try {
      await onReply(postId, replyText.trim());
      setReplyText("");
    } catch (error) {
      // Erro ao enviar resposta
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 flex gap-3">
      <img
        src={getUserAvatar(currentUser)}
        alt="avatar"
        className="w-10 h-10 rounded-full object-cover border-2 border-[#4b0082]"
      />
      <div className="flex-1">
        <textarea
          className="w-full rounded-lg border border-gray-300 p-3 text-base focus:ring-2 focus:ring-[#4b0082] 
          focus:border-[#4b0082] transition"
          rows={2}
          placeholder={`Responder a ${authorName}...`}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          disabled={disabled || isSubmitting}
        />
        <button
          onClick={handleSubmit}
          disabled={!replyText.trim() || disabled || isSubmitting}
          className="mt-2 px-5 py-2 rounded-lg bg-[#4b0082] text-white font-semibold hover:bg-[#3a006b] 
          transition disabled:opacity-60"
        >
          {isSubmitting ? "Respondendo..." : "Responder"}
        </button>
      </div>
    </div>
  );
};

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ titulo: "", conteudo: "" });
  const [editingPost, setEditingPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());

  useEffect(() => {
    setCurrentUser(AuthService.getCurrentUser());
  }, []);

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await CommunityService.getPosts();
      setPosts(Array.isArray(response) ? response : []);
    } catch {
      setError("Erro ao carregar posts. Por favor, tente novamente.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.titulo?.trim() || !newPost.conteudo?.trim()) {
      setError("Título e conteúdo são obrigatórios.");
      return;
    }
    try {
      setSubmitLoading(true);
      setError(null);
      await CommunityService.createPost(
        newPost.titulo.trim(),
        newPost.conteudo.trim()
      );
      setNewPost({ titulo: "", conteudo: "" });
      setSuccess("Post criado com sucesso!");
      await loadPosts();
    } catch {
      setError("Erro ao criar post. Por favor, tente novamente.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleUpdatePost = async (post) => {
    if (!editingPost?.titulo?.trim() || !editingPost?.conteudo?.trim()) {
      setError("Título e conteúdo são obrigatórios.");
      return;
    }
    try {
      setError(null);
      await CommunityService.updatePost(
        post.id,
        editingPost.titulo.trim(),
        editingPost.conteudo.trim()
      );
      setEditingPost(null);
      setSuccess("Post atualizado com sucesso!");
      await loadPosts();
    } catch {
      setError("Erro ao atualizar post. Por favor, tente novamente.");
    }
  };

  const handleDeletePost = async (post) => {
    if (!window.confirm("Tem certeza que deseja deletar este post?")) return;
    try {
      setError(null);
      await CommunityService.deletePost(post.id);
      setSuccess("Post deletado com sucesso!");
      await loadPosts();
    } catch {
      setError("Erro ao deletar post. Por favor, tente novamente.");
    }
  };

  const handleReply = async (postId, replyContent) => {
    try {
      setActionLoading((prev) => ({ ...prev, [`reply-${postId}`]: true }));
      setError(null);
      const newReply = await CommunityService.replyToPost(postId, replyContent);
      setSuccess("Resposta adicionada com sucesso!");
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, replies: [...(post.replies || []), newReply] }
            : post
        )
      );
    } catch {
      setError("Erro ao adicionar resposta. Por favor, tente novamente.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [`reply-${postId}`]: false }));
    }
  };

  const isUserLiked = (post) => {
    if (!currentUser || !post.likes) return false;
    return post.likes.includes(currentUser.username);
  };

  // Atualiza o post inteiro ao curtir/descurtir
  const handleLike = async (event, post) => {
    event.preventDefault();
    event.stopPropagation();
    if (!currentUser) {
      setError("Você precisa estar logado para curtir posts.");
      return;
    }
    try {
      const postId = post.id;
      setActionLoading((prev) => ({ ...prev, [`like-${postId}`]: true }));
      setError(null);
      await CommunityService.likePost(postId);
      await loadPosts(); // recarrega todos os posts
    } catch {
      setError(
        "Erro ao atualizar status de curtida. Por favor, tente novamente."
      );
    } finally {
      setActionLoading((prev) => ({ ...prev, [`like-${post.id}`]: false }));
    }
  };

  const handleEditCancel = () => {
    setEditingPost(null);
    setError(null);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("pt-BR");
    } catch {
      return "Data inválida";
    }
  };

  return (
    <main className="flex-1 bg-purple-50 flex flex-col py-12 px-6">
      <div className=" max-w-2xl mx-auto py-8 px-2">
        <h1 className="text-3xl font-bold text-[#4b0082] mb-8 text-center">
          Comunidade
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center">
            {success}
          </div>
        )}

        {/* Formulário de novo post */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Criar Novo Post</h2>
          <form onSubmit={handleCreatePost} className="flex flex-col gap-4">
            <input
              className="rounded-lg border border-gray-300 p-3 text-base focus:ring-2 focus:ring-[#4b0082]
              focus:border-[#4b0082] transition"
              type="text"
              placeholder="Título"
              value={newPost.titulo}
              onChange={(e) =>
                setNewPost({ ...newPost, titulo: e.target.value })
              }
              required
              disabled={submitLoading}
            />
            <textarea
              className="rounded-lg border border-gray-300 p-3 text-base focus:ring-2 focus:ring-[#4b0082]
              focus:border-[#4b0082] transition"
              rows={4}
              placeholder="Conteúdo"
              value={newPost.conteudo}
              onChange={(e) =>
                setNewPost({ ...newPost, conteudo: e.target.value })
              }
              required
              disabled={submitLoading}
            />
            <button
              type="submit"
              className="self-end px-6 py-2 rounded-lg bg-[#4b0082] text-white font-semibold hover:bg-[#3a006b] 
              transition disabled:opacity-60"
              disabled={
                submitLoading ||
                !newPost.titulo.trim() ||
                !newPost.conteudo.trim()
              }
            >
              {submitLoading ? "Publicando..." : "Publicar"}
            </button>
          </form>
        </div>

        {/* Lista de posts */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow p-6 animate-pulse"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
            Nenhum post encontrado. Seja o primeiro a criar um post!
          </div>
        ) : (
          posts.map((post) => {
            const postId = post.id;
            if (!postId) return null;
            const isEditing = editingPost && editingPost.id === postId;

            return (
              <div
                key={postId}
                className="bg-white rounded-2xl shadow-lg p-0 mb-8 border border-gray-100 overflow-hidden
                max-w-3xl mx-auto w-full min-w-[350px]"
              >
                {/* Header do post */}
                <div className="flex items-center gap-4 px-6 py-5 bg-gradient-to-r from-[#4b0082]/90 to-[#4b0082]/60">
                  <img
                    src={getUserAvatar(post)}
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                  />
                  <div>
                    <div className="font-semibold text-white text-base">
                      {post.username || "Usuário"}
                    </div>
                    <div className="text-xs text-purple-200">
                      {post.criadoEm
                        ? formatDate(post.criadoEm)
                        : "Data desconhecida"}
                    </div>
                  </div>
                </div>

                {/* Se estiver editando, mostra o formulário */}
                {isEditing ? (
                  <form
                    className="px-6 pt-4 pb-2 flex flex-col gap-3"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleUpdatePost(post);
                    }}
                  >
                    <input
                      className="rounded-lg border border-gray-300 p-3 text-base focus:ring-2 focus:ring-[#4b0082]
                       focus:border-[#4b0082] transition"
                      type="text"
                      placeholder="Título"
                      value={editingPost.titulo}
                      onChange={(e) =>
                        setEditingPost({
                          ...editingPost,
                          titulo: e.target.value,
                        })
                      }
                      required
                    />
                    <textarea
                      className="rounded-lg border border-gray-300 p-3 text-base focus:ring-2 focus:ring-[#4b0082]
                       focus:border-[#4b0082] transition"
                      rows={4}
                      placeholder="Conteúdo"
                      value={editingPost.conteudo}
                      onChange={(e) =>
                        setEditingPost({
                          ...editingPost,
                          conteudo: e.target.value,
                        })
                      }
                      required
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-lg bg-[#4b0082] text-white font-semibold hover:bg-[#3a006b] 
                        transition disabled:opacity-60"
                        disabled={
                          !editingPost.titulo?.trim() ||
                          !editingPost.conteudo?.trim()
                        }
                      >
                        Salvar
                      </button>
                      <button
                        type="button"
                        onClick={handleEditCancel}
                        className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold 
                        hover:bg-gray-100 transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  // Exibição normal do post
                  <div className="px-6 pt-4 pb-2">
                    <h3 className="text-2xl font-bold text-[#4b0082] mb-2 break-words">
                      {post.titulo || "Sem título"}
                    </h3>
                    <div className="text-base text-gray-800 mb-2 break-words">
                      {post.conteudo || "Sem conteúdo"}
                    </div>
                  </div>
                )}

                <div className="px-6 pb-4">
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <button
                      onClick={(event) => handleLike(event, post)}
                      className={`flex items-center gap-1 px-4 py-1.5 rounded-lg font-semibold transition ${
                        isUserLiked(post)
                          ? "bg-[#4b0082] text-white"
                          : "bg-gray-100 text-[#4b0082] hover:bg-[#e9e3f7]"
                      }`}
                      disabled={actionLoading[`like-${postId}`]}
                    >
                      <span>👍</span>
                      <span>
                        {actionLoading[`like-${postId}`]
                          ? "..."
                          : post.likes?.length || 0}
                      </span>
                    </button>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">
                      {post.replies?.length || 0} Respostas
                    </span>
                    {currentUser &&
                      currentUser.username === post.username &&
                      !isEditing && (
                        <>
                          <button
                            onClick={() =>
                              setEditingPost({
                                id: post.id,
                                username: post.username,
                                criadoEm: post.criadoEm,
                                titulo: post.titulo,
                                conteudo: post.conteudo,
                              })
                            }
                            className="ml-2 px-3 py-1 rounded-lg bg-yellow-100 text-yellow-800 font-semibold 
                            hover:bg-yellow-200 transition"
                            title="Editar post"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeletePost(post)}
                            className="ml-2 px-3 py-1 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition"
                            title="Deletar post"
                          >
                            Deletar
                          </button>
                        </>
                      )}
                  </div>
                </div>

                {/* Respostas */}
                {post.replies && post.replies.length > 0 && (
                  <div className="bg-gray-50 px-6 pt-4 pb-2 border-t border-gray-200">
                    <div className="font-semibold text-[#4b0082] mb-2">
                      Respostas ({post.replies.length})
                    </div>
                    {post.replies.map((reply, replyIndex) => (
                      <div
                        key={`${reply.username || "unknown"}-${
                          reply.criadoEm || replyIndex
                        }`}
                        className="flex gap-3 items-start mb-4"
                      >
                        <img
                          src={getUserAvatar(reply)}
                          alt="avatar"
                          className="w-9 h-9 rounded-full object-cover border-2 border-[#4b0082] mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center mb-1 gap-2">
                            <span className="text-xs text-[#4b0082] font-semibold">
                              {reply.username || "Usuário"}
                            </span>
                            <span className="text-xs text-gray-400">
                              {reply.criadoEm
                                ? formatDate(reply.criadoEm)
                                : "Data desconhecida"}
                            </span>
                          </div>
                          <div className="text-sm text-gray-700">
                            {reply.conteudo || "Sem conteúdo"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Campo de resposta */}
                {currentUser && (
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <ReplyField
                      postId={postId}
                      authorName={post.username || "Usuário"}
                      onReply={handleReply}
                      disabled={actionLoading[`reply-${postId}`]}
                      currentUser={currentUser}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </main>
  );
};

export default Community;
