import { Link } from "react-router-dom";
import homeimage from "../assets/home_photo.png"; 
import HomeHeader from "../components/HomeHeader";

function Home() {
  return (
    <div className="app min-h-screen flex flex-col">
      <HomeHeader />

      <main>
        <section className="hero flex flex-col md:flex-row py-16 px-5 gap-16 items-center justify-between">
            <div className="hero-content flex-1">
              <h1 className="text-4xl mb-6 leading-tight">
                Aprenda Cálculo e Física de forma interativa
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Plataforma personalizada para alunos e professores, desenvolvendo
                cálculos fundamentais até tópicos avançados.
              </p>
              <div className="hero-buttons flex gap-4">
                <Link
                  to="/signup"
                  className="primary-button bg-black text-white border-none rounded-md py-3 px-8 cursor-pointer font-medium
                  hover:bg-zinc-800 transition duration-300"
                >
                  Comece já Agora
                </Link>
                <button className="secondary-button bg-transparent text-gray-600 border border-black 
                rounded-md py-3 px-8 cursor-pointer font-medium hover:bg-gray-100 transition">
                  Ver Preços
                </button>
              </div>
            </div>
            <div className="main-content flex-1 flex justify-center items-center md:pt-0 pt-8">
              <div className="image w-full max-w-xl">
                <img
                  src={homeimage}
                  alt="Home"
                  className="w-full h-auto rounded-xl object-cover"
                  style={{ minHeight: "320px", maxHeight: "420px" }}
                />
              </div>
            </div>
        </section>

        <section className="features py-16 px-5 bg-gray-100 text-center">
          <h2 className="text-3xl mb-8 font-bold">Para Alunos e Professores</h2>
          <div className="features-grid grid gap-8 grid-cols-1 md:grid-cols-2">
            <div className="feature-column">
              <h3 className="text-xl mb-4 font-semibold">Para Alunos</h3>
              <ul className="list-none p-0">
                <li className="mb-4 text-lg cursor-pointer">
                  Trilha de aprendizado personalizada
                </li>
                <li className="mb-4 text-lg cursor-pointer">
                  Exercícios interativos com feedback instantâneo
                </li>
                <li className="mb-4 text-lg cursor-pointer">
                  Recursos multimídia adaptados ao seu ritmo
                </li>
                <li className="mb-4 text-lg cursor-pointer">
                  Comunidade para tirar dúvidas
                </li>
              </ul>
            </div>
            <div className="feature-column">
              <h3 className="text-xl mb-4 font-semibold">Para Professores</h3>
              <ul className="list-none p-0">
                <li className="mb-4 text-lg cursor-pointer">
                  Ferramentas para criar material didático
                </li>
                <li className="mb-4 text-lg cursor-pointer">
                  Sistema de avaliação contínua
                </li>
                <li className="mb-4 text-lg cursor-pointer">
                  Análise do progresso dos alunos
                </li>
                <li className="mb-4 text-lg cursor-pointer">
                  Compartilhamento de recursos
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="stats py-16 px-5 text-center flex justify-around flex-wrap">
          <div className="stat-item mb-8">
            <h3 className="text-4xl text-gray-600 mb-2">50k+</h3>
            <p className="text-lg text-gray-700">Alunos ativos</p>
          </div>
          <div className="stat-item mb-8">
            <h3 className="text-4xl text-gray-600 mb-2">500+</h3>
            <p className="text-lg text-gray-700">Exercícios</p>
          </div>
          <div className="stat-item mb-8">
            <h3 className="text-4xl text-gray-600 mb-2">1000+</h3>
            <p className="text-lg text-gray-700">Videoaulas</p>
          </div>
          <div className="stat-item mb-8">
            <h3 className="text-4xl text-gray-600 mb-2">100%</h3>
            <p className="text-lg text-gray-700">Satisfação</p>
          </div>
        </section>

        <section className="cta py-16 px-5 bg-[#4b0082] text-white text-center">
          <h2 className="text-3xl mb-4">Comece sua jornada hoje</h2>
          <p className="text-lg mb-8">
            Junte-se a milhares de alunos e professores transformando o ensino
            de Cálculo e Física
          </p>
          <Link
            to="/signup"
            className="primary-button bg-black text-white border-none rounded-md py-3 px-8 cursor-pointer font-medium 
            hover:bg-zinc-800"
          >
            Criar Conta Gratuita
          </Link>
        </section>
      </main>

      <footer className="bg-white py-12 px-5 text-gray-800">
        <div className="footer-content flex justify-center flex-wrap gap-16 mb-8">
          {/* Para Faculdades */}
          <div className="footer-section min-w-[220px]">
            <h4 className="text-lg mb-4 font-bold text-gray-600">Para Faculdades</h4>
            <a href="#" className="block text-gray-600 no-underline mb-2 hover:underline">Matérias</a>
            <a href="#" className="block text-gray-600 no-underline mb-2 hover:underline">Aulões</a>
            <a href="#" className="block text-gray-600 no-underline mb-2 hover:underline">Livros Resolvidos</a>
            <a href="#" className="block text-gray-600 no-underline mb-2 hover:underline">Resumões Grátis</a>
          </div>
          {/* Central de Ajuda */}
          <div className="footer-section min-w-[220px]">
            <h4 className="text-lg mb-4 font-bold text-gray-600">Central de Ajuda</h4>
            <a href="#" className="block text-gray-600 no-underline mb-2 hover:underline">Nossas Assinaturas</a>
            <a href="#" className="block text-gray-600 no-underline mb-2 hover:underline">Primeiros Passos</a>
            <a href="#" className="block text-gray-600 no-underline mb-2 hover:underline">Pagamentos</a>
            <a href="#" className="block text-gray-600 no-underline mb-2 hover:underline">Alterações na Conta</a>
            <a href="#" className="block text-gray-600 no-underline mb-2 hover:underline">Perguntas Frequentes</a>
          </div>
          {/* Institucional */}
          <div className="footer-section min-w-[220px]">
            <h4 className="text-lg mb-4 font-bold text-gray-600">Institucional</h4>
            <a href="/about" className="block text-gray-600 no-underline mb-2 hover:underline">Sobre o DKT-learn</a>
            <a href="#" className="block text-gray-600 no-underline mb-4 hover:underline">Trabalhe Conosco</a>
            <div className="social-links flex gap-4 mt-2">
              <a href="#" className="text-gray-600 text-2xl" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-600 text-2xl" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="text-gray-600 text-2xl" aria-label="Facebook">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-gray-600 text-2xl" aria-label="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom text-center pt-4 border-t border-gray-300 text-sm text-gray-600">
          <p>© 2025 DKT Learn - Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
