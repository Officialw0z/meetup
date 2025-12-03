import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaList } from 'react-icons/fa'; // Ikonerna
import '../styles/Navbar.scss'; // Stilen

const Navbar = () => {
  const location = useLocation();

  // Dölj navbaren om vi är på inloggningssidan
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="navbar">
      {/* Länk till Meetups */}
      <Link 
        to="/meetups" 
        className={`nav-link ${location.pathname === '/meetups' ? 'active' : ''}`}
      >
        <FaList />
        <span>Meetups</span>
      </Link>
      
      {/* Länk till Profil */}
      <Link 
        to="/profile" 
        className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
      >
        <FaUser />
        <span>Profil</span>
      </Link>
    </nav>
  );
};

export default Navbar;