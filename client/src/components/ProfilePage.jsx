import React, { useState, useEffect } from "react";
import "../styles/ProfilePage.scss"; // Se till att denna importerar samma stilar/variabler eller kopiera från MeetupsPage.scss
import {
  FaCalendarAlt,
  FaClock,
  FaHistory,
  FaSignOutAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Hjälpfunktion för datum (Samma som i MeetupsPage)
function formatDate(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleString("sv-SE", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [loading, setLoading] = useState(true);
  const [upcomingMeetups, setUpcomingMeetups] = useState([]);
  const [pastMeetups, setPastMeetups] = useState([]);
  
  // NYTT: För att visa detaljer till höger
  const [selectedId, setSelectedId] = useState(null);

  // Hämta info från localStorage
  const username = localStorage.getItem("username") || "Användare";
  const email = localStorage.getItem("email");

  useEffect(() => {
    if (!email) {
      navigate("/");
      return;
    }

    const fetchMyMeetups = async () => {
      try {
        const res = await fetch(`${API_URL}/api/users/${email}/meetups`);

        if (res.ok) {
          const data = await res.json();

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

  // Hitta det valda eventet (kan ligga i upcoming eller past)
  const selected = 
    upcomingMeetups.find(m => m.id === selectedId) || 
    pastMeetups.find(m => m.id === selectedId);

  if (loading) {
    return (
      <div className="profile">
        <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
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
              <p>Här är dina bokade events</p>
            </div>
          </div>
          <button onClick={handleLogout} className="profile__logout-btn">
            <FaSignOutAlt /> Logga ut
          </button>
        </header>

        {/* HÄR ÄR DEN NYA LAYOUTEN (Lik MeetupsPage) */}
        <div className="profile-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
          
          {/* VÄNSTER SPALT: Listan */}
          <div className="profile-list-column">
            
            {/* Kommande */}
            <section className="profile__section">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', marginBottom: '1rem', color: '#14f4ff' }}>
                <FaCalendarAlt /> Kommande
              </h2>
              
              <div className="meetup-list">
                {upcomingMeetups.length === 0 && (
                  <div style={{ textAlign: "center", padding: "2rem", color: "#9ca3af", background: '#1f2937', borderRadius: '1rem' }}>
                    <p>Inga bokningar.</p>
                    <button
                      onClick={() => navigate("/meetups")}
                      style={{ marginTop: "1rem", padding: "0.6rem 1rem", borderRadius: "8px", background: "#14f4ff", border: "none", cursor: "pointer", fontWeight: "bold" }}
                    >
                      Hitta events
                    </button>
                  </div>
                )}

                {upcomingMeetups.map((meetup) => (
                  <button
                    key={meetup.id}
                    className={`meetup-card ${selectedId === meetup.id ? "meetup-card--active" : ""}`}
                    onClick={() => setSelectedId(meetup.id === selectedId ? null : meetup.id)}
                    style={{ 
                        width: '100%', 
                        textAlign: 'left', 
                        background: selectedId === meetup.id ? 'rgba(20, 244, 255, 0.05)' : '#1f2937',
                        border: selectedId === meetup.id ? '1px solid #14f4ff' : '1px solid transparent',
                        padding: '1.2rem',
                        borderRadius: '1rem',
                        marginBottom: '1rem',
                        cursor: 'pointer',
                        transition: '0.2s',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                  >
                    <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#e5e7eb' }}>{meetup.title}</h3>
                        <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FaClock /> {formatDate(meetup.date)}
                        </p>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#14f4ff', background: 'rgba(20, 244, 255, 0.1)', padding: '0.3rem 0.6rem', borderRadius: '4px' }}>
                        Anmäld
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Historik (Om det finns) */}
            {pastMeetups.length > 0 && (
                <section className="profile__section" style={{ marginTop: '2rem', opacity: 0.7 }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', marginBottom: '1rem', color: '#9ca3af' }}>
                    <FaHistory /> Historik
                </h2>
                <div className="meetup-list">
                    {pastMeetups.map((meetup) => (
                    <button
                        key={meetup.id}
                        onClick={() => setSelectedId(meetup.id === selectedId ? null : meetup.id)}
                        style={{ 
                            width: '100%', textAlign: 'left', background: '#1f2937', padding: '1rem', borderRadius: '1rem', marginBottom: '1rem', border: '1px solid transparent', cursor: 'pointer' 
                        }}
                    >
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#9ca3af' }}>{meetup.title}</h3>
                        <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>{meetup.date.split('T')[0]}</p>
                    </button>
                    ))}
                </div>
                </section>
            )}
          </div>

          {/* HÖGER SPALT: Detaljer */}
          <div className="profile-details-column">
            <div style={{ background: '#1f2937', padding: '2rem', borderRadius: '1.5rem', position: 'sticky', top: '2rem', minHeight: '300px' }}>
                {selected ? (
                    <>
                        <h2 style={{ marginTop: 0, fontSize: '1.8rem', color: '#fff' }}>{selected.title}</h2>
                        
                        <div style={{ display: 'grid', gap: '0.8rem', margin: '1.5rem 0', color: '#d1d5db' }}>
                            <p><strong>Datum:</strong> {formatDate(selected.date)}</p>
                            <p><strong>Plats:</strong> {selected.location}</p>
                            <p><strong>Värd:</strong> {selected.host || "TBA"}</p>
                        </div>

                        <p style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: 'bold', letterSpacing: '1px' }}>Beskrivning</p>
                        <p style={{ lineHeight: '1.6', color: '#9ca3af' }}>{selected.description}</p>

                    </>
                ) : (
                    <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#6b7280', textAlign: 'center' }}>
                        <p>Klicka på ett event till vänster<br/>för att se detaljer.</p>
                    </div>
                )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;