import React, { useEffect, useState } from "react";
import axios from "axios";
import QRScanner from "../components/QRScanner";
import "./ClientDashboard.css";

const ClientDashboard = () => {
  const [client, setClient] = useState(null);
  const [lostReports, setLostReports] = useState([]);
  const [description, setDescription] = useState("");
  const [taxiId, setTaxiId] = useState("");
  const [message, setMessage] = useState("");
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchReports();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/client/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClient(res.data);
    } catch (error) {
      console.error("Error fetching client profile:", error);
    }
  };

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/client/lost-reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Lost Reports API response:", res.data);
      // Defensive check to ensure lostReports is always an array
      setLostReports(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching lost reports:", error);
      setLostReports([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return alert("Description is required.");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/client/lost-report",
        { description, taxiId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Lost report submitted successfully.");
      setDescription("");
      setTaxiId("");
      fetchReports();
    } catch (err) {
      setMessage("Failed to submit report.");
      console.error("Error submitting lost report:", err);
    }
  };

  return (
    <div className="client-dashboard">
      <h1>👤 Client Dashboard</h1>

      {client && (
        <div className="profile-card">
          <h2>Welcome, {client.fullName}</h2>
          <p>Email: {client.email}</p>
          <p>Phone: {client.phoneNumber}</p>
        </div>
      )}

      <div className="form-section">
        <h2>📝 Report Lost Item</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Describe the lost item..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Taxi ID (optional)"
            value={taxiId}
            onChange={(e) => setTaxiId(e.target.value)}
          />

          {/* Button to toggle scanner */}
          <button type="button" onClick={() => setScanning((prev) => !prev)}>
            {scanning ? "Stop Scanner" : "Start Scanner"}
          </button>

          {/* Only render scanner if scanning is true */}
          {scanning && (
            <QRScanner
              onScan={(value) => {
                setTaxiId(value);
                setScanning(false); // stop scanning once value captured
              }}
            />
          )}

          <button type="submit" className="position">
            Submit Report
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>

      <div className="reports-section">
        <h2>📄 My Lost Reports</h2>
        {Array.isArray(lostReports) && lostReports.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Taxi ID</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {lostReports.map((report) => (
                <tr key={report._id}>
                  <td>{report.description}</td>
                  <td>{report.taxiId || "N/A"}</td>
                  <td>{report.status}</td>
                  <td>{new Date(report.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No reports yet.</p>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
