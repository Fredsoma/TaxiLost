import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo flex items-center">
          <img
            src="/taxi-logo.png"
            alt="TaxiLost Logo"
            style={{ height: "50px", marginRight: "8px" }}
          />
          TaxiLost
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/taxi-lookup" className="nav-link">
            Find Taxi
          </Link>
          <Link to="/register-taxi" className="nav-link">
            Register Taxi
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
        </div>

        <button
          className="hamburger"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          &#9776;
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link
            to="/taxi-lookup"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            Find Taxi
          </Link>
          <Link
            to="/register-taxi"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            Register Taxi
          </Link>
          <Link
            to="/about"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
        </div>
      )}
    </nav>
  );
}
