// DriverDashboard.jsx
import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './DriverDashboard.css';

const DriverDashboard = () => {
  const [driver, setDriver] = useState(null);
  const [foundItem, setFoundItem] = useState('');
  const [submittedReport, setSubmittedReport] = useState(null);

  useEffect(() => {
    const fetchDriver = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/taxidriver/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // normalize foundItems to array
      const data = {
        ...res.data,
        foundItems: Array.isArray(res.data.foundItems) ? res.data.foundItems : []
      };
      setDriver(data);
    };
    fetchDriver();
  }, []);

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        '/api/taxidriver/report-found-item',
        { description: foundItem },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubmittedReport(res.data);

      const updated = await axios.get('/api/taxidriver/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDriver({
        ...updated.data,
        foundItems: Array.isArray(updated.data.foundItems) ? updated.data.foundItems : []
      });
      setFoundItem('');
    } catch (err) {
      console.error('Error submitting report:', err);
    }
  };

  if (!driver) return <p>Loading...</p>;

  const qrData = {
    name: driver.fullName,
    email: driver.email,
    phone: driver.phoneNumber,
    taxiId: driver.taxiId,
    plate: driver.vehiclePlate,
    model: driver.vehicleModel,
    license: driver.licenseNumber,
  };

  return (
    <div className="driver-dashboard-container">
      <nav className="dashboard-navbar">
        <h2>🚖 PMAD FindMe - Driver Dashboard</h2>
        <Link to="/update-profile" className="nav-link">Update Profile</Link>
      </nav>

      <div className="driver-info-card">
        <h1>Welcome, {driver.fullName}</h1>
        <p><strong>Taxi ID:</strong> {driver.taxiId}</p>
        <p><strong>Email:</strong> {driver.email}</p>
        <p><strong>Phone:</strong> {driver.phoneNumber}</p>

        <div className="qr-section">
          <h3>Your QR Code:</h3>
          <QRCodeCanvas value={JSON.stringify(qrData)} size={200} />
        </div>

        <div className="report-form">
          <h3>🧾 Report a Found Item</h3>
          <form onSubmit={handleSubmitReport}>
            <textarea
              value={foundItem}
              onChange={(e) => setFoundItem(e.target.value)}
              placeholder="Describe the item left behind by a passenger..."
              required
            />
            <button type="submit">Submit Report</button>
          </form>

          {submittedReport && (
            <div className="report-confirmation">
              <p><strong>✅ Report saved:</strong> {submittedReport.description}</p>
            </div>
          )}
        </div>

        {driver.foundItems.length > 0 && (
          <div className="previous-reports">
            <h3>📦 Items You've Reported:</h3>
            <ul>
              {driver.foundItems.map((item) => (
                <li key={item._id}>{item.description}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
