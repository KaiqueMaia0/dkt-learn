import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Inicial.css";
import AuthService from "../services/AuthService";

function Inicial() 
{
  const [showDropdown, setShowDropdown] = React.useState(false);
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="app">
      <main>
        <section className="hero">
          <div className="informacoes" style={{ paddingTop: "100px" }}>
            <h1
              style={{ width: "550px", height: "auto", borderRadius: "12px" }}
            >
              Bem vindo à DKT Learn, {currentUser?.username || "Usuário"}!
            </h1>
            <p>
              Uma plataforma para aprender Calculo e Física de um jeito
              totalmente diferente!
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Inicial;
