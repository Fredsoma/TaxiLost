import React, { useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterTaxiPage from './pages/RegisterTaxiPage';
import AboutPage from './pages/AboutPage';
import TaxiLookupPage from './pages/TaxiLookupPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './index.css';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/taxi-lookup" element={<TaxiLookupPage />} />
          <Route path="/register-taxi" element={<RegisterTaxiPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
