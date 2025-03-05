/**
 * Bookings API functions
 */

const API_URL = 'http://localhost:3001/api';

/**
 * Get user's appointments
 * @param {number} userId - User ID
 * @returns {Promise<Object>} - Response from the server with appointments data
 */
export const getUserAppointments = async (userId) => {
  try {
    const response = await fetch(${API_URL}/users//appointments, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch appointments');
    }
    
    return data;
  } catch (error) {
    console.error('Fetch appointments error:', error);
    throw error;
  }
};

/**
 * Cancel an appointment
 * @param {number} appointmentId - Appointment ID to cancel
 * @returns {Promise<Object>} - Response from the server
 */
export const cancelAppointment = async (appointmentId) => {
  try {
    const response = await fetch(${API_URL}/appointments//cancel, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to cancel appointment');
    }
    
    return data;
  } catch (error) {
    console.error('Cancel appointment error:', error);
    throw error;
  }
};
