// src/App.jsx
import React from "react";

import LandingPage from "./components/LandingPage.jsx";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthPage from "./components/AuthPage.jsx";
import MeetupsPage from "./components/MeetupsPage.jsx";
import Navbar from "./components/Navbar.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import "./index.css";

function App() {
 feature/landing-page
  return <LandingPage />;
  return <AuthPage />;
  return <MeetupList />;


  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/meetups" element={<MeetupsPage />} />
        
        {/* Skydda profilsidan */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );

}

export default App;