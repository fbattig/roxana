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
    const response = await fetch(`${API_URL}/users/${userId}/appointments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch appointments');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

/**
 * Cancel an appointment
 * @param {number} appointmentId - Appointment ID to cancel
 * @param {number} userId - User ID
 * @returns {Promise<Object>} - Response from the server
 */
export const cancelAppointment = async (appointmentId, userId) => {
  try {
    const response = await fetch(`${API_URL}/appointments/${appointmentId}/cancel`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to cancel appointment');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    throw error;
  }
};
