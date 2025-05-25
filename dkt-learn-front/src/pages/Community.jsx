import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  IconButton,
  Avatar,
  Alert,
  Skeleton,
  Snackbar,
} from "@mui/material";
import { ThumbUp, Comment, Delete, Edit } from "@mui/icons-material";
import CommunityService from "../services/CommunityService";
import AuthService from "../services/AuthService";

// Componente separado para o campo de resposta - garantindo isolamento
const ReplyField = ({ postId, authorName, onReply, disabled }) => {
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!replyText.trim()) return;

    setIsSubmitting(true);
    try {
      await onReply(postId, replyText.trim());
      setReplyText(""); // Limpar apenas este campo
    } catch (error) {
      console.error("Erro ao enviar resposta:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        mt: 2,
        pt: 2,
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <TextField
        fullWidth
        label={`Responder a ${authorName}`}
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        multiline
        rows={2}
        size="small"
        variant="outlined"
        placeholder={`Digite sua resposta para ${authorName}...`}
        disabled={disabled || isSubmitting}
      />
      <Button
        onClick={handleSubmit}
        variant="contained"
        color="primary"
        sx={{ mt: 1 }}
        disabled={!replyText.trim() || disabled || isSubmitting}
        size="small"
      >
        {isSubmitting ? "Respondendo..." : "Responder"}
      </Button>
    </Box>
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

  // Gerenciar currentUser como estado para reatividade
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());

  // Opcional: Efeito para re-verificar o usuário logado se necessário
  useEffect(() => {
    const checkUser = () => {
      const user = AuthService.getCurrentUser();
      setCurrentUser(user);
    };
    checkUser();
  }, []);

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await CommunityService.getPosts();

      if (Array.isArray(response)) {
        setPosts(response);
      } else {
        setPosts([]);
      }
    } catch (err) {
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

      const result = await CommunityService.createPost(
        newPost.titulo.trim(),
        newPost.conteudo.trim()
      );

      setNewPost({ titulo: "", conteudo: "" });
      setSuccess("Post criado com sucesso!");
      await loadPosts();
    } catch (err) {
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
      const result = await CommunityService.updatePost(
        post.id,
        editingPost.titulo.trim(),
        editingPost.conteudo.trim()
      );
      setEditingPost(null);
      setSuccess("Post atualizado com sucesso!");
      await loadPosts();
    } catch (err) {
      setError("Erro ao atualizar post. Por favor, tente novamente.");
    }
  };

  const handleDeletePost = async (post) => {
    if (!window.confirm("Tem certeza que deseja deletar este post?")) {
      return;
    }

    try {
      setError(null);
      const result = await CommunityService.deletePost(post.id);
      setSuccess("Post deletado com sucesso!");
      await loadPosts();
    } catch (err) {
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
        prevPosts.map((post) => {
          if (post.id === postId) {
            const updatedReplies = [...(post.replies || []), newReply];
            return { ...post, replies: updatedReplies };
          }
          return post;
        })
      );
    } catch (err) {
      setError("Erro ao adicionar resposta. Por favor, tente novamente.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [`reply-${postId}`]: false }));
    }
  };

  // Função para verificar se o usuário curtiu o post
  const isUserLiked = (post) => {
    if (!currentUser || !post.likes) {
      return false;
    }
    return post.likes.includes(currentUser.username);
  };

  const handleLike = async (event, post) => {
    event.preventDefault();
    event.stopPropagation();

    if (!currentUser) {
      setError("Você precisa estar logado para curtir posts.");
      return;
    }

    try {
      // Usar o ID único do post para a requisição de like
      const postId = post.id; // Usar post.id
      setActionLoading((prev) => ({ ...prev, [`like-${postId}`]: true }));
      setError(null);

      // Chamar o serviço de toggle like. Esperamos que o backend retorne o post atualizado.
      const updatedPost = await CommunityService.likePost(postId); // Passar postId

      // Atualizar o estado local com o post atualizado retornado pelo backend
      setPosts((prevPosts) =>
        prevPosts.map(
          (p) => (p.id === postId ? updatedPost : p) // Substituir o post antigo pelo atualizado
        )
      );

      setSuccess("Status de curtida atualizado!"); // Mensagem de sucesso mais genérica
    } catch (err) {
      console.error("Erro ao alternar curtida:", err);
      setError(
        "Erro ao atualizar status de curtida. Por favor, tente novamente."
      );
    } finally {
      const postId = post.id; // Usar post.id
      setActionLoading((prev) => ({ ...prev, [`like-${postId}`]: false }));
    }
  };

  const handleEditCancel = () => {
    setEditingPost(null);
    setError(null);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("pt-BR");
    } catch (err) {
      return "Data inválida";
    }
  };

  // Adicionar estado para controlar a exibição do modal de curtidas
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [currentPostLikes, setCurrentPostLikes] = useState([]);

  const handleShowLikes = (likes) => {
    setCurrentPostLikes(likes || []);
    setShowLikesModal(true);
  };

  const handleCloseLikesModal = () => {
    setShowLikesModal(false);
    setCurrentPostLikes([]);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Comunidade
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
        message={success}
      />

      {/* Formulário de novo post */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Criar Novo Post
          </Typography>
          <Box component="form" onSubmit={handleCreatePost}>
            <TextField
              fullWidth
              label="Título"
              value={newPost.titulo}
              onChange={(e) =>
                setNewPost({ ...newPost, titulo: e.target.value })
              }
              margin="normal"
              required
              disabled={submitLoading}
            />
            <TextField
              fullWidth
              label="Conteúdo"
              value={newPost.conteudo}
              onChange={(e) =>
                setNewPost({ ...newPost, conteudo: e.target.value })
              }
              margin="normal"
              multiline
              rows={4}
              required
              disabled={submitLoading}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              disabled={
                submitLoading ||
                !newPost.titulo.trim() ||
                !newPost.conteudo.trim()
              }
            >
              {submitLoading ? "Publicando..." : "Publicar"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Lista de posts */}
      {loading ? (
        Array.from({ length: 3 }).map((_, index) => (
          <Card key={`skeleton-${index}`} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  sx={{ mr: 2 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </Box>
              </Box>
              <Skeleton variant="text" />
              <Skeleton variant="text" />
              <Skeleton variant="text" width="80%" />
            </CardContent>
          </Card>
        ))
      ) : posts.length === 0 ? (
        <Card>
          <CardContent>
            <Typography
              variant="body1"
              textAlign="center"
              color="text.secondary"
            >
              Nenhum post encontrado. Seja o primeiro a criar um post!
            </Typography>
          </CardContent>
        </Card>
      ) : (
        posts.map((post) => {
          const postId = post.id;

          if (!postId) {
            console.warn("Post sem ID recebido:", post);
            return null;
          }

          return (
            <Card key={postId} sx={{ mb: 2 }}>
              <CardContent>
                {editingPost && editingPost.id === postId ? (
                  <Box>
                    <TextField
                      fullWidth
                      label="Título"
                      value={editingPost.titulo || ""}
                      onChange={(e) =>
                        setEditingPost({
                          ...editingPost,
                          titulo: e.target.value,
                        })
                      }
                      margin="normal"
                      required
                    />
                    <TextField
                      fullWidth
                      label="Conteúdo"
                      value={editingPost.conteudo || ""}
                      onChange={(e) =>
                        setEditingPost({
                          ...editingPost,
                          conteudo: e.target.value,
                        })
                      }
                      margin="normal"
                      multiline
                      rows={4}
                      required
                    />
                    <Box sx={{ mt: 2 }}>
                      <Button
                        onClick={() => handleUpdatePost(post)}
                        variant="contained"
                        color="primary"
                        sx={{ mr: 1 }}
                        disabled={
                          !editingPost.titulo?.trim() ||
                          !editingPost.conteudo?.trim()
                        }
                      >
                        Salvar
                      </Button>
                      <Button onClick={handleEditCancel} variant="outlined">
                        Cancelar
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar sx={{ mr: 2 }}>
                        {post.username?.[0]?.toUpperCase() || "U"}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {post.titulo || "Sem título"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Por {post.username || "Usuário"} em{" "}
                          {post.criadoEm
                            ? formatDate(post.criadoEm)
                            : "Data desconhecida"}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body1" paragraph>
                      {post.conteudo || "Sem conteúdo"}
                    </Typography>
                  </>
                )}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mt: 2,
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Button
                    onClick={(event) => handleLike(event, post)}
                    startIcon={<ThumbUp />}
                    color={isUserLiked(post) ? "primary" : "inherit"}
                    variant={isUserLiked(post) ? "contained" : "outlined"}
                    size="small"
                    disabled={actionLoading[`like-${postId}`]}
                  >
                    {actionLoading[`like-${postId}`]
                      ? "..."
                      : post.likes?.length || 0}
                  </Button>

                  <Button
                    size="small"
                    startIcon={<Comment />}
                    variant="outlined"
                  >
                    {post.replies?.length || 0} Respostas
                  </Button>

                  {currentUser && currentUser.username === post.username && (
                    <>
                      <IconButton
                        onClick={() =>
                          setEditingPost({
                            id: post.id,
                            username: post.username,
                            criadoEm: post.criadoEm,
                            titulo: post.titulo,
                            conteudo: post.conteudo,
                          })
                        }
                        color="primary"
                        title="Editar post"
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeletePost(post)}
                        color="error"
                        title="Deletar post"
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </>
                  )}
                </Box>

                {post.replies && post.replies.length > 0 && (
                  <Box
                    sx={{
                      mt: 3,
                      pt: 2,
                      borderTop: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom>
                      Respostas ({post.replies.length})
                    </Typography>
                    {post.replies.map((reply, replyIndex) => (
                      <Box
                        key={`${reply.username || "unknown"}-${
                          reply.criadoEm || replyIndex
                        }`}
                        sx={{
                          ml: 2,
                          mb: 2,
                          p: 2,
                          bgcolor: "grey.50",
                          borderRadius: 1,
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <Avatar sx={{ mr: 1, width: 24, height: 24 }}>
                            {reply.username?.[0]?.toUpperCase() || "U"}
                          </Avatar>
                          <Typography variant="body2" color="text.secondary">
                            {reply.username || "Usuário"} •{" "}
                            {reply.criadoEm
                              ? formatDate(reply.criadoEm)
                              : "Data desconhecida"}
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {reply.conteudo || "Sem conteúdo"}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {currentUser && (
                  <ReplyField
                    postId={postId}
                    authorName={post.username || "Usuário"}
                    onReply={handleReply}
                    disabled={actionLoading[`reply-${postId}`]}
                  />
                )}
              </CardContent>
            </Card>
          );
        })
      )}

      {/* Aqui futuramente será o Modal de Curtidas */}
      {/* <LikesModal
        open={showLikesModal}
        onClose={handleCloseLikesModal}
        likes={currentPostLikes}
      /> */}
    </Container>
  );
};

export default Community;
