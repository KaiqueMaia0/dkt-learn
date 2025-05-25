import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Inicial.css";
import sino from "./images/sino.png";
import dktlogo from "./images/dktlogo.png";
import perfil from "./images/perfil.png";
import AuthService from "../services/AuthService";
import { Avatar } from "@mui/material";

function Header() {
  const [showDropdown, setShowDropdown] = React.useState(false);
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

  return (
    <header className="header" padding-top="64px">
      <div className="logo">
        <Link to="/home">
          <img
            src={dktlogo}
            alt="Logo"
            style={{ width: "100px", height: "auto", background: "none" }}
          />
        </Link>
      </div>
      <nav>
        <Link to="/materiais">Materiais</Link>
        <Link to="/community">Comunidade</Link>
        <Link to="/home">Dashboard</Link>
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
          className="perfil-dropdown"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
          style={{ display: "inline-block", position: "relative" }}
        >
          <button
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            <Link to="/profile">
              <Avatar
                src={profileImageUrl}
                alt="perfil"
                sx={{ width: 45, height: 45, background: "none" }}
              >
                {currentUser?.username?.[0]?.toUpperCase() || "U"}
              </Avatar>
            </Link>
          </button>
          {showDropdown && (
            <div className="dropdown-menu">
              <Link to="/profile">Meu Perfil</Link>
              <Link to="/meus-cursos">Meus Cursos</Link>
              <Link to="/favoritos">Favoritos</Link>
              <Link to="/suporte">Suporte</Link>
              <Link to="/configuracoes">Configurações</Link>
              <button onClick={handleLogout} className="logout-button">
                Sair
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
