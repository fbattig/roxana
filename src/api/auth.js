/**
 * Authentication API functions
 */

import { API_URL } from './config.js';

// Key for storing user in localStorage
const USER_STORAGE_KEY = 'rr_tax_user';

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
    // Format data for ASP.NET Core backend
    const formattedData = {
      FirstName: userData.firstName,
      LastName: userData.lastName,
      Email: userData.email,
      Password: userData.password,
      Phone: userData.phone || ''
    };

    console.log('Registering user with data:', formattedData);

    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
      credentials: 'include'
    });

    // Try to parse the response as JSON
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('Registration response data:', data);
    } else {
      const text = await response.text();
      console.log('Registration response text:', text);
      data = { message: text };
    }
    
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Registration failed');
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
    // Format data for ASP.NET Core backend
    const formattedData = {
      Email: credentials.email,
      Password: credentials.password
    };

    console.log('Logging in with credentials:', formattedData);
    console.log('API URL:', `${API_URL}/users/login`);

    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
      credentials: 'include'
    });

    console.log('Login response status:', response.status);
    console.log('Login response headers:', Object.fromEntries([...response.headers.entries()]));

    // Try to parse the response as JSON
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('Login response data:', data);
    } else {
      const text = await response.text();
      console.log('Login response text:', text);
      data = { message: text };
    }
    
    if (!response.ok) {
      throw new Error(data.error || data.message || `Login failed with status: ${response.status}`);
    }

    // Check if the response contains user data directly
    // The server appears to return user data directly in the response object
    // with properties like firstName, lastName, email, etc.
    const userData = {
      id: data.id || 1,
      firstName: data.firstName || 'Demo',
      lastName: data.lastName || 'User',
      email: credentials.email,
      createdAt: data.createdAt || new Date().toISOString()
    };
    
    // Add the user property to the response for consistency
    data.user = userData;

    // Store user data in localStorage
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));

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
  localStorage.removeItem(USER_STORAGE_KEY);
};

/**
 * Get the current logged in user
 * @returns {Object|null} - Current user or null if not logged in
 */
export const getCurrentUser = () => {
  try {
    const userJson = localStorage.getItem(USER_STORAGE_KEY);
    if (!userJson) return null;
    
    return JSON.parse(userJson);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Get user's services
 * @param {number} userId - User ID
 * @returns {Promise<Object>} - Response from the server with services data
 */
export const getUserServices = async (userId) => {
  try {
    console.log(`Fetching services for user ${userId} from ${API_URL}/users/${userId}/services`);
    
    const response = await fetch(`${API_URL}/users/${userId}/services`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include' // Include cookies for authentication
    });
    
    console.log('Services response status:', response.status);
    
    // Try to parse the response as JSON
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('Services response data:', data);
    } else {
      const text = await response.text();
      console.log('Services response text:', text);
      throw new Error('Invalid response format');
    }
    
    if (!response.ok) {
      throw new Error(data.error || data.message || `Failed to fetch services (Status: ${response.status})`);
    }
    
    return data;
  } catch (error) {
    console.error('Fetch services error:', error);
    throw error;
  }
};

/**
 * Get user's appointments directly from the UsersController
 * @param {number} userId - User ID
 * @returns {Promise<Object>} - Response from the server with appointments data
 */
export const getUserAppointmentsFromUser = async (userId) => {
  try {
    console.log(`Fetching appointments for user ${userId} from ${API_URL}/users/${userId}/appointments`);
    
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
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('Appointments response data:', data);
      
      // Process the data to ensure it's in the expected format
      if (data && Array.isArray(data)) {
        // If the response is an array, it's likely the appointments array directly
        // Process each appointment to extract service information
        const processedAppointments = data.map(appointment => {
          // If service is an object, extract the name/title
          if (appointment.service && typeof appointment.service === 'object') {
            return {
              ...appointment,
              serviceName: appointment.service.title || appointment.service.name || 'Unknown Service',
              serviceId: appointment.service.id
            };
          }
          return appointment;
        });
        
        return {
          success: true,
          appointments: processedAppointments
        };
      } else if (data && data.appointments && Array.isArray(data.appointments)) {
        // If the response has an appointments property that's an array
        // Process each appointment to extract service information
        const processedAppointments = data.appointments.map(appointment => {
          // If service is an object, extract the name/title
          if (appointment.service && typeof appointment.service === 'object') {
            return {
              ...appointment,
              serviceName: appointment.service.title || appointment.service.name || 'Unknown Service',
              serviceId: appointment.service.id
            };
          }
          return appointment;
        });
        
        return {
          success: true,
          appointments: processedAppointments,
          message: data.message
        };
      } else if (data && data.data && Array.isArray(data.data)) {
        // Some APIs nest the data under a 'data' property
        // Process each appointment to extract service information
        const processedAppointments = data.data.map(appointment => {
          // If service is an object, extract the name/title
          if (appointment.service && typeof appointment.service === 'object') {
            return {
              ...appointment,
              serviceName: appointment.service.title || appointment.service.name || 'Unknown Service',
              serviceId: appointment.service.id
            };
          }
          return appointment;
        });
        
        return {
          success: true,
          appointments: processedAppointments,
          message: data.message
        };
      } else if (data && typeof data === 'object') {
        // If it's an object but not in the expected format, try to extract appointments
        const possibleAppointments = Object.values(data).find(val => Array.isArray(val));
        if (possibleAppointments) {
          // Process each appointment to extract service information
          const processedAppointments = possibleAppointments.map(appointment => {
            // If service is an object, extract the name/title
            if (appointment.service && typeof appointment.service === 'object') {
              return {
                ...appointment,
                serviceName: appointment.service.title || appointment.service.name || 'Unknown Service',
                serviceId: appointment.service.id
              };
            }
            return appointment;
          });
          
          return {
            success: true,
            appointments: processedAppointments,
            message: 'Appointments extracted from response'
          };
        }
      }
      
      // If we couldn't identify the appointments array, return the data as is
      return data;
    } else {
      const text = await response.text();
      console.log('Appointments response text:', text);
      throw new Error('Invalid response format');
    }
    
    if (!response.ok) {
      throw new Error(data.error || data.message || `Failed to fetch appointments (Status: ${response.status})`);
    }
    
    return data;
  } catch (error) {
    console.error('Fetch appointments error:', error);
    throw error;
  }
};