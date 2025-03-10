/**
 * Bookings API functions
 */

import { API_URL } from './config.js';
import { getAllAppointments } from './appointmentApi.js';

/**
 * Get user's appointments
 * @param {number} userId - User ID
 * @returns {Promise<Object>} - Response from the server with appointments data
 */
export const getUserAppointments = async (userId) => {
  try {
    console.log(`Fetching appointments for user ${userId} from ${API_URL}/users/${userId}/appointments`);
    
    // Try to fetch from server
    let serverAppointments = [];
    let serverError = null;
    
    try {
      const response = await fetch(`${API_URL}/users/${userId}/appointments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include' // Include cookies for authentication
      });
      
      console.log('Appointments response status:', response.status);
      
      // Try to parse the response as JSON
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('Appointments response data:', data);
          serverAppointments = data.appointments || data || [];
        } else {
          const text = await response.text();
          console.log('Appointments response text:', text);
          serverError = 'Invalid response format';
        }
      } else {
        serverError = `Failed to fetch appointments (Status: ${response.status})`;
        console.warn(serverError);
      }
    } catch (err) {
      console.error('Server request failed:', err);
      serverError = err.message;
    }
    
    // If server request failed or returned no appointments, use local storage for demo purposes
    if (serverError || serverAppointments.length === 0) {
      console.log('Using local storage for appointments (demo mode)');
      
      // Get all appointments from local storage
      const allAppointments = getAllAppointments();
      
      // Filter appointments for the current user
      const userAppointments = allAppointments.filter(
        appointment => appointment.userId === userId || appointment.userId === undefined
      );
      
      return {
        success: true,
        appointments: userAppointments,
        message: serverError ? `Using local data (${serverError})` : 'Using local data (no server appointments found)'
      };
    }
    
    return {
      success: true,
      appointments: serverAppointments
    };
  } catch (error) {
    console.error('Fetch appointments error:', error);
    
    // Fallback to local storage for demo purposes
    console.log('Error occurred, falling back to local storage for demo purposes');
    
    // Get all appointments from local storage
    const allAppointments = getAllAppointments();
    
    // Filter appointments for the current user
    const userAppointments = allAppointments.filter(
      appointment => appointment.userId === userId || appointment.userId === undefined
    );
    
    return {
      success: true,
      appointments: userAppointments,
      message: 'Using local data due to error'
    };
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
    console.log(`Cancelling appointment ${appointmentId} for user ${userId}`);
    
    // Try to cancel on server
    let serverSuccess = false;
    let serverError = null;
    
    try {
      const response = await fetch(`${API_URL}/appointments/${appointmentId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          UserId: userId 
        }),
        credentials: 'include' // Include cookies for authentication
      });
      
      console.log('Cancel response status:', response.status);
      
      // Try to parse the response as JSON
      let data;
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
          console.log('Cancel response data:', data);
        } else {
          const text = await response.text();
          console.log('Cancel response text:', text);
          data = { message: text };
        }
        serverSuccess = true;
      } else {
        serverError = `Failed to cancel appointment (Status: ${response.status})`;
        console.warn(serverError);
      }
    } catch (err) {
      console.error('Server request failed:', err);
      serverError = err.message;
    }
    
    // For demo purposes, also update local storage
    try {
      // Get all appointments
      const allAppointments = getAllAppointments();
      
      // Find and update the appointment
      const appointmentIndex = allAppointments.findIndex(a => a.id === appointmentId);
      
      if (appointmentIndex !== -1) {
        allAppointments[appointmentIndex].status = 'cancelled';
        localStorage.setItem('rr_tax_appointments', JSON.stringify(allAppointments));
        console.log('Updated appointment in local storage');
      }
    } catch (err) {
      console.error('Error updating local storage:', err);
    }
    
    return {
      success: true,
      message: serverError 
        ? `Warning: Server error (${serverError}), but appointment cancelled locally for demo purposes.` 
        : 'Appointment cancelled successfully!',
      serverSuccess
    };
  } catch (error) {
    console.error('Cancel appointment error:', error);
    throw error;
  }
};