import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  // Existing states
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  //  lost reports states
  const [lostReports, setLostReports] = useState([]);
  const [lostReportsLoading, setLostReportsLoading] = useState(true);

  // Ban driver states
  const [taxiIdToBan, setTaxiIdToBan] = useState("");
  const [banReason, setBanReason] = useState("");
  const [banMessage, setBanMessage] = useState("");
  const [showConfirmBan, setShowConfirmBan] = useState(false);

  // Banned drivers list
  const [bannedDrivers, setBannedDrivers] = useState([]);

  // Driver lookup
  const [taxiIdInput, setTaxiIdInput] = useState("");
  const [driverInfo, setDriverInfo] = useState(null);
  const [driverError, setDriverError] = useState("");

  // Fetch found and lost reports + banned drivers on mount
  useEffect(() => {
    fetchFoundReports();
    fetchLostReports();
    fetchBannedDrivers();
  }, []);

  const fetchFoundReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/admin/found-reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(res.data);
    } catch (err) {
      console.error("Error loading found reports", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLostReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/admin/lost-reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLostReports(res.data);
    } catch (err) {
      console.error("Error loading lost reports", err);
    } finally {
      setLostReportsLoading(false);
    }
  };

  const fetchBannedDrivers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/admin/banned-drivers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBannedDrivers(res.data);
    } catch (err) {
      console.error("Failed to fetch banned drivers", err);
    }
  };

  // Ban confirmation trigger
  const confirmBan = () => {
    if (!taxiIdToBan.trim()) {
      alert("Please enter Taxi ID.");
      return;
    }
    setShowConfirmBan(true);
  };

  // Ban driver request
  const handleBanDriver = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `/api/admin/ban-driver/${taxiIdToBan}`,
        { reason: banReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBanMessage(res.data.message);
      setShowConfirmBan(false);
      setBanReason("");
      setTaxiIdToBan("");
      fetchBannedDrivers();
    } catch (err) {
      setBanMessage(err.response?.data?.error || "Error banning driver");
    }
  };

  // Unban driver request
  const handleUnbanDriver = async (taxiId) => {
    if (!window.confirm(`Unban driver ${taxiId}?`)) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `/api/admin/unban-driver/${taxiId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      fetchBannedDrivers();
    } catch (err) {
      alert(err.response?.data?.error || "Error unbanning driver");
    }
  };

  // Driver lookup 
  const handleSearchDriver = async () => {
    try {
      setDriverError("");
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/admin/driver/${taxiIdInput}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDriverInfo(res.data);
    } catch (err) {
      setDriverInfo(null);
      setDriverError("Driver not found or an error occurred");
      console.error("Error fetching driver:", err);
    }
  };

  // Update lost report status (e.g. mark as Found)
  const updateReportStatus = async (reportId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `/api/admin/update-report-status/${reportId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update state locally to avoid refetch
      setLostReports((prev) =>
        prev.map((r) => (r._id === reportId ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      alert("Failed to update report status.");
      console.error(err);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>📦 All Found Item Reports</h1>

      {loading ? (
        <p>Loading reports...</p>
      ) : reports.length === 0 ? (
        <p>No found reports.</p>
      ) : (
        <table className="report-table">
          <thead>
            <tr>
              <th>Driver Name</th>
              <th>Email</th>
              <th>Taxi ID</th>
              <th>Description</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report._id}>
                <td>{report.driver?.fullName}</td>
                <td>{report.driver?.email}</td>
                <td>{report.driver?.taxiId}</td>
                <td>{report.description}</td>
                <td>{new Date(report.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <hr />

      <div className="lost-reports-section">
        <h2>🕵️‍♂️ Lost Item Reports</h2>
        {lostReportsLoading ? (
          <p>Loading lost reports...</p>
        ) : lostReports.length === 0 ? (
          <p>No lost item reports.</p>
        ) : (
          <table className="report-table" id="report2">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Email</th>
                <th>Description</th>
                <th>Taxi ID</th>
                <th>Status</th>
                <th>Submitted At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lostReports.map((report) => (
                <tr key={report._id}>
                  <td>{report.user?.fullName || "N/A"}</td>
                  <td>{report.user?.email || "N/A"}</td>
                  <td>{report.description}</td>
                  <td>{report.taxiId || "N/A"}</td>
                  <td>{report.status || "Lost"}</td>
                  <td>{new Date(report.createdAt).toLocaleString()}</td>
                  <td>
                    {report.status !== "Found" && (
                      <button
                        onClick={() => updateReportStatus(report._id, "Found")}
                      >
                        Mark as Found
                      </button>
                    )}
                    {report.status === "Found" && <span>Found</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <hr />

      {/* Driver lookup */}
      <div className="driver-lookup">
        <h2>🔍 Find Driver by Taxi ID</h2>
        <input
          type="text"
          value={taxiIdInput}
          onChange={(e) => setTaxiIdInput(e.target.value)}
          placeholder="Enter Taxi ID"
        />
        <button onClick={handleSearchDriver}>Search</button>

        {driverError && <p className="error">{driverError}</p>}

        {driverInfo && (
          <div className="driver-info">
            <h3>Driver Information</h3>
            <p>
              <strong>Name:</strong> {driverInfo.fullName}
            </p>
            <p>
              <strong>Email:</strong> {driverInfo.email}
            </p>
            <p>
              <strong>Phone:</strong> {driverInfo.phoneNumber}
            </p>
            <p>
              <strong>Taxi ID:</strong> {driverInfo.taxiId}
            </p>
            <p>
              <strong>Vehicle:</strong> {driverInfo.vehicleModel} (
              {driverInfo.vehiclePlate})
            </p>
            <p>
              <strong>License:</strong> {driverInfo.licenseNumber}
            </p>
            <p>
              <strong>Reports:</strong> {driverInfo.foundItems.length}
            </p>
          </div>
        )}
      </div>

      <hr />

      {/* Ban driver section */}
      <div className="ban-driver-section">
        <h2>🚫 Ban a Taxi Driver</h2>
        <input
          type="text"
          placeholder="Enter Taxi ID"
          value={taxiIdToBan}
          onChange={(e) => setTaxiIdToBan(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Reason for ban (optional)"
          value={banReason}
          onChange={(e) => setBanReason(e.target.value)}
        />
        <button onClick={confirmBan}>Ban Driver</button>

        {banMessage && <p className="ban-message">{banMessage}</p>}

        {/* Confirmation modal */}
        {showConfirmBan && (
          <div className="confirm-modal">
            <p>
              Are you sure you want to ban driver <strong>{taxiIdToBan}</strong>{" "}
              for reason: "{banReason || "No reason provided"}"?
            </p>
            <button onClick={handleBanDriver} className="ban-button">
              Confirm Ban
            </button>
            <button onClick={() => setShowConfirmBan(false)}>Cancel</button>
          </div>
        )}
      </div>

      <hr />

      {/* Banned drivers list */}
      <div className="banned-drivers-section">
        <h2>🚫 Banned Drivers</h2>
        {bannedDrivers.length === 0 ? (
          <p>No banned drivers currently.</p>
        ) : (
          <table className="report-table">
            <thead>
              <tr>
                <th>Taxi ID</th>
                <th>Name</th>
                <th>Ban Reason</th>
                <th>Ban Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bannedDrivers.map((driver) => (
                <tr key={driver.taxiId}>
                  <td>{driver.taxiId}</td>
                  <td>{driver.fullName}</td>
                  <td>{driver.banReason || "N/A"}</td>
                  <td>
                    {driver.banDate && !isNaN(new Date(driver.banDate))
                      ? new Date(driver.banDate).toLocaleString()
                      : "N/A"}
                  </td>

                  <td>
                    <button onClick={() => handleUnbanDriver(driver.taxiId)}>
                      Unban
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
