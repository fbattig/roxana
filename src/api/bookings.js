/**
 * Bookings API functions
 */

import { API_URL } from './config.js';

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

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch appointments');
    }

    return {
      success: true,
      appointments: data.appointments || []
    };
  } catch (error) {
    console.error('Fetch appointments error:', error);
    throw error;
  }
};

/**
 * Cancel an appointment
 * @param {number} appointmentId - Appointment ID to cancel
 * @param {number} userId - User ID who owns the appointment
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

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to cancel appointment');
    }

    return {
      success: true,
      message: data.message || 'Appointment cancelled successfully'
    };
  } catch (error) {
    console.error('Cancel appointment error:', error);
    throw error;
  }
};