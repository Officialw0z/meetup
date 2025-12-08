import React, { useState, useEffect } from "react";
import "../styles/ProfilePage.scss";
import {
  FaCalendarAlt,
  FaClock,
  FaHistory,
  FaSignOutAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [loading, setLoading] = useState(true);
  const [upcomingMeetups, setUpcomingMeetups] = useState([]);
  const [pastMeetups, setPastMeetups] = useState([]);

  // Hämta info från localStorage
  const username = localStorage.getItem("username") || "Användare";
  const email = localStorage.getItem("email");

  useEffect(() => {
    if (!email) {
      navigate("/"); // Ingen email? Kasta ut användaren.
      return;
    }

    const fetchMyMeetups = async () => {
      try {
        // Hämta användarens meetups via email
        const res = await fetch(`${API_URL}/api/users/${email}/meetups`);

        if (res.ok) {
          const data = await res.json();

          // Sortera data i Kommande och Historik
          const now = new Date();
          const upcoming = data.filter((m) => new Date(m.date) >= now);
          const history = data.filter((m) => new Date(m.date) < now);

          setUpcomingMeetups(upcoming);
          setPastMeetups(history);
        }
      } catch (error) {
        console.error("Kunde inte hämta data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyMeetups();
  }, [navigate, email, API_URL]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="profile">
        <div
          style={{
            display: "flex",
            height: "100vh",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile">
      <div className="profile__wrapper">
        <header className="profile__header">
          <div className="profile__user-info">
            <div className="profile__avatar">
              {username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1>Hej, {username}!</h1>
              <p>Meetup Medlem</p>
            </div>
          </div>
          <button onClick={handleLogout} className="profile__logout-btn">
            <FaSignOutAlt /> Logga ut
          </button>
        </header>

        {/* Kommande Meetups */}
        <section className="profile__section">
          <h2>
            <FaCalendarAlt /> Kommande Meetups
          </h2>
          <div className="meetup-list">
            {upcomingMeetups.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "#9ca3af",
                }}
              >
                <p>Du har inga inbokade events än.</p>
                <button
                  onClick={() => navigate("/meetups")}
                  style={{
                    marginTop: "1rem",
                    padding: "0.8rem",
                    borderRadius: "8px",
                    background: "#14f4ff",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Hitta events
                </button>
              </div>
            ) : (
              upcomingMeetups.map((meetup) => (
                <div
                  key={meetup.id}
                  className="meetup-card meetup-card--upcoming"
                >
                  <div className="meetup-card__info">
                    <h3>{meetup.title}</h3>
                    <p>
                      <FaClock /> {meetup.date.split("T")[0]} •{" "}
                      <FaMapMarkerAlt /> {meetup.location}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Historik */}
        <section className="profile__section">
          <h2>
            <FaHistory /> Tidigare Meetups
          </h2>
          <div className="meetup-list">
            {pastMeetups.map((meetup) => (
              <div key={meetup.id} className="meetup-card meetup-card--past">
                <div className="meetup-card__info">
                  <h3>{meetup.title}</h3>
                  <p>{meetup.date.split("T")[0]}</p>
                </div>
                <span className="meetup-status">Genomförd</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
