import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";
import { Login, Signup, ForgotPassword } from "./components/Auth";
import ResetPassword from "./components/ResetPassword";
import Inicial from "./components/Inicial";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import About from "./pages/About";

function App() {
  const location = useLocation();
  const noHeaderRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/about",
  ];

  const shouldShowHeader = !noHeaderRoutes.includes(location.pathname);

  useEffect(() => {
    let pageTitle = "DKT Learn";
    switch (location.pathname) {
      case "/home":
        pageTitle = "Dashboard | DKT Learn";
        break;
      case "/community":
        pageTitle = "Comunidade | DKT Learn";
        break;
      case "/profile":
        pageTitle = "Meu Perfil | DKT Learn";
        break;
      case "/materiais":
        pageTitle = "Materiais | DKT Learn";
        break;
      case "/dashboard":
        pageTitle = "Dashboard | DKT Learn";
        break;
      case "/notificacoes":
        pageTitle = "Notificações | DKT Learn";
        break;
      case "/meus-cursos":
        pageTitle = "Meus Cursos | DKT Learn";
        break;
      case "/favoritos":
        pageTitle = "Favoritos | DKT Learn";
        break;
      case "/suporte":
        pageTitle = "Suporte | DKT Learn";
        break;
      case "/configuracoes":
        pageTitle = "Configurações | DKT Learn";
        break;
      case "/about":
        pageTitle = "Sobre | DKT Learn";
        break;
      default:
        pageTitle = "DKT Learn";
        break;
    }
    document.title = pageTitle;
  }, [location.pathname]);

  return (
    <div
      className="app-container"
      style={{ paddingTop: shouldShowHeader ? "80px" : "0" }}
    >
      {shouldShowHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/home" element={<Inicial />} />
        <Route path="/about" element={<About />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/materiais" element={<div>Materiais Page</div>} />
        <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        <Route path="/notificacoes" element={<div>Notificações Page</div>} />
        <Route path="/meus-cursos" element={<div>Meus Cursos Page</div>} />
        <Route path="/favoritos" element={<div>Favoritos Page</div>} />
        <Route path="/suporte" element={<div>Suporte Page</div>} />
        <Route path="/configuracoes" element={<div>Configurações Page</div>} />
      </Routes>
    </div>
  );
}

export default App;
