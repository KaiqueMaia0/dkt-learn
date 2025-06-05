import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import authback from "../assets/authback.png"; 

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
      await AuthService.forgotPassword(email);
      setSuccess("Código de recuperação enviado com sucesso!");
      setTimeout(() => {
        navigate("/reset-password", {
          state: { email },
          replace: true,
        });
      }, 2000);
    } catch (error) {
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
    <div
      className="flex justify-center items-center min-h-screen p-5"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.9) 40%, rgba(128,0,128,0.9) 100%), 
        url(${authback})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl text-[#4b0082] mb-2 font-bold">
            Recuperar Senha
          </h2>
          <p className="text-[#4b0082] text-base">
            Digite seu email para receber o código de recuperação.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-500 text-red-800 py-3 px-4 rounded-md mb-5 text-sm flex items-center">
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-800 p-4 mb-4 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-[#334155]"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              disabled={loading}
              className="py-3.5 px-4 border border-[#cbd5e1] rounded-lg text-base transition-colors duration-300 
              focus:outline-none focus:border-[#4b0082] focus:ring-2 focus:ring-[#3b82f6]"
            />
          </div>

          <button
            type="submit"
            className="bg-[#4b0082] text-white rounded-lg p-4 text-base font-semibold cursor-pointer transition-colors 
            duration-300 hover:bg-[#0d1257] disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar Código"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          Lembrou sua senha?{" "}
          <Link
            to="/login"
            className="text-[#4b0082] font-semibold hover:underline"
          >
            Voltar para o login
          </Link>
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
      await AuthService.login(emailOrUsername, password, rememberMe);
      navigate("/home");
    } catch (error) {
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
    <div
      className="flex justify-center items-center min-h-screen p-5"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.9) 40%, 
        rgba(128,0,128,0.9) 100%), url(${authback})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl text-[#4b0082] mb-2 font-bold">
            Entrar na DKT Learn
          </h2>
          <p className="text-[#4b0082] text-base">
            Bem-vindo de volta! Entre com seus dados para continuar.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-500 text-red-800 py-3 px-4 rounded-md mb-5 text-sm flex items-center">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="emailOrUsername"
              className="text-sm font-semibold text-[#334155]"
            >
              Email ou usuário
            </label>
            <input
              type="text"
              id="emailOrUsername"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="seu@email.com ou usuario"
              required
              className="py-3.5 px-4 border border-[#cbd5e1] rounded-lg text-base transition-colors duration-300 
              focus:outline-none focus:border-[#4b0082] focus:ring-2 focus:ring-[#3b82f6]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-[#334155]"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              required
              className="py-3.5 px-4 border border-[#cbd5e1] rounded-lg text-base transition-colors duration-300
              focus:outline-none focus:border-[#4b0082] focus:ring-2 focus:ring-[#3b82f6]"
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-[#4b0082]"
              />
              <label htmlFor="remember">Lembrar-me</label>
            </div>
            <Link
              to="/forgot-password"
              className="text-black font-semibold hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>

          <button
            type="submit"
            className="bg-[#4b0082] text-white rounded-lg p-4 text-base font-semibold cursor-pointer transition-colors 
            duration-300 hover:bg-[#0d1257] disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="flex items-center my-6 text-[#4b0082]">
          <div className="flex-grow border-b border-[#e2e8f0]"></div>
          <span className="px-4 text-sm">ou</span>
          <div className="flex-grow border-b border-[#e2e8f0]"></div>
        </div>

        <div className="flex flex-col gap-3">
          <button className="flex items-center justify-center gap-3 bg-white border border-[#e2e8f0] rounded-lg p-3.5 text-base 
          font-medium cursor-pointer transition-colors duration-300 hover:bg-[#f8fafc]">
            <span className="font-bold text-[#4b0082]">G</span>
            Entrar com Google
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-black">
          Não tem uma conta?{" "}
          <Link
            to="/signup"
            className="text-[#4b0082] font-semibold hover:underline"
          >
            Cadastre-se
          </Link>
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
      window.location.href = "/login";
    } catch (error) {
      setError(error.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen p-5"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.9) 40%, rgba(128,0,128,0.9) 100%), 
        url(${authback})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl text-[#4b0082] mb-2 font-bold">
            Criar Conta na DKT Learn
          </h2>
          <p className="text-[#4b0082] text-base">
            Junte-se a milhares de estudantes e professores
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-500 text-red-800 py-3 px-4 rounded-md mb-5 text-sm flex items-center">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-sm font-semibold text-[#334155]"
            >
              Nome completo
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              required
              className="py-3.5 px-4 border border-[#cbd5e1] rounded-lg text-base transition-colors duration-300 
              focus:outline-none focus:border-[#4b0082] focus:ring-2 focus:ring-[#3b82f6]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="signup-email"
              className="text-sm font-semibold text-[#334155]"
            >
              Email
            </label>
            <input
              type="email"
              id="signup-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="py-3.5 px-4 border border-[#cbd5e1] rounded-lg text-base transition-colors duration-300 
              focus:outline-none focus:border-[#4b0082] focus:ring-2 focus:ring-[#3b82f6]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="signup-password"
              className="text-sm font-semibold text-[#334155]"
            >
              Senha
            </label>
            <input
              type="password"
              id="signup-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crie uma senha forte"
              required
              className="py-3.5 px-4 border border-[#cbd5e1] rounded-lg text-base transition-colors duration-300 
              focus:outline-none focus:border-[#4b0082] focus:ring-2 focus:ring-[#3b82f6]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="confirm-password"
              className="text-sm font-semibold text-[#334155]"
            >
              Confirmar senha
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua senha"
              required
              className="py-3.5 px-4 border border-[#cbd5e1] rounded-lg text-base transition-colors duration-300 
              focus:outline-none focus:border-[#4b0082] focus:ring-2 focus:ring-[#3b82f6]"
            />
          </div>

          <div className="my-2.5 flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                id="is-professor"
                checked={isProfessor}
                onChange={(e) => setIsProfessor(e.target.checked)}
                className="w-5 h-5 accent-[#4b0082]"
              />
              <label
                htmlFor="is-professor"
                className="text-base font-medium text-[#4b0082]"
              >
                Sou professor
              </label>
            </div>
          </div>

          {isProfessor && (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="invite-code"
                className="text-sm font-semibold text-[#334155]"
              >
                Código de convite
              </label>
              <input
                type="text"
                id="invite-code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Digite o código de convite para professores"
                required={isProfessor}
                className="py-3.5 px-4 border border-[#cbd5e1] rounded-lg text-base transition-colors duration-300 
                focus:outline-none focus:border-[#4b0082] focus:ring-2 focus:ring-[#3b82f6]"
              />
              <small className="block mt-1.5 text-sm text-[#4b0082] italic">
                Para acesso como professor, é necessário um código de convite
                válido.
              </small>
            </div>
          )}

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                required
                className="w-4 h-4 accent-[#4b0082]"
              />
              <label htmlFor="terms">
                Concordo com os{" "}
                <a href="/terms" className="underline">
                  Termos de Serviço
                </a>{" "}
                e{" "}
                <a href="/privacy" className="underline">
                  Política de Privacidade
                </a>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#4b0082] text-white rounded-lg p-4 text-base font-semibold cursor-pointer transition-colors 
            duration-300 hover:bg-[#0d1257] disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Criando conta..." : "Criar Conta"}
          </button>
        </form>

        <div className="flex items-center my-6 text-[#4b0082]">
          <div className="flex-grow border-b border-[#e2e8f0]"></div>
          <span className="px-4 text-sm">ou</span>
          <div className="flex-grow border-b border-[#e2e8f0]"></div>
        </div>

        <div className="flex flex-col gap-3">
          <button className="flex items-center justify-center gap-3 bg-white border border-[#e2e8f0] rounded-lg p-3.5
           text-base font-medium cursor-pointer transition-colors duration-300 hover:bg-[#f8fafc]">
            <span className="font-bold text-[#4b0082]">G</span>
            Cadastre-se com Google
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-black">
          Já tem uma conta?{" "}
          <Link
            to="/login"
            className="text-[#4b0082] font-semibold hover:underline"
          >
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}
