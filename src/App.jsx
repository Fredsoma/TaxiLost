import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import RegisterTaxiPage from "./pages/RegisterTaxiPage";
import AboutPage from "./pages/AboutPage";
import TaxiLookupPage from "./pages/TaxiLookupPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DriverDashboard from "./pages/DriverDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import UpdateProfile from "./pages/UpdateProfile";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const { token } = useContext(AuthContext);

  return (
    <div className="app-container">
      {token && <Navbar />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/client-dashboard"
            element={
              <ProtectedRoute allowedRoles={["client"]}>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute allowedRoles={["client"]}>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/taxi-lookup"
            element={
              <ProtectedRoute allowedRoles={["client"]}>
                <TaxiLookupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute allowedRoles={["client", "taxidriver"]}>
                <AboutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver-dashboard"
            element={
              <ProtectedRoute allowedRoles={["taxidriver"]}>
                <DriverDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-profile"
            element={
              <ProtectedRoute allowedRoles={["taxidriver"]}>
                <UpdateProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register-taxi"
            element={
              <ProtectedRoute allowedRoles={["taxidriver"]}>
                <RegisterTaxiPage />
              </ProtectedRoute>
            }
          />
          <Route path="/unauthorized" element={<h2>Unauthorized Access</h2>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {token && <Footer />}
    </div>
  );
}

export default App;
