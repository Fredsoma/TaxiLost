import React from 'react';

export default function LostReportCard({ report }) {
  return (
    <div className="card lost-card">
      <h3>{report.itemName}</h3>
      <p><strong>Taxi ID:</strong> {report.taxiId}</p>
      <p><strong>Reported By:</strong> {report.name}</p>
      <p><strong>Contact:</strong> {report.contact}</p>
      <p><strong>Date:</strong> {new Date(report.timestamp).toLocaleDateString()}</p>

      {report.matchedDriver ? (
        <div className="status status-found">
          Driver Found: {report.matchedDriver.name} ({report.matchedDriver.phone})
        </div>
      ) : (
        <div className="status status-pending">
          No matching driver found yet.
        </div>
      )}

      <button className="contact-btn">📧 Contact</button>
    </div>
  );
}
