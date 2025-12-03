import React, { useState, useEffect } from 'react';
import '../styles/ProfilePage.scss';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaHistory, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  
  // States
  const [loading, setLoading] = useState(true); // Börjar som "laddar"
  const [upcomingMeetups, setUpcomingMeetups] = useState([]);
  const [pastMeetups, setPastMeetups] = useState([]);
  const [username] = useState(localStorage.getItem("username") || "Användare");

 useEffect(() => {
    
    const fakeFetch = () => {
      setTimeout(() => {
        // Låtsas-data
        setUpcomingMeetups([
           { id: 1, title: 'React Workshop', date: '2023-12-15', time: '18:00', location: 'Stockholm HQ' },
           { id: 2, title: 'Julfest med koden', date: '2023-12-20', time: '17:00', location: 'Kontoret' }
        ]);
        
        setPastMeetups([
           { id: 3, title: 'Intro till Docker', date: '2023-11-01', time: '18:00', location: 'Online' }
        ]);

        setLoading(false);
      }, 1500);
    };

    fakeFetch();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate('/');
  };

  // --- RENDERING ---

  // 1. Visa spinner om vi laddar
  if (loading) {
    return (
      <div className="profile">
        {/* Centrerad spinner */}
        <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
           <div className="spinner"></div> {/* Se till att CSS finns för denna */}
        </div>
      </div>
    );
  }

  // 2. Visa profilen när datan är "hämtad"
  return (
    <div className="profile">
      <div className="profile__wrapper">
        
        <header className="profile__header">
          <div className="profile__user-info">
            <div className="profile__avatar">{username.charAt(0).toUpperCase()}</div>
            <div>
              <h1>Hej, {username}!</h1>
              <p>Meetup Medlem</p>
            </div>
          </div>
          <button onClick={handleLogout} className="profile__logout-btn">
            <FaSignOutAlt /> Logga ut
          </button>
        </header>

        {/* Kommande */}
        <section className="profile__section">
          <h2><FaCalendarAlt /> Kommande Meetups</h2>
          <div className="meetup-list">
            {upcomingMeetups.map((meetup) => (
              <div key={meetup.id} className="meetup-card meetup-card--upcoming">
                <div className="meetup-card__date">
                  <span>{meetup.date.split('-')[2]}</span>
                  <small>DEC</small>
                </div>
                <div className="meetup-card__info">
                  <h3>{meetup.title}</h3>
                  <p><FaClock /> {meetup.time} • <FaMapMarkerAlt /> {meetup.location}</p>
                </div>
                <button className="meetup-card__btn">Info</button>
              </div>
            ))}
          </div>
        </section>

        {/* Historik */}
        <section className="profile__section">
          <h2><FaHistory /> Tidigare Meetups</h2>
          <div className="meetup-list">
             {/* ... rendera pastMeetups på samma sätt ... */}
             {pastMeetups.map((meetup) => (
                <div key={meetup.id} className="meetup-card meetup-card--past">
                   <div className="meetup-card__info">
                      <h3>{meetup.title}</h3>
                      <p>{meetup.date}</p>
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