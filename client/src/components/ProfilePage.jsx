import React from 'react';
import '../styles/ProfilePage.scss'; // Vi skapar denna strax
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaHistory, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();

  // MOCK-DATA (Eftersom backend inte är kopplad än)
  const upcomingMeetups = [
    { id: 1, title: 'React Advanced Workshop', date: '2023-12-15', time: '18:00', location: 'Stockholm HQ' },
    { id: 2, title: 'Docker for Beginners', date: '2024-01-10', time: '17:30', location: 'Online' },
  ];

  const pastMeetups = [
    { id: 3, title: 'Intro till CI/CD', date: '2023-11-01', time: '18:00', location: 'Göteborg' },
    { id: 4, title: 'AWS Cloud Basics', date: '2023-10-20', time: '19:00', location: 'Online' },
  ];

  const handleLogout = () => {
    navigate('/'); // Gå tillbaka till inloggning
  };

  return (
    <div className="profile">
      <div className="profile__wrapper">
        
        {/* Header Section */}
        <header className="profile__header">
          <div className="profile__user-info">
            <div className="profile__avatar">JW</div>
            <div>
              <h1>Hej, John Wick!</h1>
              <p>Fullstack Developer</p>
            </div>
          </div>
          <button onClick={handleLogout} className="profile__logout-btn">
            <FaSignOutAlt /> Logga ut
          </button>
        </header>

        {/* Kommande Meetups */}
        <section className="profile__section">
          <h2><FaCalendarAlt /> Kommande Meetups</h2>
          <div className="meetup-list">
            {upcomingMeetups.map((meetup) => (
              <div key={meetup.id} className="meetup-card meetup-card--upcoming">
                <div className="meetup-card__date">
                  <span>{meetup.date.split('-')[2]}</span>
                  <small>DEC</small> {/* Hårdkodat för demo */}
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
            {pastMeetups.map((meetup) => (
              <div key={meetup.id} className="meetup-card meetup-card--past">
                <div className="meetup-card__info">
                  <h3>{meetup.title}</h3>
                  <p>{meetup.date} • {meetup.location}</p>
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