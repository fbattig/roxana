import { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, loginUser, logoutUser, registerUser } from '../api/auth';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from local storage on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = getCurrentUser();
        console.log('Loaded user from localStorage:', user);
        setCurrentUser(user);
      } catch (err) {
        console.error('Error loading user data:', err);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await registerUser(userData);
      // After registration, we can automatically log the user in
      const loginResponse = await loginUser({
        email: userData.email,
        password: userData.password
      });
      console.log('Login response after registration:', loginResponse);
      setCurrentUser(loginResponse.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login a user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginUser(credentials);
      console.log('Login response:', response);
      setCurrentUser(response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout the current user
  const logout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  // Value to be provided by the context
  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
