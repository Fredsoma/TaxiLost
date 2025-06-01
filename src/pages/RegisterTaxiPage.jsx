import React, { useState } from 'react';
import axios from 'axios';

export default function RegisterTaxiPage() {
  const API = process.env.REACT_APP_API_URL; // e.g. "https://taxilost-backend.onrender.com"

  const [form, setForm] = useState({ driverName: '', phone: '', carPlate: '' });
  const [taxiId, setTaxiId] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.post(`${API}/api/register-taxi`, form);
      setTaxiId(res.data.taxiId);
      setMessage('Taxi registered successfully!');
      setForm({ driverName: '', phone: '', carPlate: '' });
    } catch (err) {
      console.error(err);
      setMessage('Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container register-form card">
      <h2 className="section-title">Register Your Taxi</h2>
      <form onSubmit={handleSubmit} className="column" id="registertaxigap">
        <label>
          Driver Name:
          <input
            className="input"
            type="text"
            value={form.driverName}
            onChange={(e) => setForm({ ...form, driverName: e.target.value })}
            required
            disabled={loading}
          />
        </label>
        <label>
          Phone Number:
          <input
            className="input"
            type="text"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
            disabled={loading}
          />
        </label>
        <label>
          Car Plate Number:
          <input
            className="input"
            type="text"
            value={form.carPlate}
            onChange={(e) => setForm({ ...form, carPlate: e.target.value })}
            required
            disabled={loading}
          />
        </label>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Registering…' : 'Submit Registration'}
        </button>
      </form>

      {loading && (
        <p style={{ marginTop: '8px', color: 'var(--color-primary)' }}>
          Loading…
        </p>
      )}

      {message && (
        <p style={{ color: 'var(--color-success)', marginTop: '8px' }}>
          {message} {taxiId && <span>Your Taxi ID: <strong>{taxiId}</strong></span>}
        </p>
      )}
    </div>
  );
}
