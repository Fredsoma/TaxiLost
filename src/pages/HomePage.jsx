import React, { useState, useEffect } from "react";
import axios from "axios";
import LostReportCard from "../components/LostReportCard";

export default function HomePage() {
  const API = process.env.REACT_APP_API_URL; // e.g. "https://taxilost-backend.onrender.com"

  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({
    taxiId: "",
    name: "",
    contact: "",
    itemName: "",
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API}/api/lost-reports`);
      setReports(res.data); 
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/lost-reports`, form);
      setMessage(
        `Submission successful! Matched driver: ${
          res.data.matchedDriver
            ? `${res.data.matchedDriver.name} (${res.data.matchedDriver.phone})`
            : "None"
        }`
      );
      setForm({ taxiId: "", name: "", contact: "", itemName: "" });
      fetchReports();
    } catch (err) {
      console.error(err);
      setMessage("Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container column">
      <section className="home-form card">
        <h2 className="section-title">Have you lost something?</h2>
        <form onSubmit={handleSubmit} className="column" id="homegap">
          <input
            className="input"
            type="text"
            placeholder="Taxi ID"
            value={form.taxiId}
            onChange={(e) => setForm({ ...form, taxiId: e.target.value })}
            required
            disabled={loading}
          />
          <input
            className="input"
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            disabled={loading}
          />
          <input
            className="input"
            type="text"
            placeholder="Your Contact (Phone/Email)"
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
            required
            disabled={loading}
          />
          <input
            className="input"
            type="text"
            placeholder="Item Name (e.g. Black Backpack)"
            value={form.itemName}
            onChange={(e) => setForm({ ...form, itemName: e.target.value })}
            required
            disabled={loading}
          />
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Submitting…" : "Submit Lost Report"}
          </button>
        </form>
        {(message || loading) && (
          <p style={{ color: "var(--color-secondary)", marginTop: "8px" }}>
            {loading ? "Please wait..." : message}
          </p>
        )}
      </section>

      <section>
        <h2 className="section-title">Latest Lost Reports</h2>
        <div className="home-grid">
          {Array.isArray(reports)
            ? reports.map((report) => (
                <LostReportCard key={report._id} report={report} />
              ))
            : null}
        </div>
      </section>
    </div>
  );
}
