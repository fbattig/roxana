import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip
} from '@mui/material';
import { useAuth } from '../utils/AuthContext';
import { getUserServices } from '../api/auth';
import ServiceInfoTooltip from './ServiceInfoTooltip';

const UserServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  const fetchServices = async () => {
    if (!currentUser || !currentUser.id) return;
    
    setLoading(true);
    setError('');
    try {
      console.log('Fetching services for user:', currentUser.id);
      const data = await getUserServices(currentUser.id);
      
      if (data && Array.isArray(data.services)) {
        console.log('Received services:', data.services);
        setServices(data.services);
      } else if (data && Array.isArray(data)) {
        console.log('Received services array:', data);
        setServices(data);
      } else {
        console.error('Unexpected data format:', data);
        setServices([]);
        setError('Unexpected data format received from server');
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load your services. Please try again later.');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [currentUser]);

  const getStatusChip = (status) => {
    let color = 'default';
    let label = status;
    
    switch (status?.toLowerCase()) {
      case 'active':
        color = 'success';
        label = 'Active';
        break;
      case 'pending':
        color = 'warning';
        label = 'Pending';
        break;
      case 'expired':
        color = 'error';
        label = 'Expired';
        break;
      default:
        color = 'default';
        label = status || 'Unknown';
    }
    
    return (
      <Chip 
        label={label} 
        color={color} 
        size="small" 
        variant="outlined"
        sx={{ ml: 1 }}
      />
    );
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Services
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : services.length === 0 ? (
          <Alert severity="info">
            You don't have any services yet. 
            <Button 
              component="a" 
              href="/services" 
              sx={{ ml: 2 }}
              variant="outlined"
              size="small"
            >
              Browse Services
            </Button>
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {services.map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={service.imageUrl || '/placeholder-service.jpg'}
                    alt={service.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" component="div" noWrap>
                        {service.name}
                      </Typography>
                      {getStatusChip(service.status)}
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        mb: 2
                      }}
                    >
                      {service.description}
                    </Typography>
                    
                    {service.expiryDate && (
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        Expires: {new Date(service.expiryDate).toLocaleDateString()}
                      </Typography>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <ServiceInfoTooltip service={service} />
                      
                      <Button 
                        size="small" 
                        variant="outlined"
                        href={`/booking?service=${service.id}`}
                      >
                        Book Again
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default UserServices;
