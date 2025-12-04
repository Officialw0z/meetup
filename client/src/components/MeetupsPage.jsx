import { useState, useEffect } from "react";
import { FaSearch, FaCheckCircle, FaExclamationCircle, FaTimesCircle } from "react-icons/fa";
import "../styles/MeetupsPage.scss";

// MOCK DATA
const MOCK_MEETUPS = [
  {
    id: 1,
    title: "React Meetup",
    time: "2025-12-10T18:00:00",
    location: "Stockholm, Folkuniversitetet",
    host: "Magdalena",
    description: "Vi går igenom grunderna i React, komponenter och hur vi byggt den här appen.",
    capacity: 20,
    attending: 15,
  },
  {
    id: 2,
    title: "JavaScript-kväll",
    time: "2025-12-15T17:30:00",
    location: "Online (Zoom)",
    host: "Klassgruppen",
    description: "Frågestund om JavaScript, CI/CD, Git flow och grupparbetet.",
    capacity: 10,
    attending: 10, // Fullbokad
  },
  {
    id: 3,
    title: "CI/CD & DevOps intro",
    time: "2026-01-05T17:00:00",
    location: "Campus / Hybrid",
    host: "Läraren",
    description: "Vi tittar på pipelines, GitHub Actions och hur deployen till AWS & Render fungerar.",
    capacity: 50,
    attending: 2,
  },
];

function formatDate(dateString) {
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

export default function MeetupsPage() {
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [meetups, setMeetups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // --- NYTT: Håller koll på vilka meetups JAG är anmäld till ---
  const [mySignups, setMySignups] = useState([]);

  useEffect(() => {
    const fakeFetch = () => {
      setTimeout(() => {
        setMeetups(MOCK_MEETUPS);
        setLoading(false);
      }, 1000);
    };
    fakeFetch();
  }, []);

  const filteredMeetups = meetups.filter((meetup) => {
    const text = searchTerm.toLowerCase();
    return (
      meetup.title.toLowerCase().includes(text) ||
      meetup.description.toLowerCase().includes(text) ||
      meetup.location.toLowerCase().includes(text) ||
      meetup.host.toLowerCase().includes(text)
    );
  });

  const selected = meetups.find((m) => m.id === selectedId);
  
  // --- NYTT: Kolla om jag redan är anmäld till den valda ---
  const isRegistered = selected ? mySignups.includes(selected.id) : false;

  // --- ANMÄL DIG ---
  const handleSignup = (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Du måste vara inloggad för att anmäla dig!");
      return;
    }

    // 1. Öka antal attending
    setMeetups((prev) => 
      prev.map((m) => m.id === id ? { ...m, attending: m.attending + 1 } : m)
    );

    // 2. Lägg till i "mina anmälningar"
    setMySignups((prev) => [...prev, id]);

    alert("Du är nu anmäld! (Mock)");
  };

  // --- AVREGISTRERA DIG (NY FUNKTION) ---
  const handleUnregister = (id) => {
    // 1. Minska antal attending
    setMeetups((prev) => 
      prev.map((m) => m.id === id ? { ...m, attending: m.attending - 1 } : m)
    );

    // 2. Ta bort från "mina anmälningar"
    setMySignups((prev) => prev.filter((signupId) => signupId !== id));

    alert("Du har avregistrerat dig.");
  };

  if (loading) {
    return (
      <div className="meetups-wrapper">
        <div style={{ display: 'flex', height: '80vh', alignItems: 'center', justifyContent: 'center' }}>
           <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="meetups-wrapper">
      <div className="meetups-card">
        <h1 className="meetups-card__title">Kommande meetups</h1>
        
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Sök efter ämne eller plats..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="meetups-layout">
          <div className="meetups-list">
            {filteredMeetups.length === 0 && (
              <p style={{ padding: "1rem", color: "#9ca3af" }}>Inga meetups hittades.</p>
            )}

            {filteredMeetups.map((meetup) => {
              const amISignedUp = mySignups.includes(meetup.id); // Kolla om jag är anmäld
              
              return (
                <button
                  key={meetup.id}
                  className={`meetups-list__item ${
                    selectedId === meetup.id ? "meetups-list__item--active" : ""
                  }`}
                  onClick={() =>
                    setSelectedId((prev) => (prev === meetup.id ? null : meetup.id))
                  }
                >
                  <div className="meetups-list__header">
                    <h2>{meetup.title}</h2>
                    <span className="meetups-list__time">
                      {formatDate(meetup.time)}
                    </span>
                  </div>
                  <p className="meetups-list__line">📍 {meetup.location}</p>
                  
                  <div className="status-container">
                    {/* Visa om jag är anmäld redan i listan */}
                    {amISignedUp && (
                       <span className="status-badge status-badge--registered">
                         <FaCheckCircle /> Anmäld
                       </span>
                    )}

                    {/* Visa om det är fullt */}
                    {!amISignedUp && meetup.attending >= meetup.capacity && (
                        <span className="status-badge status-badge--full">Fullbokad</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="meetup-details">
            {selected ? (
              <>
                <h2>{selected.title}</h2>
                <div className="meetup-meta-grid">
                  <p><strong>Tid:</strong> {formatDate(selected.time)}</p>
                  <p><strong>Plats:</strong> {selected.location}</p>
                  <p><strong>Värd:</strong> {selected.host}</p>
                  <p>
                    <strong>Platser:</strong> {selected.attending} / {selected.capacity}
                  </p>
                </div>

                <p className="meetup-details__description-label">
                  <strong>Beskrivning</strong>
                </p>
                <p className="meetup-details__description">
                  {selected.description}
                </p>

                <div className="meetup-actions">
                  
                  {/* LOGIK FÖR KNAPPARNA */}
                  
                  {isRegistered ? (
                    // 1. Om jag är anmäld -> Visa avregistrera
                    <div className="registered-actions">
                      <p className="success-msg"><FaCheckCircle /> Du är anmäld till detta event.</p>
                      <button 
                        className="action-btn action-btn--danger"
                        onClick={() => handleUnregister(selected.id)}
                      >
                        <FaTimesCircle style={{marginRight: '8px'}}/> Avregistrera mig
                      </button>
                    </div>

                  ) : selected.attending >= selected.capacity ? (
                    // 2. Om det är fullt -> Visa varning
                    <div className="full-warning">
                      <FaExclamationCircle />
                      <span>Tyvärr, denna meetup är fullbokad.</span>
                    </div>

                  ) : (
                    // 3. Annars -> Visa anmäl-knapp
                    <button 
                      className="action-btn"
                      onClick={() => handleSignup(selected.id)}
                    >
                      Anmäl dig nu
                    </button>
                  )}

                </div>
              </>
            ) : (
              <p className="meetup-details__placeholder">
                Välj en meetup i listan för att se detaljer och anmäla dig.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}