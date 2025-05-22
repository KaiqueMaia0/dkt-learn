import React from "react";
import { Link } from "react-router-dom";
import "./Inicial.css";
import dktlogo from "../components/images/dktlogo.png";
import perfil from "../components/images/perfil.png";
import sino from "../components/images/sino.png";

function Inicial() {
  const [showDropdown, setShowDropdown] = React.useState(false);

  return(
    <div className="app">
      <header className="header" padding-top="64px">
        <div className="logo">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
            <img src={dktlogo} alt="Logo" style={{ width: '100px', height: 'auto', background: 'none' }} />
          </button>
        </div>
        <nav>
          <a href="#materiais">Materiais</a>
          <a href="#comunidade">Comunidade</a>
          <a href="#dashboard">Dashboard</a>
          <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
            <a href="#notificacoes">
              <img src={sino} alt="notificações" style={{ width: '30px', height: 'auto', background: 'none' }}/>  
            </a>
          </button>
          <div className="perfil-dropdown"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
            style={{ display: 'inline-block', position: 'relative' }}>
            <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              <a href="#perfil">
                <img src={perfil} alt="perfil" style={{ width: '45px', height: 'auto', background: 'none' }}/>  
              </a>
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/perfil">Meu Perfil</Link>
                <Link to="/meus-cursos">Meus Cursos</Link>
                <Link to="/favoritos">Favoritos</Link>
                <Link to="/suporte">Suporte</Link>
                <Link to="/configuracoes">Configurações</Link>
                <Link to="/sair">Sair</Link>
              </div>
            )}
          </div>  
        </nav>  
      </header>
      <main>
        <section className="hero">
          <div classname="informaçoes" style={{paddingTop: '100px'}}>
            <h1 style={{width: '550px', height: 'auto', borderRadius: '12px'}}>Bem vindo à DKT Learn!</h1>
            <p>Uma plataforma para aprender Calculo e Física de um jeito totalmente diferente!</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Inicial;