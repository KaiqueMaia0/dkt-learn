import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";

function Inicial() {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4b0082]/10 to-[#8f5fd7]/10 flex">
      <aside className="w-64 bg-white border-r border-gray-100 py-10 px-6 flex flex-col shadow-sm min-h-screen">
        <nav className="flex flex-col gap-1">
          <Link
            to="/home"
            className="flex items-center gap-2 py-2 px-3 rounded-lg font-medium text-[#4b0082] hover:bg-[#f3e8ff] transition"
          >
            <span>🏠</span> Home
          </Link>
          <Link
            to="/cursos"
            className="flex items-center gap-2 py-2 px-3 rounded-lg font-medium text-[#4b0082] hover:bg-[#f3e8ff] transition"
          >
            <span>📚</span> Meus Cursos
          </Link>
          <Link
            to="/formacoes"
            className="flex items-center gap-2 py-2 px-3 rounded-lg font-medium text-[#4b0082] hover:bg-[#f3e8ff] transition"
          >
            <span>🎓</span> Formações e Planos
          </Link>
          <Link
            to="/descobrir"
            className="flex items-center gap-2 py-2 px-3 rounded-lg font-medium text-[#4b0082] hover:bg-[#f3e8ff] transition"
          >
            <span>✨</span> Descobrir
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-transparent flex flex-col py-12 px-6">
        <h1 className="text-3xl font-bold text-[#4b0082] mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card Meus Cursos */}
          <Link
            to="/cursos"
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-8 flex flex-col items-start border
             border-gray-100 group"
          >
            <span className="text-4xl mb-4 text-[#4b0082]">📚</span>
            <span className="font-bold text-lg text-[#4b0082] mb-1 group-hover:underline">
              Meus Cursos
            </span>
            <span className="text-sm text-gray-500">
              Veja seus cursos em andamento e continue aprendendo.
            </span>
          </Link>
          {/* Card Formações */}
          <Link
            to="/formacoes"
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-8 flex flex-col items-start border
             border-gray-100 group"
          >
            <span className="text-4xl mb-4 text-[#4b0082]">🎓</span>
            <span className="font-bold text-lg text-[#4b0082] mb-1 group-hover:underline">
              Formações e Planos
            </span>
            <span className="text-sm text-gray-500">
              Acompanhe seu progresso em trilhas e planos de estudo.
            </span>
          </Link>
          {/* Card Descobrir */}
          <Link
            to="/descobrir"
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-8 flex flex-col items-start border 
            border-gray-100 group"
          >
            <span className="text-4xl mb-4 text-[#4b0082]">✨</span>
            <span className="font-bold text-lg text-[#4b0082] mb-1 group-hover:underline">
              Descobrir
            </span>
            <span className="text-sm text-gray-500">
              Explore novos conteúdos, desafios e novidades.
            </span>
          </Link>
        </div>
        <div className="mt-12">
          <div className="bg-gradient-to-r from-[#4b0082] to-[#8f5fd7] rounded-xl shadow-xl p-8 
          flex flex-col md:flex-row items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Aproveite os novos desafios!
              </h2>
              <p className="text-white/90 text-base">
                Participe das atividades semanais e ganhe pontos para subir no
                ranking da comunidade.
              </p>
            </div>
            <Link
              to="/community"
              className="mt-4 md:mt-0 bg-white text-[#4b0082] font-bold px-6 py-3 rounded-lg shadow hover:bg-[#f3e8ff] transition"
            >
              Ir para Comunidade
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Inicial;
