import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import sino from "../assets/sino.png";
import dktlogo from "../assets/dktlogo.png";
import perfil from "../assets/perfil.png";
import AuthService from "../services/AuthService";
import {
  FaUser,
  FaEdit,
  FaGift,
  FaFileInvoice,
  FaSignOutAlt,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";

function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  const profileImageUrl = currentUser?.fotoUrl || perfil;

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  return (
    <header
      className="header fixed top-0 left-0 w-full z-50 flex justify-between items-center py-6 px-5 text-white"
      style={{
        background: "linear-gradient(to left, #4b0082, #000000)",
      }}
    >
      <Link to="/home">
        <img
          src={dktlogo}
          alt="Logo"
          style={{ width: "100px", height: "auto", background: "none" }}
        />
      </Link>
      <div className="flex-1 flex justify-center">
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center bg-white/90 rounded-lg px-2 py-1 shadow focus-within:ring-2 
          focus-within:ring-[#4b0082]"
          style={{ minWidth: 320, maxWidth: 420 }}
        >
          <input
            type="text"
            className="bg-transparent outline-none px-3 py-2 text-[#4b0082] flex-1 placeholder-[#4b0082]/60"
            placeholder="O que você quer aprender?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 rounded bg-[#4b0082] text-white font-semibold hover:bg-[#3a006b] transition"
          >
            Pesquisar
          </button>
        </form>
      </div>
      <nav className="flex gap-8 items-center">
        <Link to="/community" className="no-underline text-white">
          Comunidade
        </Link>
        <Link to="/home" className="no-underline text-white">
          Dashboard
        </Link>
        <button
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          <Link to="/notificacoes">
            <img
              src={sino}
              alt="notificações"
              style={{ width: "30px", height: "auto", background: "none" }}
            />
          </Link>
        </button>
        <div
          className="perfil-dropdown relative"
          onClick={() => setShowDropdown((v) => !v)}
          style={{ display: "inline-block" }}
        >
          <button
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <img
              src={profileImageUrl}
              alt="perfil"
              className="w-12 h-12 rounded-full object-cover border-2 border-[#4b0082] bg-white"
            />
            <span className="font-semibold text-white hidden md:inline">
              {currentUser?.username}
            </span>
            <span className="ml-1">
              {showDropdown ? (
                <FaChevronUp className="text-[#bdb4e6]" />
              ) : (
                <FaChevronDown className="text-[#bdb4e6]" />
              )}
            </span>
          </button>
          {showDropdown && (
            <div className="dropdown-menu absolute top-[60px] right-0 bg-[#4b0082] border border-[#ffffff] 
            rounded-xl shadow-xl min-w-[320px] z-10 flex flex-col p-6">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={profileImageUrl}
                  alt="perfil"
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#4b0082] bg-white"
                />
                <div>
                  <div className="font-bold text-lg text-white">
                    {currentUser?.username}
                  </div>
                  <div className="text-xs text-[#bdb4e6]">
                    {currentUser?.email}
                  </div>
                </div>
              </div>
              <Link
                to="/profile"
                className="flex items-center gap-4 py-3 px-2 rounded-lg hover:bg-[#2d2153] transition"
              >
                <FaUser className="text-[#bdb4e6] text-xl" />
                <div>
                  <div className="font-semibold text-white">
                    Perfil & Certificados
                  </div>
                  <div className="text-xs text-[#bdb4e6]">
                    Gerencie seu perfil e acompanhe sua evolução
                  </div>
                </div>
              </Link>
              <Link
                to="/configuracoes"
                className="flex items-center gap-4 py-3 px-2 rounded-lg hover:bg-[#2d2153] transition"
              >
                <FaEdit className="text-[#bdb4e6] text-xl" />
                <div>
                  <div className="font-semibold text-white">Configurações</div>
                  <div className="text-xs text-[#bdb4e6]">
                    Preferências da conta
                  </div>
                </div>
              </Link>
              <Link
                to="/matricula"
                className="flex items-center gap-4 py-3 px-2 rounded-lg hover:bg-[#2d2153] transition"
              >
                <FaFileInvoice className="text-[#bdb4e6] text-xl" />
                <div>
                  <div className="font-semibold text-white">
                    Minha Matrícula
                  </div>
                  <div className="text-xs text-[#bdb4e6]">
                    Nota fiscal e detalhes do seu plano
                  </div>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 py-3 px-2 rounded-lg hover:bg-[#2d2153] transition mt-2"
              >
                <FaSignOutAlt className="text-[#bdb4e6] text-xl" />
                <div className="font-semibold text-white">Sair</div>
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
