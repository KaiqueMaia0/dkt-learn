import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // Importa o CSS da Home
import dktlogo from "./images/dktlogo.png"; // Certifique-se que o caminho para a imagem está correto

function HomeHeader() {
  return (
    <header className="header" paddingtop="64px">
      <div className="logo">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          <img
            src={dktlogo}
            alt="Logo"
            style={{ width: "100px", height: "auto", background: "none" }}
          />
        </button>
      </div>
      <nav>
        <Link to="/about" className="about-button">
          Sobre
        </Link>
        <a href="#recursos">Recursos</a>
        <a href="#precos">Preços</a>
        <a href="#contato">Contato</a>
        <Link to="/login" className="login-button">
          Entrar
        </Link>
      </nav>
    </header>
  );
}

export default HomeHeader;
