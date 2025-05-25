import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import "./Auth.css";

// ForgotPassword Component
export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email) {
      setError("Por favor, insira seu email");
      setLoading(false);
      return;
    }

    try {
      const response = await AuthService.forgotPassword(email);
      // Consider any response as success since the email was sent
      setSuccess("Código de recuperação enviado com sucesso!");
      // Redireciona para a página de reset de senha após 2 segundos
      setTimeout(() => {
        navigate("/reset-password", {
          state: { email },
          replace: true,
        });
      }, 2000);
    } catch (error) {
      console.error("Erro ao recuperar senha:", error);
      if (error.message.includes("não encontrado")) {
        setError("Email não encontrado em nossa base de dados");
      } else if (error.message.includes("inválido")) {
        setError("Por favor, insira um email válido");
      } else {
        setError(
          "Erro ao processar a solicitação. Por favor, tente novamente mais tarde."
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
          <h2>Recuperar Senha</h2>
          <p>Digite seu email para receber o código de recuperação.</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Enviando..." : "Enviar Código"}
          </button>
        </form>

        <div className="auth-footer">
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
}

// Login Component
export function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Tentando login com:", {
        emailOrUsername,
        password,
        rememberMe,
      });
      const response = await AuthService.login(
        emailOrUsername,
        password,
        rememberMe
      );
      console.log("Resposta do login:", response);

      // Redireciona para a página inicial após o login bem-sucedido
      navigate("/home");
    } catch (error) {
      console.error("Erro ao realizar login:", error);

      // Mensagens de erro mais amigáveis
      if (error.message.includes("Email ou senha incorretos")) {
        setError(
          "Email ou senha incorretos. Por favor, verifique suas credenciais."
        );
      } else if (error.message.includes("Conta não encontrada")) {
        setError(
          "Conta não encontrada. Verifique se o email está correto ou crie uma nova conta."
        );
      } else if (error.message.includes("Conta bloqueada")) {
        setError(
          "Sua conta está bloqueada ou desativada. Entre em contato com o suporte."
        );
      } else if (error.message.includes("credenciais")) {
        setError(
          "Email ou senha incorretos. Por favor, verifique suas credenciais."
        );
      } else {
        setError(
          error.message || "Erro ao realizar login. Por favor, tente novamente."
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
          <h2>Entrar na DKT Learn</h2>
          <p>Bem-vindo de volta! Entre com seus dados para continuar.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="emailOrUsername">Email ou usuário</label>
            <input
              type="text"
              id="emailOrUsername"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="seu@email.com ou usuario"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              required
            />
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Lembrar-me</label>
            </div>
            <Link to="/forgot-password" className="forgot-password">
              Esqueceu a senha?
            </Link>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="auth-divider">
          <span>ou</span>
        </div>

        <div className="social-auth">
          <button className="google-auth">
            <span className="icon">G</span>
            Entrar com Google
          </button>
        </div>

        <div className="auth-footer">
          <p>
            Não tem uma conta?{" "}
            <Link to="/signup" className="auth-link">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Signup Component
export function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isProfessor, setIsProfessor] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (!agreeTerms) {
      setError("Você precisa concordar com os termos de serviço");
      return;
    }

    setLoading(true);

    try {
      await AuthService.register(
        name,
        email,
        password,
        isProfessor,
        inviteCode
      );
      // Redirect to login page after successful registration
      window.location.href = "/login";
    } catch (error) {
      setError(error.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card signup-card">
        <div className="auth-header">
          <h2>Criar Conta na DKT Learn</h2>
          <p>Junte-se a milhares de estudantes e professores</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Nome completo</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="signup-email">Email</label>
            <input
              type="email"
              id="signup-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="signup-password">Senha</label>
            <input
              type="password"
              id="signup-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crie uma senha forte"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirmar senha</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua senha"
              required
            />
          </div>

          <div className="form-group is-professor-group">
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="is-professor"
                checked={isProfessor}
                onChange={(e) => setIsProfessor(e.target.checked)}
              />
              <label htmlFor="is-professor">Sou professor</label>
            </div>
          </div>

          {isProfessor && (
            <div className="form-group">
              <label htmlFor="invite-code">Código de convite</label>
              <input
                type="text"
                id="invite-code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Digite o código de convite para professores"
                required={isProfessor}
              />
              <small className="info-text">
                Para acesso como professor, é necessário um código de convite
                válido.
              </small>
            </div>
          )}

          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                required
              />
              <label htmlFor="terms">
                Concordo com os <a href="/terms">Termos de Serviço</a> e{" "}
                <a href="/privacy">Política de Privacidade</a>
              </label>
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Criando conta..." : "Criar Conta"}
          </button>
        </form>

        <div className="auth-divider">
          <span>ou</span>
        </div>

        <div className="social-auth">
          <button className="google-auth">
            <span className="icon">G</span>
            Cadastre-se com Google
          </button>
        </div>

        <div className="auth-footer">
          <p>
            Já tem uma conta?{" "}
            <Link to="/login" className="auth-link">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
