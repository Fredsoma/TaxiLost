import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function ScanPage() {
  const [searchParams] = useSearchParams();
  const prefilledTaxiId = searchParams.get('taxiId') || '';
  const [taxiId, setTaxiId] = useState(prefilledTaxiId);
  const [contact, setContact] = useState('');
  const [tripId, setTripId] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [step, setStep] = useState(prefilledTaxiId ? 2 : 1); // If taxiId prefills, skip step 1

  const navigate = useNavigate();

  // If taxiId is already in the URL (from QR scan), skip the “enter taxiId” form.
  useEffect(() => {
    if (prefilledTaxiId) {
      setTaxiId(prefilledTaxiId);
    }
  }, [prefilledTaxiId]);

  const handleRegisterTrip = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/passenger/register-trip', { taxiId, contact });
      setTripId(res.data.tripId);
      setTimestamp(res.data.timestamp);
      setStep(3);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Error registering trip (is the taxi ID valid?).');
    }
  };

  if (step === 1) {
    return (
      <div>
        <h2>1) Enter Taxi ID or Scan QR</h2>
        <form onSubmit={handleRegisterTrip} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label>
            Taxi ID:
            <input
              type="text"
              value={taxiId}
              onChange={e => setTaxiId(e.target.value)}
              placeholder="e.g. TAXI-1234"
              required
            />
          </label>
          <label>
            Your Contact (phone/email):
            <input
              type="text"
              value={contact}
              onChange={e => setContact(e.target.value)}
              placeholder="+2376XXXXXXXX"
              required
            />
          </label>
          <button type="submit" style={{ padding: '0.5rem', fontSize: '1rem' }}>
            Register Trip
          </button>
        </form>
        <p style={{ marginTop: '1rem' }}>
          Or <Link to="/scan-qr">scan the taxi’s QR code</Link>.
        </p>
      </div>
    );
  }

  if (step === 2) {
    // Taxi ID was prefetched via QR; now ask for contact
    return (
      <div>
        <h2>Taxi: <strong>{taxiId}</strong></h2>
        <h3>2) Enter Your Contact</h3>
        <form onSubmit={handleRegisterTrip} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label>
            Your Contact (phone/email):
            <input
              type="text"
              value={contact}
              onChange={e => setContact(e.target.value)}
              placeholder="+2376XXXXXXXX"
              required
            />
          </label>
          <button type="submit" style={{ padding: '0.5rem', fontSize: '1rem' }}>
            Register Trip
          </button>
        </form>
      </div>
    );
  }

  if (step === 3) {
    // Trip registered; show link to “Report Lost Item”
    return (
      <div>
        <h2>Trip Registered ✔</h2>
        <p>
          <strong>Taxi ID:</strong> {taxiId}<br/>
          <strong>Timestamp:</strong> {new Date(timestamp).toLocaleString()}
        </p>
        <p>
          If you realize you’ve lost something, click below:
        </p>
        <button
          onClick={() => navigate(`/report-lost/${tripId}`)}
          style={{ padding: '0.5rem', fontSize: '1rem' }}
        >
          Report Lost Item
        </button>
      </div>
    );
  }

  return null;
}
