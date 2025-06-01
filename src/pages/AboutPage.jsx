// client/src/pages/AboutPage.jsx
import React from 'react';

export default function AboutPage() {
  return (
    <div className="container about-container">
      <h2 className="section-title">About TaxiLost</h2>

      <p style={{ color: 'var(--color-text-alt)', marginBottom: 'var(--spacing)' }}>
        TaxiLost is a platform launched in 2025 with the goal of bridging the gap between passengers
        and taxi drivers when personal belongings are forgotten in vehicles. Our mission is to streamline
        the process of reporting lost items and connecting passengers with taxi drivers quickly and efficiently.
      </p>

      <p style={{ color: 'var(--color-text-alt)', marginBottom: 'var(--spacing)' }}>
        <strong>How it works:</strong>
      </p>
      <ul className="about-list">
        <li>Passengers submit a lost item report with the taxi ID and item details.</li>
        <li>TaxiLost searches our database for a matching taxi ID and notifies the driver.</li>
        <li>Drivers view lost item reports, confirm if the item is found, and contact the passenger directly.</li>
      </ul>

      <p style={{ color: 'var(--color-text-alt)' }}>
        Built with passion in Cameroon, TaxiLost aims to make public transport safer and more reliable for everyone.
      </p>
    </div>
  );
}
