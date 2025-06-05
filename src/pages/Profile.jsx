import React, { useState, useEffect } from "react";
import AuthService from "../services/AuthService";
import UserService from "../services/UserService";
import { main } from "@popperjs/core";

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
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        fotoUrl: currentUser.fotoUrl || "",
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
    setError(null);
    setSuccess(null);

    try {
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
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <span className="text-lg text-gray-700">Carregando perfil...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow p-6">
          <span className="text-red-600 font-semibold">
            Usuário não encontrado. Por favor, faça login novamente.
          </span>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 bg-purple-50 flex flex-col py-12 px-6">
      <div className="max-w-3xl mx-auto w-full px-4 py-10">
        <h1 className="text-3xl font-bold text-center text-[#4b0082] mb-10">
          Meu Perfil
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

        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex flex-col items-center w-full md:w-1/3">
            <div className="relative">
              <img
                src={
                  formData.fotoUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.username || "U"
                  )}&background=4b0082&color=fff`
                }
                alt="Avatar"
                className="w-36 h-36 rounded-full object-cover border-4 border-[#4b0082] shadow"
              />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-[#4b0082]">
              {user.username}
            </h2>
            <span className="text-gray-500 text-sm">
              {user.role === "Professor" ? "Professor" : "Estudante"}
            </span>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex-1 w-full md:w-2/3 flex flex-col gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome de usuário
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#4b0082] focus:ring-2 
                focus:ring-[#4b0082] outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#4b0082] focus:ring-2 
                focus:ring-[#4b0082] outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL da foto
              </label>
              <input
                type="text"
                name="fotoUrl"
                value={formData.fotoUrl}
                onChange={handleInputChange}
                placeholder="URL da sua foto de perfil (opcional)"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#4b0082] focus:ring-2 
                focus:ring-[#4b0082] outline-none transition"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="bg-[#4b0082] hover:bg-[#3a006b] text-white font-semibold px-8 py-3 rounded-lg shadow
                transition disabled:opacity-60"
                disabled={!formData.username || !formData.email}
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Profile;
