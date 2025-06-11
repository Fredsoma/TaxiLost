// services/api.js

// 1) Base for everything except login/register:
export const API_URL = "https://taxilost-backend.onrender.com";

// 2) Auth-specific base:
export const AUTH_URL = `${API_URL}/auth`;

export const loginUser = async ({ email, password, role }) => {
  const response = await fetch(`${AUTH_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }
  return data;
};

export const registerUser = async (userData) => {
  const res = await fetch(`${AUTH_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Registration failed');
  }
  return data;
};
