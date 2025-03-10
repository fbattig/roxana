import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../utils/AuthContext';

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Account = () => {
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const { register, login, loading, error, currentUser, logout } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: ''
  });
  const [success, setSuccess] = useState('');

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSuccess('');
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Toggle password visibility
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Handle registration form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setSuccess('');
    
    try {
      await register(formData);
      setSuccess('Account created successfully! You are now logged in.');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: ''
      });
    } catch (err) {
      // Error is handled by the auth context
      console.error('Registration error:', err);
    }
  };

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setSuccess('');
    
    try {
      console.log('Attempting to log in with:', {
        email: formData.email,
        password: formData.password ? '********' : 'empty'
      });
      
      const result = await login({
        email: formData.email,
        password: formData.password
      });
      
      console.log('Login result:', result);
      setSuccess('Login successful!');
    } catch (err) {
      // Error is handled by the auth context
      console.error('Login error in Account component:', err);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setSuccess('You have been logged out successfully.');
  };

  // If user is logged in, show user profile
  if (currentUser) {
    console.log('Current user in Account component:', currentUser);
    
    return (
      <Container maxWidth="md" id="account">
        <Box sx={{ py: 8 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              My Account
            </Typography>
            
            <Box sx={{ mt: 4 }}>
              {currentUser.firstName && currentUser.lastName ? (
                <Typography variant="h6" gutterBottom>
                  Welcome, {currentUser.firstName} {currentUser.lastName}!
                </Typography>
              ) : (
                <Typography variant="h6" gutterBottom>
                  Welcome!
                </Typography>
              )}
              
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <strong>Name:</strong> {currentUser.firstName || ''} {currentUser.lastName || ''}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <strong>Email:</strong> {currentUser.email}
                  </Typography>
                </Grid>
                {currentUser.phone && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <strong>Phone:</strong> {currentUser.phone}
                    </Typography>
                  </Grid>
                )}
              </Grid>
              
              {success && (
                <Alert severity="success" sx={{ mt: 3 }}>
                  {success}
                </Alert>
              )}
              
              <Box sx={{ mt: 4 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleLogout}
                  sx={{ borderRadius: 2 }}
                >
                  LOGOUT
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  // Show loading indicator while authentication state is being determined
  if (loading) {
    return (
      <Container maxWidth="md" id="account">
        <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" id="account">
      <Box sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
            Create Account
          </Typography>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="auth tabs">
              <Tab label="Register" id="auth-tab-0" />
              <Tab label="Login" id="auth-tab-1" />
            </Tabs>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mt: 3 }}>
              {success}
            </Alert>
          )}
          
          <TabPanel value={tabValue} index={0}>
            <form onSubmit={handleRegister}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleTogglePassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone (optional)"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled={loading}
                    sx={{ 
                      mt: 2, 
                      py: 1.5, 
                      borderRadius: 2,
                      position: 'relative'
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <form onSubmit={handleLogin}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleTogglePassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled={loading}
                    sx={{ 
                      mt: 2, 
                      py: 1.5, 
                      borderRadius: 2,
                      position: 'relative'
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Login'
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </TabPanel>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              By creating an account, you may receive newsletters or promotions.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Account;
