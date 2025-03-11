import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Chip
} from '@mui/material';
import { useAuth } from '../utils/AuthContext';
import { getUserAppointments, cancelAppointment } from '../api/bookings';
import ServiceInfoTooltip from './ServiceInfoTooltip';

const formatDate = (dateString) => {
  if (!dateString) return 'Invalid Date';
  
  try {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  } catch (error) {
    console.error('Error formatting date:', error, dateString);
    return 'Invalid Date';
  }
};

// Helper function to map appointment data from backend format to frontend format
const mapAppointmentData = (appointment) => {
  // Check if the appointment is already in the correct format
  if (appointment.service && typeof appointment.service === 'string' && appointment.date && appointment.time) {
    return appointment;
  }
  
  // Extract service name from service object if it exists
  let serviceName = 'Unknown Service';
  if (appointment.service && typeof appointment.service === 'object') {
    serviceName = appointment.service.title || appointment.service.name || 'Unknown Service';
  } else if (appointment.serviceName) {
    serviceName = appointment.serviceName;
  } else if (appointment.ServiceName) {
    serviceName = appointment.ServiceName;
  }
  
  // Map from backend format (camelCase or PascalCase) to frontend format
  return {
    id: appointment.id || appointment.appointmentId || appointment.Id || appointment.AppointmentId,
    service: serviceName,
    date: appointment.appointmentDate || appointment.AppointmentDate || appointment.date || appointment.Date,
    time: appointment.appointmentTime || appointment.AppointmentTime || appointment.time || appointment.Time,
    status: appointment.status || appointment.Status || 'pending',
    serviceId: appointment.serviceId || appointment.ServiceId || (appointment.service && appointment.service.id),
    notes: appointment.notes || appointment.Notes || appointment.message || appointment.Message,
    // Only include non-object properties to avoid rendering issues
    // Don't spread the entire appointment object to avoid including complex nested objects
  };
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { currentUser } = useAuth();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchBookings = async () => {
    if (!currentUser || !currentUser.id) return;
    
    setLoading(true);
    setError('');
    try {
      console.log('Fetching bookings for user:', currentUser.id);
      const data = await getUserAppointments(currentUser.id);
      
      if (data && Array.isArray(data.appointments)) {
        console.log('Received appointments:', data.appointments);
        // Map each appointment to ensure correct format
        const mappedAppointments = data.appointments.map(mapAppointmentData);
        setBookings(mappedAppointments);
      } else if (data && Array.isArray(data)) {
        console.log('Received appointments array:', data);
        // Map each appointment to ensure correct format
        const mappedAppointments = data.map(mapAppointmentData);
        setBookings(mappedAppointments);
      } else {
        console.error('Unexpected data format:', data);
        setBookings([]);
        setError('Unexpected data format received from server');
      }
      
      // Check if we're in demo mode
      setIsDemoMode(data.isDemoMode || data.message?.includes('demo') || false);
      
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load your bookings. Please try again later.');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [currentUser]);

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const handleCancelDialogClose = () => {
    setCancelDialogOpen(false);
  };

  const handleCancelConfirm = async () => {
    if (!selectedBooking) return;
    
    setCancelLoading(true);
    try {
      await cancelAppointment(selectedBooking.id, currentUser.id);
      
      // Update the local state to reflect the cancellation
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === selectedBooking.id 
            ? { ...booking, status: 'cancelled' } 
            : booking
        )
      );
      
      setSnackbar({
        open: true,
        message: 'Appointment cancelled successfully',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      setSnackbar({
        open: true,
        message: 'Failed to cancel appointment. Please try again.',
        severity: 'error'
      });
    } finally {
      setCancelLoading(false);
      setCancelDialogOpen(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusChip = (status) => {
    let color = 'default';
    let label = status;
    
    switch (status?.toLowerCase()) {
      case 'confirmed':
        color = 'success';
        label = 'Confirmed';
        break;
      case 'pending':
        color = 'warning';
        label = 'Pending';
        break;
      case 'cancelled':
        color = 'error';
        label = 'Cancelled';
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
      />
    );
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Bookings
      </Typography>
      
      {isDemoMode && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Demo Mode:</strong> You're viewing sample bookings data.
          </Typography>
        </Alert>
      )}
      
      <Paper sx={{ p: 3, mb: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : bookings.length === 0 ? (
          <Alert severity="info">
            You don't have any bookings yet. 
            <Button 
              component="a" 
              href="/booking" 
              sx={{ ml: 2 }}
              variant="outlined"
              size="small"
            >
              Book Now
            </Button>
          </Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography variant="subtitle2">Service</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2">Date</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2">Time</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2">Status</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2">Actions</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking, index) => (
                  <TableRow key={booking.id || `booking-${booking.service}-${booking.date}-${booking.time}-${index}`}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {booking.service || 'Unknown Service'}
                        </Typography>
                        {booking.service && booking.service !== 'Unknown Service' && (
                          <ServiceInfoTooltip service={booking.service} />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{formatDate(booking.date)}</TableCell>
                    <TableCell>{booking.time || 'N/A'}</TableCell>
                    <TableCell>
                      {getStatusChip(booking.status)}
                    </TableCell>
                    <TableCell>
                      {booking.status?.toLowerCase() !== 'cancelled' && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleCancelClick(booking)}
                        >
                          Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={handleCancelDialogClose}
      >
        <DialogTitle>Cancel Appointment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this appointment? This action cannot be undone.
          </DialogContentText>
          {selectedBooking && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Service:</strong> {selectedBooking.service || 'Unknown Service'}
              </Typography>
              <Typography variant="body2">
                <strong>Date:</strong> {formatDate(selectedBooking.date)}
              </Typography>
              <Typography variant="body2">
                <strong>Time:</strong> {selectedBooking.time || 'N/A'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDialogClose} disabled={cancelLoading}>
            Keep Appointment
          </Button>
          <Button 
            onClick={handleCancelConfirm} 
            color="error" 
            disabled={cancelLoading}
            variant="contained"
          >
            {cancelLoading ? 'Cancelling...' : 'Yes, Cancel'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbar.message}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Bookings;
