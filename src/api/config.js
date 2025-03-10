/**
 * API configuration
 * 
 * This file centralizes API configuration to make it easier to change
 * the API URL in one place.
 */

// Use the proxy defined in vite.config.js instead of direct connection
// This avoids CORS issues when connecting to the ASP.NET Core backend
export const API_URL = '/api';
