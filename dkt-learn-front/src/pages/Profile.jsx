import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  Alert,
} from "@mui/material";
import UserService from "../services/UserService";
import AuthService from "../services/AuthService";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fotoUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    console.log("Usuário recuperado:", currentUser);
    console.log("Conteúdo de currentUser:", currentUser);
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        fotoUrl: currentUser.fotoUrl,
      });
      console.log("Form Data set:", {
        username: currentUser.username,
        email: currentUser.email,
        fotoUrl: currentUser.fotoUrl,
      });
    }
    setLoading(false);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);

      await UserService.updateUser(formData);
      setSuccess("Perfil atualizado com sucesso!");

      // Atualiza o usuário no localStorage
      const updatedUser = {
        ...user,
        ...formData,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      setError(
        err.message || "Erro ao atualizar perfil. Por favor, tente novamente."
      );
      console.error("Erro ao atualizar perfil:", err);
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, px: 2 }}>
        <Typography>Carregando perfil...</Typography>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container sx={{ py: 4, px: 2 }}>
        <Alert severity="error">
          Usuário não encontrado. Por favor, faça login novamente.
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4, px: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Meu Perfil
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                src={user.fotoUrl}
                sx={{ width: 150, height: 150, mb: 2 }}
              >
                {user.username?.[0]?.toUpperCase() || "U"}
              </Avatar>
              <Typography variant="h6" gutterBottom>
                {user.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.role === "Professor" ? "Professor" : "Estudante"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={8}>
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Nome de usuário"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="URL da foto"
                  name="fotoUrl"
                  value={formData.fotoUrl}
                  onChange={handleInputChange}
                  margin="normal"
                  helperText="URL da sua foto de perfil (opcional)"
                />

                <Divider sx={{ my: 3 }} />

                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!formData.username || !formData.email}
                  >
                    Salvar Alterações
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Profile;
