import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import './register.css';
import taxilost from '../assets/taxi-logo.png';

const RegisterPage = () => {
  const [role, setRole] = useState('client');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    licenseNumber: '',
    plateNumber: '',
    vehicleModel: '',
  });
  const [error, setError] = useState([]); // fixed
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError([]);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      role,
      fullName: form.fullName,
      email: form.email,
      password: form.password,
      phoneNumber: form.phoneNumber,
      ...(role === 'taxidriver' && {
        licenseNumber: form.licenseNumber,
        plateNumber: form.plateNumber,
        vehicleModel: form.vehicleModel,
      }),
    };

    try {
      const response = await registerUser(payload);
      if (response.token) {
        navigate('/login');
      } else {
        setError([response.error || 'Registration failed']);
      }
    } catch (err) {
      console.error('Register error:', err);
      const messages = Array.isArray(err)
        ? err
        : [err?.message || err?.toString() || 'Registration failed'];
      setError(messages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className={`register-card ${role}`}>
        <img src={taxilost} alt="PMAD FindMe logo" className="register-logo" />
        <h2 className="register-title">Register to PMAD FindMe</h2>

        <div className="register-role-switch">
          <span>Register as a:</span>
          <label>
            <input
              type="radio"
              name="role"
              value="client"
              checked={role === 'client'}
              onChange={() => setRole('client')}
            />
            Client
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="taxidriver"
              checked={role === 'taxidriver'}
              onChange={() => setRole('taxidriver')}
            />
            Taxi Driver
          </label>
        </div>

        <form onSubmit={handleRegister} className="register-form">
          <input type="text" name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required className="register-input" />
          <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required className="register-input" />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required className="register-input" />
          <input type="tel" name="phoneNumber" placeholder="Phone Number" value={form.phoneNumber} onChange={handleChange} required className="register-input" />

          {role === 'taxidriver' && (
            <>
              <input type="text" name="licenseNumber" placeholder="Driver’s License No." value={form.licenseNumber} onChange={handleChange} required className="register-input" />
              <input type="text" name="plateNumber" placeholder="Vehicle Plate Number" value={form.plateNumber} onChange={handleChange} required className="register-input" />
              <input type="text" name="vehicleModel" placeholder="Vehicle Model" value={form.vehicleModel} onChange={handleChange} required className="register-input" />
            </>
          )}

          {error.length > 0 && (
            <div className="error-container">
              {error.map((msg, i) => (
                <p key={i} className="register-error">{msg}</p>
              ))}
            </div>
          )}

          <button type="submit" className="register-button" disabled={isLoading}>
            {isLoading
              ? 'Creating account…'
              : role === 'client'
                ? 'Register as Client'
                : 'Register as Driver'}
          </button>
        </form>

        <p className="register-footer">
          Already registered?{' '}
          <Link to="/login" className="register-link">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
