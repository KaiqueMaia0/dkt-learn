import React from "react";
import { Link } from "react-router-dom";
import "./Inicial.css";
import dktlogo from "../components/images/dktlogo.png";
import perfil from "../components/images/perfil.png";

function Inicial() {
  return(
    <div className="app">
      <header className="header" padding-top="64px">
        <div className="logo">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
            <img src={dktlogo} alt="Logo" style={{ width: '100px', height: 'auto', background: 'none' }} />
          </button>
        </div>
        <nav>
          <a href="#sobre">Sobre</a>
          <a href="#materiais">Materiais</a>
          <a href="#comunidade">Comunidade</a>
          <a href="#perfil">
            <img src="" alt="perfil" />  
          </a>
        </nav>  
      </header>
    </div>
  );
}

export default Inicial;