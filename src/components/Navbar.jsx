import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css"; 

export default function Navbar() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link className="logo">
          <img src="/taxi-logo.png" alt="TaxiLost Logo" className="logo logo-image" />
          TaxiLost
        </Link>

        <div className="nav-links desktop-only">
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <button className="hamburger mobile-only" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <button className="logout-button mobile-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
