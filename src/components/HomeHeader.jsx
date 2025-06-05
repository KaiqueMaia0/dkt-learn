import { Link, useLocation, useNavigate } from "react-router-dom";
import dktlogo from "../assets/dktlogo.png"; 

function HomeHeader() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header
      className="w-full shadow-md py-4 px-6 flex items-center justify-between sticky top-0 z-50"
      style={{
        background: "linear-gradient(to left, #4b0082, #000000)",
      }}
    >
      <div className="flex items-center">
        <button onClick={handleLogoClick} className="focus:outline-none">
          <img
            src={dktlogo}
            alt="Logo"
            className="w-24 h-auto"
            style={{ background: "none" }}
          />
        </button>
      </div>
      <nav className="flex gap-6 items-center">
        <Link
          to="/about"
          className="text-white hover:text-purple-200 font-medium transition"
        >
          Sobre
        </Link>
        <a
          href="#recursos"
          className="text-white hover:text-purple-200 font-medium transition"
        >
          Recursos
        </a>
        <a
          href="#precos"
          className="text-white hover:text-purple-200 font-medium transition"
        >
          Preços
        </a>
        <a
          href="#contato"
          className="text-white hover:text-purple-200 font-medium transition"
        >
          Contato
        </a>
        <Link
          to="/login"
          className="ml-4 px-4 py-2 rounded bg-white text-[#4b0082] font-semibold hover:bg-purple-200 transition"
        >
          Entrar
        </Link>
      </nav>
    </header>
  );
}

export default HomeHeader;
