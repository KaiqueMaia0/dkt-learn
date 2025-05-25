import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthService from "../services/AuthService";
import "./Auth.css";

const ResetPassword = () => {
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
      errors.push("A senha deve ter pelo menos 8 caracteres");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("A senha deve conter pelo menos uma letra maiúscula");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("A senha deve conter pelo menos uma letra minúscula");
    }

    if (!/[0-9]/.test(password)) {
      errors.push("A senha deve conter pelo menos um número");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("A senha deve conter pelo menos um caractere especial");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!code) {
      setError("Por favor, insira o código de recuperação");
      setLoading(false);
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Por favor, preencha todos os campos");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      setError(passwordErrors.join(". "));
      setLoading(false);
      return;
    }

    try {
      console.log("Enviando requisição de reset de senha:", {
        code,
        email,
        newPassword,
      });

      const response = await AuthService.resetPassword(
        code,
        newPassword,
        email
      );
      console.log("Resposta do servidor:", response);

      setSuccess("Senha alterada com sucesso!");
      // Redireciona para a página de login após 2 segundos
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
    } catch (error) {
      console.error("Erro ao resetar senha:", error);

      if (error.message.includes("Código inválido ou expirado")) {
        setError(
          <div>
            Código inválido ou expirado. Por favor,{" "}
            <Link to="/forgot-password" className="auth-link">
              solicite um novo código
            </Link>
            .
          </div>
        );
      } else if (error.message.includes("senha")) {
        setError("A senha não atende aos requisitos mínimos");
      } else if (error.message.includes("email")) {
        setError("Email inválido ou não encontrado");
      } else {
        setError(
          error.message ||
            "Erro ao processar a solicitação. Por favor, tente novamente."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Redefinir Senha</h2>
          <p>Digite o código recebido e sua nova senha.</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="code">Código de Recuperação</label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Digite o código recebido"
              required
              disabled={loading}
              maxLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">Nova Senha</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Digite sua nova senha"
              required
              disabled={loading}
              minLength={8}
            />
            <small className="info-text">
              A senha deve conter:
              <ul>
                <li>Pelo menos 8 caracteres</li>
                <li>Uma letra maiúscula</li>
                <li>Uma letra minúscula</li>
                <li>Um número</li>
                <li>Um caractere especial (!@#$%^&*(),.?":{}|&lt;&gt;)</li>
              </ul>
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua nova senha"
              required
              disabled={loading}
              minLength={8}
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Processando..." : "Redefinir Senha"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Não recebeu o código?{" "}
            <Link to="/forgot-password" className="auth-link">
              Solicitar novo código
            </Link>
          </p>
          <p>
            Lembrou sua senha?{" "}
            <Link to="/login" className="auth-link">
              Voltar para o login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
