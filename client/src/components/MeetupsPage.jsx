// src/components/MeetupsPage.jsx
import { useState } from "react";
import "../styles/MeetupsPage.scss";

const MOCK_MEETUPS = [
  {
    id: 1,
    title: "React Meetup",
    time: "2025-12-10T18:00:00",
    location: "Stockholm, Folkuniversitetet",
    host: "Magdalena",
    description:
      "Vi går igenom grunderna i React, komponenter och hur vi byggt den här appen.",
  },
  {
    id: 2,
    title: "JavaScript-kväll",
    time: "2025-12-15T17:30:00",
    location: "Online (Zoom)",
    host: "Klassgruppen",
    description:
      "Frågestund om JavaScript, CI/CD, Git flow och grupparbetet.",
  },
  {
    id: 3,
    title: "CI/CD & DevOps intro",
    time: "2026-01-05T17:00:00",
    location: "Campus / Hybrid",
    host: "Läraren",
    description:
      "Vi tittar på pipelines, GitHub Actions och hur deployen till AWS & Render fungerar.",
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

  const selected = MOCK_MEETUPS.find((m) => m.id === selectedId);

  return (
    <div className="meetups-wrapper">
      <div className="meetups-card">
        <h1 className="meetups-card__title">Kommande meetups</h1>
        <p className="meetups-card__subtitle">
          Välj en meetup för att se mer detaljer om tid, plats, värd och
          beskrivning.
        </p>

        <div className="meetups-layout">
          {/* Lista med meetups */}
          <div className="meetups-list">
            {MOCK_MEETUPS.map((meetup) => (
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
                <p className="meetups-list__line">👤 Värd: {meetup.host}</p>
              </button>
            ))}
          </div>

          {/* Detaljer för vald meetup */}
          <div className="meetup-details">
            {selected ? (
              <>
                <h2>{selected.title}</h2>
                <p>
                  <strong>Tid:</strong> {formatDate(selected.time)}
                </p>
                <p>
                  <strong>Plats:</strong> {selected.location}
                </p>
                <p>
                  <strong>Värd:</strong> {selected.host}
                </p>
                <p className="meetup-details__description-label">
                  <strong>Beskrivning</strong>
                </p>
                <p className="meetup-details__description">
                  {selected.description}
                </p>
              </>
            ) : (
              <p className="meetup-details__placeholder">
                Ingen meetup vald ännu. Klicka på en meetup i listan till vänster.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}