import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import '../styles/ProfilePage.scss'; // Återanvänd stilen

const MeetupsPage = () => {
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // MOCK: Simulera hämtning av alla meetups
    setTimeout(() => {
      setMeetups([
        { id: 1, title: 'JavaScript Basics', date: '2023-12-05', location: 'Stockholm', description: 'Lär dig grunderna i JS.' },
        { id: 2, title: 'React Advanced', date: '2023-12-12', location: 'Online', description: 'Djupdykning i Hooks och Context.' },
        { id: 3, title: 'After Work & Beer', date: '2023-12-15', location: 'Göteborg', description: 'Vi tjötar kod och dricker gott.' },
        { id: 4, title: 'Docker Workshop', date: '2024-01-10', location: 'Stockholm', description: 'Bygg din första container.' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleJoin = (meetupId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Du måste logga in för att anmäla dig!");
      return;
    }
    // Bara en alert tills backend är klar
    alert(`Backend-anrop: "Anmäl user till meetup ${meetupId}"`);
  };

  if (loading) {
    return (
      <div className="profile">
        <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
           <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile">
      <div className="profile__wrapper">
        <header className="profile__header">
          <div>
            <h1>Alla Meetups</h1>
            <p>Hitta ditt nästa event</p>
          </div>
          <div className="profile__avatar"><FaSearch /></div> 
        </header>

        <section className="profile__section">
            <div className="meetup-list">
              {meetups.map((meetup) => (
                <div key={meetup.id} className="meetup-card meetup-card--upcoming">
                  <div className="meetup-card__date">
                    <span>{meetup.date.split('-')[2]}</span>
                    <small>DEC</small>
                  </div>
                  
                  <div className="meetup-card__info">
                    <h3>{meetup.title}</h3>
                    <p style={{marginBottom: '0.5rem', fontSize: '0.9rem', color: '#9ca3af'}}>{meetup.description}</p>
                    <p><FaMapMarkerAlt /> {meetup.location}</p>
                  </div>
                  
                  <button 
                    className="meetup-card__btn" 
                    onClick={() => handleJoin(meetup.id)}
                  >
                    Anmäl mig
                  </button>
                </div>
              ))}
            </div>
        </section>
      </div>
    </div>
  );
};

export default MeetupsPage;
