const API_URL = "https://taxilost-backend.onrender.com/auth";

export const loginUser = async ({ email, password, role }) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role }),
  });
  const data = await response.json();

  if (!response.ok) {
    // Normalize any error payload into an array of messages
    const errs = Array.isArray(data.errors)
      ? data.errors
      : data.error
      ? [data.error]
      : data.message
      ? [data.message]
      : ['Login failed'];
    throw errs;   // throws string[]
  }

  return data;   // { token, role, … }
};

export const registerUser = async (userData) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await res.json();

  if (!res.ok) {
    const errs = Array.isArray(data.errors)
      ? data.errors
      : data.error
      ? [data.error]
      : ['Registration failed'];
    throw errs;   // throws string[]
  }

  return data;   // { token, role, taxiId, … }
};
