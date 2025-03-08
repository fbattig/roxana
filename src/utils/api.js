/**
 * API utility functions for communicating with the backend server
 */

const API_BASE_URL = 'http://localhost:3004/api';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.firstName - User's first name
 * @param {string} userData.lastName - User's last name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @returns {Promise} - Promise resolving to the registration response
 */
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
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
 * @returns {Promise} - Promise resolving to the login response with user data
 */
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Get all appointments for a user
 * @param {number} userId - The user ID
 * @returns {Promise} - Promise resolving to the appointments data
 */
export const getUserAppointments = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/appointments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch appointments');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

/**
 * Cancel an appointment
 * @param {number} appointmentId - The appointment ID to cancel
 * @param {number} userId - The user ID who owns the appointment
 * @returns {Promise} - Promise resolving to the cancellation response
 */
export const cancelAppointment = async (appointmentId, userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/cancel`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to cancel appointment');
    }
    
    return data;
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    throw error;
  }
};

/**
 * Create a new appointment
 * @param {Object} appointmentData - The appointment data
 * @param {number} appointmentData.userId - User ID
 * @param {number} appointmentData.serviceId - Service ID
 * @param {string} appointmentData.appointmentDate - Date of appointment (YYYY-MM-DD)
 * @param {string} appointmentData.appointmentTime - Time of appointment (HH:MM)
 * @param {string} [appointmentData.notes] - Optional notes for the appointment
 * @returns {Promise} - Promise resolving to the creation response
 */
export const createAppointment = async (appointmentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create appointment');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

/**
 * Get all services
 * @returns {Promise} - Promise resolving to the services data
 */
export const getServices = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch services');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};
