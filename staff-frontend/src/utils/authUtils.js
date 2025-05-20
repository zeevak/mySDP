// utils/authUtils.js
import axios from 'axios';

/**
 * Check if the user is authenticated
 * @returns {boolean} True if the user has a valid token
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Get the authentication token
 * @returns {string|null} The authentication token or null if not authenticated
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get the user's role
 * @returns {string|null} The user's role or null if not authenticated
 */
export const getUserRole = () => {
  return localStorage.getItem('role');
};

/**
 * Get the authenticated user
 * @returns {Object|null} The authenticated user or null if not authenticated
 */
export const getUser = () => {
  const userString = localStorage.getItem('user');
  if (!userString) return null;
  
  try {
    return JSON.parse(userString);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Set up axios with authentication headers
 * @returns {Object} Axios instance with authentication headers
 */
export const getAuthAxios = () => {
  const token = getToken();
  
  return axios.create({
    baseURL: 'http://localhost:5001',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });
};

/**
 * Log out the user
 * @param {Function} navigate - React Router's navigate function
 */
export const logout = (navigate) => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
  localStorage.removeItem('username');
  
  if (navigate) {
    navigate('/');
  }
};
