import { useState, useEffect } from "react";
import {
  FaSearch,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
} from "react-icons/fa";
import "../styles/MeetupsPage.scss";

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

export default function MeetupsPage() {
  // --- STATES ---
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [meetups, setMeetups] = useState([]);
  const [mySignups, setMySignups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // --- CONFIG ---
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const userEmail = localStorage.getItem("email");
  const userName = localStorage.getItem("username");

  // --- HÄMTA DATA VID START ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Hämta alla meetups från backend
        const meetupsRes = await fetch(`${API_URL}/api/meetups`);
        const meetupsData = await meetupsRes.json();

        if (Array.isArray(meetupsData)) {
          setMeetups(meetupsData);
        } else {
          console.error("Fick ingen lista från backend:", meetupsData);
          setMeetups([]); // Sätt tom lista så sidan inte kraschar
        }

        // 2. Om inloggad: Hämta mina anmälningar
        if (userEmail) {
          const myRes = await fetch(
            `${API_URL}/api/users/${userEmail}/meetups`
          );
          if (myRes.ok) {
            const myData = await myRes.json();
            // Samma säkerhetskoll här
            if (Array.isArray(myData)) {
              const myIds = myData.map((m) => m.id);
              setMySignups(myIds);
            }
          }
        }
      } catch (err) {
        console.error("Kunde inte hämta data:", err);
        setMeetups([]); // Vid nätverksfel, visa tom lista istället för krasch
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL, userEmail]);

  // --- SÖKFUNKTION ---
  const filteredMeetups = meetups.filter((meetup) => {
    const text = searchTerm.toLowerCase();
    return (
      meetup.title?.toLowerCase().includes(text) ||
      (meetup.description && meetup.description.toLowerCase().includes(text)) ||
      meetup.location?.toLowerCase().includes(text) ||
      (meetup.host && meetup.host.toLowerCase().includes(text))
    );
  });

  const selected = meetups.find((m) => m.id === selectedId);
  const isRegistered = selected ? mySignups.includes(selected.id) : false;

  // Safe check för capacity
  const isFull =
    selected && selected.capacity && selected.attending >= selected.capacity;

  // --- ANMÄLAN (POST) ---
  const handleSignup = async (id) => {
    if (!userEmail) {
      alert("Du måste logga in först!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/meetups/${id}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName, email: userEmail }),
      });

      if (res.ok) {
        alert("Du är nu anmäld!");
        setMySignups((prev) => [...prev, id]);

        // Uppdatera siffran live i listan
        setMeetups((prev) =>
          prev.map((m) =>
            m.id === id
              ? { ...m, attending: (parseInt(m.attending) || 0) + 1 }
              : m
          )
        );
      } else {
        const data = await res.json();
        alert("Fel: " + (data.error || "Något gick fel"));
      }
    } catch (err) {
      console.error(err);
      alert("Kunde inte nå servern.");
    }
  };

  // --- AVREGISTRERING (DELETE) ---
  const handleUnregister = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/meetups/${id}/signup`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });

      if (res.ok) {
        alert("Du har avregistrerats.");
        setMySignups((prev) => prev.filter((sid) => sid !== id));

        // Uppdatera siffran live i listan
        setMeetups((prev) =>
          prev.map((m) =>
            m.id === id
              ? {
                  ...m,
                  attending: Math.max(0, (parseInt(m.attending) || 0) - 1),
                }
              : m
          )
        );
      } else {
        const data = await res.json();
        alert("Fel: " + (data.error || "Kunde inte avregistrera"));
      }
    } catch (err) {
      console.error(err);
      alert("Kunde inte avregistrera.");
    }
  };

  // --- RENDERING ---
  if (loading) {
    return (
      <div className="meetups-wrapper">
        <div
          style={{
            display: "flex",
            height: "80vh",
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
    <div className="meetups-wrapper">
      <div className="meetups-card">
        <h1 className="meetups-card__title">Kommande meetups</h1>

        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Sök efter ämne, plats eller värd..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="meetups-layout">
          {/* Lista */}
          <div className="meetups-list">
            {filteredMeetups.length === 0 && (
              <p style={{ padding: "1rem", color: "#9ca3af" }}>
                Inga meetups hittades.
              </p>
            )}

            {filteredMeetups.map((meetup) => {
              const amISignedUp = mySignups.includes(meetup.id);

              return (
                <button
                  key={meetup.id}
                  className={`meetups-list__item ${
                    selectedId === meetup.id ? "meetups-list__item--active" : ""
                  }`}
                  onClick={() =>
                    setSelectedId((prev) =>
                      prev === meetup.id ? null : meetup.id
                    )
                  }
                >
                  <div className="meetups-list__header">
                    <h2>{meetup.title}</h2>
                    <span className="meetups-list__time">
                      {formatDate(meetup.date)}
                    </span>
                  </div>
                  <p className="meetups-list__line">📍 {meetup.location}</p>

                  {/* VISA VÄRD I LISTAN */}
                  {meetup.host && (
                    <p className="meetups-list__line">👤 {meetup.host}</p>
                  )}

                  <div className="status-container">
                    {amISignedUp && (
                      <span className="status-badge status-badge--registered">
                        <FaCheckCircle /> Anmäld
                      </span>
                    )}
                    {!amISignedUp && isFull && (
                      <span className="status-badge status-badge--full">
                        Fullbokad
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detaljer */}
          <div className="meetup-details">
            {selected ? (
              <>
                <h2>{selected.title}</h2>
                <div className="meetup-meta-grid">
                  <p>
                    <strong>Datum:</strong> {formatDate(selected.date)}
                  </p>
                  <p>
                    <strong>Plats:</strong> {selected.location}
                  </p>
                  <p>
                    <strong>Värd:</strong> {selected.host || "TBA"}
                  </p>
                  <p>
                    <strong>Anmälda:</strong> {selected.attending || 0}{" "}
                    {selected.capacity ? `/ ${selected.capacity}` : ""}
                  </p>
                </div>

                <p className="meetup-details__description-label">
                  <strong>Beskrivning</strong>
                </p>
                <p className="meetup-details__description">
                  {selected.description}
                </p>

                <div className="meetup-actions">
                  {isRegistered ? (
                    <div className="registered-actions">
                      <p className="success-msg">
                        <FaCheckCircle /> Du är anmäld.
                      </p>
                      <button
                        className="action-btn action-btn--danger"
                        onClick={() => handleUnregister(selected.id)}
                      >
                        <FaTimesCircle style={{ marginRight: "8px" }} />{" "}
                        Avregistrera mig
                      </button>
                    </div>
                  ) : isFull ? (
                    <div className="full-warning">
                      <FaExclamationCircle />
                      <span>Fullbokad.</span>
                    </div>
                  ) : (
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
                Välj en meetup i listan för att se detaljer.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
