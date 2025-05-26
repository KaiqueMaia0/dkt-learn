import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import homeimage from "../components/images/home_photo.png";
import dktlogo from "../components/images/dktlogo.png";

function Home() {
  return (
    <div className="app">
      <header className="header" paddingtop="64px">
        <div className="logo">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
            <img src={dktlogo} alt="Logo" style={{ width: '100px', height: 'auto', background: 'none' }} />
          </button>
        </div>
        <nav>
          <Link to="/about" className="about-button">Sobre</Link>
          <a href="#recursos">Recursos</a>
          <a href="#precos">Preços</a>
          <a href="#contato">Contato</a>
          <Link to="/login" className="login-button">Entrar</Link>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>Aprenda Cálculo e Física de forma interativa</h1>
            <p>
              Plataforma personalizada para alunos e professores, desenvolvendo
              cálculos fundamentais até tópicos avançados.
            </p>
            <div className="hero-buttons">
              <Link to="/signup" className="primary-button">Comece já Agora</Link>
              <button className="secondary-button">Ver Preços</button>
            </div>
          </div>
          <div className="main-content" style={{ paddingTop: '100px' }}>
            <div className="image">
              <img src={homeimage} alt="Home" style={{ width: '550px', height: 'auto', borderRadius: '12px'}} />
            </div>
          </div>
        </section>

        <section className="features">
          <h2>Para Alunos e Professores</h2>
          <div className="features-grid">
            <div className="feature-column">
              <h3>Para Alunos</h3>
              <ul>
                <li>Trilha de aprendizado personalizada</li>
                <li>Exercícios interativos com feedback instantâneo</li>
                <li>Recursos multimídia adaptados ao seu ritmo</li>
                <li>Comunidade para tirar dúvidas</li>
              </ul>
            </div>
            <div className="feature-column">
              <h3>Para Professores</h3>
              <ul>
                <li>Ferramentas para criar material didático</li>
                <li>Sistema de avaliação contínua</li>
                <li>Análise do progresso dos alunos</li>
                <li>Compartilhamento de recursos</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="stats">
          <div className="stat-item">
            <h3>10k+</h3>
            <p>Alunos ativos</p>
          </div>
          <div className="stat-item">
            <h3>500+</h3>
            <p>Exercícios</p>
          </div>
          <div className="stat-item">
            <h3>1000+</h3>
            <p>Videoaulas</p>
          </div>
          <div className="stat-item">
            <h3>95%</h3>
            <p>Satisfação</p>
          </div>
        </section>

        <section className="cta">
          <h2>Comece sua jornada hoje</h2>
          <p>
            Junte-se a milhares de alunos e professores transformando o ensino
            de Cálculo e Física
          </p>
          <Link to="/signup" className="primary-button">Criar Conta Gratuita</Link>
        </section>
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-section">
            <h4>Produto</h4>
            <a href="#sobre">Sobre</a>
            <a href="#precos">Preços</a>
            <a href="#demo">Demo</a>
          </div>
          <div className="footer-section">
            <h4>Empresa</h4>
            <a href="#sobre">Sobre</a>
            <a href="#blog">Blog</a>
            <a href="#carreiras">Carreiras</a>
          </div>
          <div className="footer-section">
            <h4>Suporte</h4>
            <a href="#ajuda">Ajuda</a>
            <a href="#contato">Contato</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="footer-section">
            <h4>Siga-nos</h4>
            <div className="social-links">
              <a href="#twitter">Twitter</a>
              <a href="#linkedin">LinkedIn</a>
              <a href="#instagram">Instagram</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 DKT Learn - Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;