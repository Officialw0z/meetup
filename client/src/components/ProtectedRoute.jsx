import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // Om ingen token finns, skicka tillbaka till start/login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Annars, visa sidan
  return children;
};

export default ProtectedRoute;