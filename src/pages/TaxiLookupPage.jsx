// client/src/pages/TaxiLookupPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import QRScanner from '../components/QRScanner';

export default function TaxiLookupPage() {
  const [taxiId, setTaxiId] = useState('');
  const [driverInfo, setDriverInfo] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!taxiId.trim()) return;
    setLoading(true);
    setMessage(null);
    setDriverInfo(null);

    try {
      // Call the new public endpoint: /api/taxi/:taxiId
      const res = await axios.get(
        `/api/taxi/${encodeURIComponent(taxiId.trim())}`
      );
      setDriverInfo(res.data);
    } catch (err) {
      console.error(err);
      setMessage('No driver found with this Taxi ID.');
    } finally {
      setLoading(false);
    }
  };

  const handleScanSuccess = (data) => {
    // Expect QR code data in format: "taxi:<TAXI_ID>"
    if (data && data.startsWith('taxi:')) {
      const scanned = data.split(':')[1];
      setTaxiId(scanned);
      handleSearch();
    }
  };

  return (
    <div className="container lookup-form">
      <h2 className="section-title">Find Taxi</h2>

      <div className="lookup-grid">
        {/* Manual entry */}
        <div>
          <label>
            Enter Taxi ID
            <div className="flex" id="gap">
              <input
                className="input"
                type="text"
                value={taxiId}
                onChange={(e) => setTaxiId(e.target.value)}
                placeholder="e.g. TX-123456"
                disabled={loading}
              />
              <button
                className="btn"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? 'Searching…' : 'Search'}
              </button>
            </div>
          </label>
        </div>

        {/* QR Scanner */}
        <div>
          <label>Or Scan QR Code</label>
          <div id="qr-reader-wrapper">
            <QRScanner onScanSuccess={handleScanSuccess} />
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <p style={{ color: 'var(--color-primary)', marginTop: '8px' }}>
          Loading…
        </p>
      )}

      {/* Error or “not found” message */}
      {message && (
        <p style={{ color: 'var(--color-error)', marginTop: '8px' }}>
          {message}
        </p>
      )}

      {/* Driver info card */}
      {driverInfo && (
        <div className="lookup-result">
          <h3>Driver Information</h3>
          <p>
            <strong>Name:</strong> {driverInfo.driverName}
          </p>
          <p>
            <strong>Phone:</strong> {driverInfo.phone}
          </p>
          <p>
            <strong>Car Plate:</strong> {driverInfo.carPlate}
          </p>
          <p>
            <strong>Taxi ID:</strong> {driverInfo.taxiId}
          </p>
        </div>
      )}
    </div>
  );
}
