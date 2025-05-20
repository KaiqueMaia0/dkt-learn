import React, { useState } from "react";
import AuthService from "../services/AuthService";
import "./Auth.css";

// Login Component
export function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await AuthService.login(emailOrUsername, password, rememberMe);
      // Redireciona para a página inicial após login
      window.location.href = "/home";
    } catch (error) {
      setError(
        error.message || "Erro ao fazer login. Verifique suas credenciais."
      );
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
            <a href="#reset" className="forgot-password">
              Esqueceu a senha?
            </a>
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
            <a href="/signup" className="auth-link">
              Cadastre-se
            </a>
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
          <h2>Criar Conta na EduCalc</h2>
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
            <a href="/login" className="auth-link">
              Entrar
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
