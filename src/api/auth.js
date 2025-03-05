/**
 * Authentication API functions
 */

const API_URL = 'http://localhost:3001/api';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.firstName - User's first name
 * @param {string} userData.lastName - User's last name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @param {string} [userData.phone] - User's phone number (optional)
 * @returns {Promise<Object>} - Response from the server
 */
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Login a user
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.email - User's email
 * @param {string} credentials.password - User's password
 * @returns {Promise<Object>} - Response from the server with user data
 */
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    // Store user in local storage
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Logout the current user
 */
export const logoutUser = () => {
  localStorage.removeItem('user');
};

/**
 * Get the current logged in user
 * @returns {Object|null} - Current user or null if not logged in
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};
