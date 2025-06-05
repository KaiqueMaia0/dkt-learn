import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthService from "../services/AuthService";
import authback from "../assets/authback.png"; 

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
    if (password.length < 8)
      errors.push("A senha deve ter pelo menos 8 caracteres");
    if (!/[A-Z]/.test(password))
      errors.push("A senha deve conter pelo menos uma letra maiúscula");
    if (!/[a-z]/.test(password))
      errors.push("A senha deve conter pelo menos uma letra minúscula");
    if (!/[0-9]/.test(password))
      errors.push("A senha deve conter pelo menos um número");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      errors.push("A senha deve conter pelo menos um caractere especial");
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
      await AuthService.resetPassword(code, newPassword, email);
      setSuccess("Senha alterada com sucesso!");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
    } catch (error) {
      if (error.message.includes("Código inválido ou expirado")) {
        setError(
          <div>
            Código inválido ou expirado. Por favor,{" "}
            <Link
              to="/forgot-password"
              className="text-[#4b0082] underline font-semibold"
            >
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
            Redefinir Senha
          </h2>
          <p className="text-[#4b0082] text-base">
            Digite o código recebido e sua nova senha.
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
              htmlFor="code"
              className="text-sm font-semibold text-[#334155]"
            >
              Código de Recuperação
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Digite o código recebido"
              required
              disabled={loading}
              maxLength={6}
              className="py-3.5 px-4 border border-[#cbd5e1] rounded-lg text-base transition-colors duration-300 
              focus:outline-none focus:border-[#4b0082] focus:ring-2 focus:ring-[#3b82f6]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="newPassword"
              className="text-sm font-semibold text-[#334155]"
            >
              Nova Senha
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Digite sua nova senha"
              required
              disabled={loading}
              minLength={8}
              className="py-3.5 px-4 border border-[#cbd5e1] rounded-lg text-base transition-colors 
              duration-300 focus:outline-none focus:border-[#4b0082] focus:ring-2 focus:ring-[#3b82f6]"
            />
            <small className="block mt-1.5 text-sm text-[#4b0082] italic">
              A senha deve conter:
              <ul className="list-disc list-inside text-left ml-2 mt-1">
                <li>Pelo menos 8 caracteres</li>
                <li>Uma letra maiúscula</li>
                <li>Uma letra minúscula</li>
                <li>Um número</li>
                <li>
                  Um caractere especial (!@#$%^&*(),.?":&#123;&#125;|&lt;&gt;)
                </li>
              </ul>
            </small>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-semibold text-[#334155]"
            >
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua nova senha"
              required
              disabled={loading}
              minLength={8}
              className="py-3.5 px-4 border border-[#cbd5e1] rounded-lg text-base transition-colors duration-300 
              focus:outline-none focus:border-[#4b0082] focus:ring-2 focus:ring-[#3b82f6]"
            />
          </div>

          <button
            type="submit"
            className="bg-[#4b0082] text-white border-none rounded-lg p-4 text-base font-semibold cursor-pointer 
            transition-colors duration-300 hover:bg-[#0d1257] disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Redefinindo..." : "Redefinir Senha"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-black">
          <p>
            Lembrou sua senha?{" "}
            <Link
              to="/login"
              className="text-[#4b0082] font-semibold hover:underline"
            >
              Voltar para o login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
