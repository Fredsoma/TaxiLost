const API_URL = "https://taxilost-backend.onrender.com/auth";

export const loginUser = async ({ email, password, role }) => {
  const response = await fetch(`${API_URL}/login`, {
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
  const res = await fetch(`${API_URL}/register`, {
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

