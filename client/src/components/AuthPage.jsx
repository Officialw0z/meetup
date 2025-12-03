
import React from "react";
import { useNavigate } from "react-router-dom"; // <--- NY 1: Importerar routing
import "../styles/AuthPage.scss";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";

const AuthPage = () => {
  const navigate = useNavigate(); // <--- NY 2: Startar hooken

  // <--- NY 3: Funktionen som körs när man klickar Login
  const handleLogin = (e) => {
    e.preventDefault(); // Stoppar sidan från att ladda om
  /*   console.log("Loggar in och navigerar till profil..."); */
  localStorage.setItem("token", "12345-fake-token"); // Tas bort när backend fungerar
    localStorage.setItem("username", "FrontendKing"); // Tas bort när backend fungerar
    
    navigate("/profile");
    navigate("/profile"); // Skickar användaren till profilsidan
  };

  return (
    <div className="auth">
      <div className="authwrapper">
        
        {/* SIGN UP (Vänstra kortet) */}
        {/* Notera: Jag har inte lagt logik här än, så denna gör inget just nu */}
        <div className="auth-card auth-card--left">
          <h2 className="auth-card__title">Sign Up</h2>

          <form className="auth-form">
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

            <div className="auth-input">
              <span className="auth-inputicon">
                <FaLock />
              </span>
              <input type="password" placeholder="confirm password" />
            </div>

            <button type="submit" className="auth-btn auth-btn--primary">
              Create Account
            </button>

            <p className="auth-card__footer">
              Already a member? <button type="button">Log in</button>
            </p>
          </form>
        </div>

        {/* SIGN IN (Högra kortet) */}
        <div className="auth-card auth-card--right">
          <h2 className="auth-card__title">Sign in</h2>

          {/* <--- NY 4: Här kopplar vi funktionen till formuläret */}
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
              Not registered? <button type="button">Create an account</button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;