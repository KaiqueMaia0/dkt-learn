import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import { Login, Signup } from "./components/Auth";
import Inicial from "./components/Inicial";

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Inicial />} />
      </Routes>
    </div>
  );
}

export default App;