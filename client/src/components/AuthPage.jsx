import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/AuthPage.scss";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Hämta API URL (eller fallback till localhost)
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const activeTab = location.pathname === "/register" ? "register" : "login";

  const switchTab = (tab) => {
    navigate(`/${tab}`);
  };

  // --- REGISTRERA ---
  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    
    // Hämta värden från formuläret
    const username = form.username.value;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const res = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Konto skapat! Logga in nu.");
        switchTab("login");
      } else {
        alert("Fel: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Kunde inte nå servern.");
    }
  };

  // --- LOGGA IN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    
    // OBS: Backend kräver EMAIL och PASSWORD
    const email = form.email.value;
    const password = form.password.value;

    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        // Spara användaren i localStorage (Istället för token)
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("username", data.user.username);
        
        // Vi sätter en "fake-token" bara för att ProtectedRoute ska funka
        localStorage.setItem("token", "logged-in"); 
        
        navigate("/profile");
      } else {
        alert("Fel: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Kunde inte nå servern.");
    }
  };

  return (
    <div className="auth">
      <div className="auth__wrapper single-card-mode">
        
        {/* --- REGISTER CARD --- */}
        {activeTab === "register" && (
          <div className="auth-card auth-card--left fade-in">
            <h2 className="auth-card__title">Sign Up</h2>
            <form className="auth-form" onSubmit={handleRegister}>
              <div className="auth-input">
                <span className="auth-inputicon"><FaUser /></span>
                <input name="username" type="text" placeholder="Username" required />
              </div>
              <div className="auth-input">
                <span className="auth-inputicon"><FaEnvelope /></span>
                <input name="email" type="email" placeholder="Email address" required />
              </div>
              <div className="auth-input">
                <span className="auth-inputicon"><FaLock /></span>
                <input name="password" type="password" placeholder="Create password" required />
              </div>
              
              <button type="submit" className="auth-btn auth-btn--primary">
                Create Account
              </button>

              <p className="auth-card__footer">
                Already a member? 
                <button type="button" onClick={() => switchTab("login")}>
                  Log in
                </button>
              </p>
            </form>
          </div>
        )}

        {/* --- LOGIN CARD --- */}
        {activeTab === "login" && (
          <div className="auth-card auth-card--right fade-in">
            <h2 className="auth-card__title">Sign in</h2>
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="auth-input">
                <span className="auth-inputicon"><FaEnvelope /></span>
                <input name="email" type="email" placeholder="Email address" required />
              </div>
              <div className="auth-input">
                <span className="auth-inputicon"><FaLock /></span>
                <input name="password" type="password" placeholder="Password" required />
              </div>

              <button type="submit" className="auth-btn auth-btn--primary">
                Login
              </button>

              <p className="auth-card__footer">
                Not registered? 
                <button type="button" onClick={() => switchTab("register")}>
                  Create an account
                </button>
              </p>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default AuthPage;