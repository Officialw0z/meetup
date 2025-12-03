// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./components/AuthPage.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Startsidan är inloggning */}
        <Route path="/" element={<AuthPage />} />
        
        {/* Profilsidan */}
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;