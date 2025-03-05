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
  Snackbar
} from '@mui/material';
import { useAuth } from '../utils/AuthContext';
import { getUserAppointments, cancelAppointment } from '../api/bookings';
import ServiceInfoTooltip from './ServiceInfoTooltip';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
      
      console.log('Bookings response:', data);
      
      if (data.success) {
        setBookings(data.appointments);
        console.log('Bookings set:', data.appointments.length);
      } else {
        setError(data.message || 'Failed to fetch bookings');
        console.error('Failed to fetch bookings:', data.message);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchBookings();
    } else {
      setLoading(false);
      setBookings([]);
    }
  }, [currentUser]);

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedBooking) return;
    
    setCancelLoading(true);
    try {
      const data = await cancelAppointment(selectedBooking.id, currentUser.id);
      
      if (data.success) {
        setSnackbar({
          open: true,
          message: 'Appointment cancelled successfully',
          severity: 'success'
        });
        
        // Update the booking status in the list
        setBookings(bookings.map(booking => 
          booking.id === selectedBooking.id 
            ? { ...booking, status: 'cancelled' } 
            : booking
        ));
      } else {
        setSnackbar({
          open: true,
          message: data.message || 'Failed to cancel appointment',
          severity: 'error'
        });
      }
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      setSnackbar({
        open: true,
        message: 'Failed to connect to the server. Please try again later.',
        severity: 'error'
      });
    } finally {
      setCancelLoading(false);
      setCancelDialogOpen(false);
    }
  };

  const handleCancelDialogClose = () => {
    setCancelDialogOpen(false);
    setSelectedBooking(null);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success.main';
      case 'pending':
        return 'warning.main';
      case 'cancelled':
        return 'error.main';
      default:
        return 'text.primary';
    }
  };

  if (!currentUser) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
            My Bookings
          </Typography>
          <Alert severity="info" sx={{ mt: 3 }}>
            Please sign in to view your bookings.
          </Alert>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
          My Bookings
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={fetchBookings}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            disabled={loading}
          >
            Refresh Bookings
          </Button>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        ) : bookings.length === 0 ? (
          <Alert severity="info" sx={{ mt: 3 }}>
            You don't have any bookings yet.
          </Alert>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Service</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <ServiceInfoTooltip serviceTitle={booking.service_title}>
                        {booking.service_title}
                      </ServiceInfoTooltip>
                    </TableCell>
                    <TableCell>{formatDate(booking.appointment_date)}</TableCell>
                    <TableCell>{booking.appointment_time}</TableCell>
                    <TableCell>
                      <Typography sx={{ color: getStatusColor(booking.status), fontWeight: 500 }}>
                        {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Unknown'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {booking.status !== 'cancelled' && (
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
                <strong>Service:</strong> {selectedBooking.service_title}
              </Typography>
              <Typography variant="body2">
                <strong>Date:</strong> {formatDate(selectedBooking.appointment_date)}
              </Typography>
              <Typography variant="body2">
                <strong>Time:</strong> {selectedBooking.appointment_time}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDialogClose} disabled={cancelLoading}>
            No, Keep It
          </Button>
          <Button 
            onClick={handleCancelConfirm} 
            color="error" 
            disabled={cancelLoading}
            startIcon={cancelLoading ? <CircularProgress size={20} /> : null}
          >
            Yes, Cancel Appointment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbar.message}
      />
    </Container>
  );
};

export default Bookings;
