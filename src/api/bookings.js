/**
 * Bookings API functions
 */

import { API_URL } from './config.js';
import { getAllAppointments } from './appointmentApi.js';
import { getUserAppointmentsFromUser } from './auth.js';

// Flag to indicate if we're in demo mode (no server)
// Set to true by default since the backend server is not available
let isDemoMode = true;

/**
 * Get user's appointments
 * @param {number} userId - User ID
 * @returns {Promise<Object>} - Response from the server with appointments data
 */
export const getUserAppointments = async (userId) => {
  try {
    // If we already know we're in demo mode, skip server request
    if (isDemoMode) {
      console.log('Using local storage for appointments (demo mode)');
      return getLocalAppointments(userId);
    }
    
    console.log(`Fetching appointments for user ${userId}`);
    
    // Try to fetch from server using the new UsersController endpoint
    let serverAppointments = [];
    let serverError = null;
    
    try {
      // Use the new function from auth.js that calls the UsersController endpoint
      const data = await getUserAppointmentsFromUser(userId);
      
      // Check if the response contains appointments
      if (data && (data.appointments || Array.isArray(data))) {
        serverAppointments = data.appointments || data;
        console.log('Received appointments from server:', serverAppointments);
        
        return {
          success: true,
          appointments: serverAppointments
        };
      } else {
        serverError = 'No appointments data found in response';
        console.warn(serverError);
      }
    } catch (err) {
      console.error('Server request failed:', err);
      serverError = err.message;
      
      // If we get a connection error, timeout, or other network error, set demo mode flag for future requests
      if (err.message === 'Server request timed out' || 
          err.message === 'Server is unavailable' ||
          err.message.includes('NetworkError') ||
          err.message.includes('Failed to fetch') ||
          err.message.includes('Network request failed') ||
          err.name === 'TypeError' ||
          err.name === 'AbortError') {
        console.log('Network error detected, switching to demo mode');
        isDemoMode = true;
      }
    }
    
    // If server request failed or returned no appointments, use local storage for demo purposes
    if (serverError || serverAppointments.length === 0) {
      return getLocalAppointments(userId, serverError);
    }
    
    return {
      success: true,
      appointments: serverAppointments
    };
  } catch (error) {
    console.error('Fetch appointments error:', error);
    
    // Fallback to local storage for demo purposes
    console.log('Error occurred, falling back to local storage for demo purposes');
    
    // Set demo mode flag for future requests
    isDemoMode = true;
    
    return getLocalAppointments(userId, error.message);
  }
};

/**
 * Get appointments from local storage (for demo mode)
 * @param {number} userId - User ID
 * @param {string} errorMessage - Optional error message to include
 * @returns {Object} - Response with appointments data from local storage
 */
const getLocalAppointments = (userId, errorMessage = null) => {
  // Get all appointments from local storage
  const allAppointments = getAllAppointments();
  
  // Filter appointments for the current user
  const userAppointments = allAppointments.filter(
    appointment => appointment.userId === userId || appointment.userId === undefined
  );
  
  return {
    success: true,
    appointments: userAppointments,
    message: errorMessage 
      ? `Using local data (${errorMessage})` 
      : 'Using local data (demo mode)'
  };
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
    
    // If we're in demo mode, skip server request
    if (isDemoMode) {
      return cancelLocalAppointment(appointmentId);
    }
    
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
        
        // If we get a 404, set demo mode flag for future requests
        if (response.status === 404) {
          isDemoMode = true;
        }
      }
    } catch (err) {
      console.error('Server request failed:', err);
      serverError = err.message;
      // Set demo mode flag for future requests
      isDemoMode = true;
    }
    
    // Update local storage regardless of server response
    const localResult = cancelLocalAppointment(appointmentId);
    
    return {
      success: true,
      message: serverError 
        ? `Warning: Server error (${serverError}), but appointment cancelled locally for demo purposes.` 
        : 'Appointment cancelled successfully!',
      serverSuccess
    };
  } catch (error) {
    console.error('Cancel appointment error:', error);
    
    // Set demo mode flag for future requests
    isDemoMode = true;
    
    // Try to cancel locally anyway
    cancelLocalAppointment(appointmentId);
    
    return {
      success: true,
      message: 'Appointment cancelled locally (demo mode)',
      serverSuccess: false
    };
  }
};

/**
 * Cancel an appointment in local storage (for demo mode)
 * @param {number} appointmentId - Appointment ID to cancel
 * @returns {Object} - Result of the operation
 */
const cancelLocalAppointment = (appointmentId) => {
  // Get all appointments
  const allAppointments = getAllAppointments();
  
  // Find the appointment to cancel
  const updatedAppointments = allAppointments.map(appointment => {
    if (appointment.id === appointmentId) {
      return { ...appointment, status: 'cancelled' };
    }
    return appointment;
  });
  
  // Save the updated appointments
  localStorage.setItem('rr_tax_appointments', JSON.stringify(updatedAppointments));
  
  return {
    success: true,
    message: 'Appointment cancelled in local storage'
  };
};