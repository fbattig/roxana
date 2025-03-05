import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Paper, 
  Grid,
  TextField,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  Snackbar,
  Alert
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import BookingModal from './BookingModal';

// Consultation types with descriptions
const consultationTypes = [
  {
    id: 'tax-planning',
    title: 'Tax Planning',
    description: 'Strategic planning to minimize tax liability and maximize savings.',
    duration: '45 min',
    price: '$75'
  },
  {
    id: 'financial-review',
    title: 'Financial Review',
    description: 'Comprehensive review of your financial situation with actionable recommendations.',
    duration: '60 min',
    price: '$95'
  },
  {
    id: 'business-advisory',
    title: 'Business Advisory',
    description: 'Expert advice on business structure, growth strategies, and financial optimization.',
    duration: '60 min',
    price: '$125'
  },
  {
    id: 'retirement-planning',
    title: 'Retirement Planning',
    description: 'Personalized retirement planning strategies to secure your financial future.',
    duration: '60 min',
    price: '$95'
  },
  {
    id: 'new-client',
    title: 'New Client Consultation',
    description: 'Initial consultation for new clients to discuss needs and services.',
    duration: '30 min',
    price: 'Free'
  }
];

const ConsultationScheduler = () => {
  const [selectedConsultation, setSelectedConsultation] = useState('');
  const [consultationDetails, setConsultationDetails] = useState(null);
  const [openBookingModal, setOpenBookingModal] = useState(false);
  const [formError, setFormError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Handle consultation type selection
  const handleConsultationChange = (event) => {
    const selectedId = event.target.value;
    setSelectedConsultation(selectedId);
    
    if (selectedId) {
      const details = consultationTypes.find(type => type.id === selectedId);
      setConsultationDetails(details);
      setFormError('');
    } else {
      setConsultationDetails(null);
    }
  };

  // Handle schedule button click
  const handleScheduleClick = () => {
    if (!selectedConsultation) {
      setFormError('Please select a consultation type');
      return;
    }
    
    setOpenBookingModal(true);
  };

  // Handle booking modal close
  const handleCloseModal = () => {
    setOpenBookingModal(false);
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Box 
      id="consultation"
      sx={{ 
        py: { xs: 6, md: 8 },
        backgroundColor: '#fff'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={10} lg={8}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: { xs: 3, md: 5 },
                borderRadius: 2,
                background: 'linear-gradient(to right bottom, #ffffff, #f8fafc)'
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography 
                  variant="h4" 
                  component="h2" 
                  sx={{ 
                    fontWeight: 600,
                    color: 'primary.main',
                    mb: 2
                  }}
                >
                  Schedule a Consultation
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Book a personalized consultation with our tax experts to discuss your specific needs
                </Typography>
              </Box>

              <Box component="form" sx={{ mt: 3 }}>
                <FormControl fullWidth error={!!formError} sx={{ mb: 4 }}>
                  <InputLabel id="consultation-type-label">Consultation Type</InputLabel>
                  <Select
                    labelId="consultation-type-label"
                    id="consultation-type"
                    value={selectedConsultation}
                    label="Consultation Type"
                    onChange={handleConsultationChange}
                  >
                    <MenuItem value="">
                      <em>Select a consultation type</em>
                    </MenuItem>
                    {consultationTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.title} ({type.duration} - {type.price})
                      </MenuItem>
                    ))}
                  </Select>
                  {formError && <FormHelperText>{formError}</FormHelperText>}
                </FormControl>

                {consultationDetails && (
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 3, 
                      mb: 4,
                      borderColor: 'primary.light',
                      backgroundColor: 'rgba(26, 35, 126, 0.03)'
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {consultationDetails.title}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {consultationDetails.description}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Duration:</strong> {consultationDetails.duration}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Price:</strong> {consultationDetails.price}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleScheduleClick}
                    startIcon={<EventIcon />}
                    sx={{ 
                      py: 1.5,
                      px: 4,
                      borderRadius: 2,
                      fontSize: '1rem'
                    }}
                  >
                    Schedule Consultation
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Booking Modal */}
      {openBookingModal && consultationDetails && (
        <BookingModal
          open={openBookingModal}
          onClose={handleCloseModal}
          service={{
            id: consultationDetails.id,
            title: consultationDetails.title,
            price: consultationDetails.price,
            time: consultationDetails.duration
          }}
        />
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ConsultationScheduler;
