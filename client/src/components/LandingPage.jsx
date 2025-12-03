// client/src/components/LandingPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // <--- 1. IMPORTERA
import "../styles/LandingPage.scss";

const LandingPage = () => {
  const navigate = useNavigate(); // <--- 2. AKTIVERA HOOKEN

  return (
    <div className="landing">
      <div className="landing__wrapper">
        {/* Vänster sida – text & knappar */}
        <div className="landing__hero">
          <span className="landing__badge">Meetup Planner</span>

          <h1 className="landing__title">
            Hitta, planera och gå på meetups – allt på ett ställe.
          </h1>

          <p className="landing__subtitle">
            Skapa ett konto, logga in och anmäl dig till meetups som klassen
            eller andra värdar ordnar. Håll koll på alla dina events på ett och
            samma ställe.
          </p>

          <p className="landing__actions-label">Vad vill du göra?</p>

          <div className="landing__actions">
            <button
              type="button"
              className="auth-btn auth-btn--primary landing__button-main"
              onClick={() => navigate("/register")} // <--- 3. NAVIGERA TILL REGISTERINGSIDAN
            >
              Skapa konto
            </button>

            <button
              type="button"
              className="landing__button-ghost landing__login-button"
              onClick={() => navigate("/login")} // <--- 3. NAVIGERA TILL LOGINSIDAN
            >
              Logga in
            </button>
          </div>

          <p className="landing__hint">
            Du behöver ett konto för att kunna anmäla dig till meetups. Skapa
            ett konto eller logga in för att komma igång.
          </p>
        </div>

        {/* Höger sida – liten “preview” av meetups */}
        <div className="landing__preview">
          <div className="landing-card">
            <p className="landing-card__label">Nästa meetup</p>
            <h2 className="landing-card__title">React &amp; CI/CD Workshop</h2>
            <p className="landing-card__meta">
              🕒 Ons 18:00 • 📍 Folkuniversitetet
            </p>
            <p className="landing-card__host">👤 Värd: Klassen</p>
            <p className="landing-card__desc">
              Vi går igenom hur frontend, backend, Docker och pipelines hänger
              ihop – med fokus på ert projekt.
            </p>
          </div>

          <div className="landing-card landing-card--ghost">
            <p className="landing-card__label">Kommande</p>
            <h3 className="landing-card__title-small">JavaScript-kväll</h3>
            <p className="landing-card__meta">🕒 Mån 17:30 • 💻 Online</p>
            <p className="landing-card__desc">
              Frågestund om JS, React och buggar i era projekt.
            </p>
          </div>

          <div className="landing-card landing-card--ghost">
            <p className="landing-card__label">Kommande</p>
            <h3 className="landing-card__title-small">DevOps intro</h3>
            <p className="landing-card__meta">🕒 Fre 16:00 • 🏫 Campus</p>
            <p className="landing-card__desc">
              En genomgång av CI/CD, GitHub Actions och deploy till molnet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
