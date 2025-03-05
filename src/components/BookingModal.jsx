import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Box, 
  Grid, 
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { format, addDays, isWeekend } from 'date-fns';
import { getAvailableTimeSlots, createAppointment } from '../api/appointmentApi';

const BookingModal = ({ open, onClose, service }) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Disable weekends
  const shouldDisableDate = (date) => {
    return isWeekend(date);
  };

  // Handle date selection
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setLoading(true);
    
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    // Get available time slots for selected date
    getAvailableTimeSlots(formattedDate).then((slots) => {
      setAvailableTimeSlots(slots);
      setLoading(false);
    });
  };

  // Handle time selection
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!selectedDate) {
      newErrors.date = 'Please select a date';
    }
    
    if (!selectedTime) {
      newErrors.time = 'Please select a time';
    } else {
      // Check if the selected time is still available
      const isTimeAvailable = availableTimeSlots.find(
        slot => slot.time === selectedTime && slot.available
      );
      
      if (!isTimeAvailable) {
        newErrors.time = 'This time slot is no longer available. Please select another time.';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (step === 1 && selectedDate && selectedTime) {
      setStep(2);
    } else if (step === 2) {
      if (validateForm()) {
        handleBookAppointment();
      }
    }
  };

  // Handle back step
  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  // Handle booking submission
  const handleBookAppointment = () => {
    setLoading(true);
    
    const appointmentData = {
      serviceId: service.id,
      serviceTitle: service.title,
      clientName: formData.name,
      clientEmail: formData.email,
      clientPhone: formData.phone,
      appointmentDate: format(selectedDate, 'yyyy-MM-dd'),
      appointmentTime: selectedTime
    };
    
    createAppointment(appointmentData).then(() => {
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Appointment booked successfully!',
        severity: 'success'
      });
      // Reset form and close modal after a delay
      setTimeout(() => {
        handleCloseModal();
      }, 2000);
    });
  };

  // Handle modal close
  const handleCloseModal = () => {
    setStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
    setFormData({
      name: '',
      email: '',
      phone: ''
    });
    setErrors({});
    onClose();
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleCloseModal}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #eee', pb: 2, pt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box component="h5" variant="h5" fontWeight="bold" sx={{ fontSize: '24px', mb: 1 }}>
                Book Appointment: {service?.title}
              </Box>
              <Box component="p" variant="subtitle1" color="text.secondary">
                {service?.price} • {service?.time}
              </Box>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ py: 3, minHeight: '500px' }}>
          {loading && step === 3 ? (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="300px">
              <CircularProgress size={60} />
              <Box component="h6" variant="h6" sx={{ mt: 2 }}>
                Booking your appointment...
              </Box>
            </Box>
          ) : step === 3 ? (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="300px">
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Box component="h5" variant="h5" gutterBottom>
                  Appointment Confirmed!
                </Box>
                <Box component="p" variant="body1">
                  Your appointment has been successfully booked. We'll send a confirmation to your email.
                </Box>
              </Box>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleCloseModal}
                sx={{ mt: 2 }}
              >
                Close
              </Button>
            </Box>
          ) : step === 1 ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box component="h6" variant="h6" gutterBottom>
                    Select a Date
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      onClick={() => {
                        const yearSelector = document.querySelector('.MuiPickersCalendarHeader-switchViewButton');
                        if (yearSelector) yearSelector.click();
                      }}
                      startIcon={<span role="img" aria-label="calendar">📅</span>}
                    >
                      Change Year/Month
                    </Button>
                  </Box>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateCalendar 
                      value={selectedDate}
                      onChange={handleDateChange}
                      shouldDisableDate={shouldDisableDate}
                      minDate={new Date()}
                      maxDate={addDays(new Date(), 365)}
                      views={['day', 'month', 'year']}
                      openTo="day"
                      disablePast={true}
                      showDaysOutsideCurrentMonth={true}
                      sx={{
                        width: '100%',
                        '& .MuiPickersCalendarHeader-root': {
                          paddingLeft: '24px',
                          paddingRight: '24px',
                          marginTop: '8px'
                        },
                        '& .MuiDayCalendar-header, & .MuiDayCalendar-weekContainer': {
                          justifyContent: 'space-around',
                          margin: '0 16px'
                        },
                        '& .MuiPickersDay-root': {
                          width: '40px',
                          height: '40px',
                          fontSize: '16px',
                          margin: '4px'
                        },
                        '& .MuiPickersDay-today': {
                          border: '2px solid #1a237e'
                        },
                        '& .Mui-selected': {
                          backgroundColor: '#1a237e !important'
                        },
                        '& .MuiPickersYear-yearButton': {
                          fontSize: '1rem',
                          padding: '8px 16px'
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={5}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box component="h6" variant="h6" gutterBottom>
                    Select a Time
                  </Box>
                  {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                      <CircularProgress />
                    </Box>
                  ) : selectedDate ? (
                    availableTimeSlots.length > 0 ? (
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                        gap: '12px',
                        mt: 2
                      }}>
                        {availableTimeSlots.map((slot) => (
                          <Button
                            key={slot.time}
                            variant={selectedTime === slot.time ? "contained" : "outlined"}
                            color={slot.available ? "primary" : "error"}
                            onClick={() => slot.available && handleTimeSelect(slot.time)}
                            disabled={!slot.available}
                            sx={{ 
                              height: '48px',
                              fontSize: '16px',
                              opacity: slot.available ? 1 : 0.7,
                              position: 'relative',
                              '&::after': !slot.available ? {
                                content: '"Booked"',
                                position: 'absolute',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                bottom: '4px',
                                left: '50%',
                                transform: 'translateX(-50%)'
                              } : {}
                            }}
                          >
                            {slot.time}
                          </Button>
                        ))}
                      </Box>
                    ) : (
                      <Box component="p" variant="body1" color="error">
                        No available time slots for this date. Please select another date.
                      </Box>
                    )
                  ) : (
                    <Box component="p" variant="body1" color="text.secondary">
                      Please select a date first.
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box component="h6" variant="h6" gutterBottom>
                    Your Information
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box component="h6" variant="h6" gutterBottom>
                      Appointment Summary
                    </Box>
                    <Box component="p" variant="body2">
                      <strong>Service:</strong> {service?.title}
                    </Box>
                    <Box component="p" variant="body2">
                      <strong>Date:</strong> {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}
                    </Box>
                    <Box component="p" variant="body2">
                      <strong>Time:</strong> {selectedTime}
                    </Box>
                    <Box component="p" variant="body2">
                      <strong>Duration:</strong> {service?.time}
                    </Box>
                    <Box component="p" variant="body2">
                      <strong>Price:</strong> {service?.price}
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #eee' }}>
          {step === 1 ? (
            <>
              <Button onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleNext}
                disabled={!selectedDate || !selectedTime || loading}
              >
                Next
              </Button>
            </>
          ) : step === 2 ? (
            <>
              <Button onClick={handleBack} disabled={loading}>
                Back
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Book Appointment'}
              </Button>
            </>
          ) : (
            <></>
          )}
        </DialogActions>
      </Dialog>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default BookingModal;
