import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // <--- Hämta useLocation
import "../styles/AuthPage.scss";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State: "login" eller "register"
  const [activeTab, setActiveTab] = useState("login");

  // Kolla URL:en när sidan laddas för att sätta rätt tab
  useEffect(() => {
    if (location.pathname === "/register") {
      setActiveTab("register");
    } else {
      setActiveTab("login");
    }
  }, [location.pathname]);

  // Funktion för att byta (uppdaterar URL utan att ladda om)
  const switchTab = (tab) => {
    setActiveTab(tab);
    navigate(`/${tab}`);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("token", "fake-token");
    localStorage.setItem("username", "FrontendKing");
    navigate("/profile");
  };

  const handleRegister = (e) => {
    e.preventDefault();
    alert("Konto skapat! (Mock)");
    switchTab("login"); // Byt till login efter registrering
  };

  return (
    <div className="auth">
      <div className="auth__wrapper single-card-mode">
        {" "}
        {/* Ny klass för styling */}
        {/* --- REGISTER CARD --- */}
        {activeTab === "register" && (
          <div className="auth-card auth-card--left fade-in">
            <h2 className="auth-card__title">Sign Up</h2>
            <form className="auth-form" onSubmit={handleRegister}>
              <div className="auth-input">
                <span className="auth-inputicon">
                  <FaUser />
                </span>
                <input type="text" placeholder="username" />
              </div>
              <div className="auth-input">
                <span className="auth-inputicon">
                  <FaEnvelope />
                </span>
                <input type="email" placeholder="email address" />
              </div>
              <div className="auth-input">
                <span className="auth-inputicon">
                  <FaLock />
                </span>
                <input type="password" placeholder="create password" />
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
                <span className="auth-inputicon">
                  <FaUser />
                </span>
                <input type="text" placeholder="username" />
              </div>
              <div className="auth-input">
                <span className="auth-inputicon">
                  <FaLock />
                </span>
                <input type="password" placeholder="password" />
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
