import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import './login.css';
import taxilost from '../assets/taxi-logo.png';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const [role, setRole] = useState('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError([]);

    try {
      const data = await loginUser({ email, password, role });

      if (!data.token) {
        setError([data.error || 'Login failed']);
        setIsLoading(false);
        return;
      }

      login(data.token, data.role);

      if (data.role === 'taxidriver') {
        navigate('/driver-dashboard');
      } else if (data.role === 'client') {
        navigate('/client-dashboard');
      } else if (data.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        setError(['Unknown role. Please contact support.']);
      }
    } catch (err) {
      console.error('Login error:', err);
      const messages = Array.isArray(err)
        ? err
        : [err?.message || err?.toString() || 'Login failed'];
      setError(messages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className={`login-card ${role}`}>
        <img src={taxilost} alt="PMAD FindMe logo" className="login-logo" />
        <h2 className="login-title">Login to PMAD FindMe</h2>

        <div className="login-role-switch">
          <span>Login as a:</span>
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
          <label>
            <input
              type="radio"
              name="role"
              value="admin"
              checked={role === 'admin'}
              onChange={() => setRole('admin')}
            />
            Admin
          </label>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError([]);
            }}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError([]);
            }}
            required
            className="login-input"
          />

          {(Array.isArray(error) ? error : [error])
            .filter(Boolean)
            .map((msg, i) => (
              <p key={i} className="login-error">{msg}</p>
            ))}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading
              ? 'Signing in…'
              : `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
          </button>
        </form>

        <p className="login-footer">
          Don’t have an account?{' '}
          <Link to="/register" className="login-link">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
