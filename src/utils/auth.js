import { jwtDecode } from 'jwt-decode';

export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      
      logout();
      return null;
    }
    return { userId: decoded.userId, role: decoded.role };
  } catch (e) {
    logout();
    return null;
  }
};

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const getDriverFromToken = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded; 
  } catch {
    return null;
  }
};


export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  window.location.href = '/'; 
};


export const isAuthenticated = () => {
  return !!getToken();
};
