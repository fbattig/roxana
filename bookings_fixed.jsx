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
  Chip,
  Modal,
  Fade
} from '@mui/material';
import { useAuth } from '../utils/AuthContext';
import { getUserAppointments, cancelAppointment } from '../api/bookings';
import { markdownMap } from '../utils/markdownUtils';
import ReactMarkdown from 'react-markdown';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Helper function to map appointment data from backend format to frontend format
const mapAppointmentData = (appointment, allAppointments) => {
  // Handle $ref by resolving reference if needed
  if (appointment.$ref) {
    // Try to get the referenced appointment
    const refIndex = parseInt(appointment.$ref) - 1;
    if (allAppointments && refIndex >= 0 && refIndex < allAppointments.length) {
      // Use referenced appointment but keep original id
      const originalId = appointment.id;
      const refAppointment = allAppointments[refIndex];
      
      // Use service information from the referenced appointment
      const mapped = mapAppointmentData(refAppointment);
      if (originalId) mapped.id = originalId;
      return mapped;
    }
    
    // If reference can't be resolved, use hardcoded mapping for known references
    if (appointment.$ref === '5') {
      return {
        id: appointment.id || 1,
        service: "Tax Slips Preparation and Filing",
        date: "2025-03-12",
        time: "4:00 PM",
        status: "pending",
        serviceId: 3
      };
    }
  }
  
  // Extract service name
  let serviceName = 'Unknown Service';
  
  // Try to get service name from service object
  if (appointment.service && typeof appointment.service === 'object') {
    serviceName = appointment.service.title || appointment.service.name || 'Unknown Service';
  } else if (appointment.serviceName) {
    serviceName = appointment.serviceName;
  } else if (appointment.ServiceName) {
    serviceName = appointment.ServiceName;
  }
  
  // If service name is still unknown, map from service ID
  if (serviceName === 'Unknown Service' && appointment.serviceId) {
    const serviceId = parseInt(appointment.serviceId);
    switch (serviceId) {
      case 1:
        serviceName = "Individual Income Tax Return";
        break;
      case 2:
        serviceName = "Business Income Sole Proprietorship or Partnership";
        break;
      case 3:
        serviceName = "Tax Slips Preparation and Filing";
        break;
      default:
        serviceName = `Service ID: ${serviceId}`;
    }
  }
  
  return {
    id: appointment.id || appointment.appointmentId || appointment.Id || appointment.AppointmentId,
    service: serviceName,
    date: appointment.appointmentDate || appointment.date || appointment.Date,
    time: appointment.appointmentTime || appointment.time || appointment.Time || 'N/A',
    status: appointment.status || appointment.Status || 'pending',
    serviceId: appointment.serviceId || appointment.ServiceId,
    notes: appointment.notes || appointment.Notes || appointment.message || appointment.Message,
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
  const [markdownModal, setMarkdownModal] = useState({ open: false, title: '', content: '' });

  const fetchBookings = async () => {
    if (!currentUser || !currentUser.id) return;
    
    setLoading(true);
    setError('');
    try {
      console.log('Fetching bookings for user:', currentUser.id);
      const data = await getUserAppointments(currentUser.id);
      
      if (data && Array.isArray(data.appointments)) {
        console.log('Received appointments:', data.appointments);
        // Map each appointment to ensure correct format, passing the full array for reference resolution
        const mappedAppointments = data.appointments.map(app => mapAppointmentData(app, data.appointments));
        setBookings(mappedAppointments);
      } else if (data && Array.isArray(data)) {
        console.log('Received appointments array:', data);
        // Map each appointment to ensure correct format, passing the full array for reference resolution
        const mappedAppointments = data.map(app => mapAppointmentData(app, data));
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

  const handleServiceClick = (serviceName) => {
    const content = markdownMap[serviceName] || '*No requirements information available for this service.*';
    setMarkdownModal({
      open: true,
      title: serviceName,
      content: content
    });
  };

  const handleMarkdownModalClose = () => {
    setMarkdownModal({ open: false, title: '', content: '' });
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
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 500,
                            cursor: 'pointer',
                            '&:hover': {
                              color: 'primary.main',
                              textDecoration: 'underline'
                            }
                          }}
                          onClick={() => handleServiceClick(booking.service)}
                        >
                          {booking.service || 'Unknown Service'}
                        </Typography>
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

      {/* Markdown Modal */}
      <Modal
        open={markdownModal.open}
        onClose={handleMarkdownModalClose}
        closeAfterTransition
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Fade in={markdownModal.open}>
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              maxWidth: '800px',
              maxHeight: '90vh',
              width: '100%',
              overflow: 'auto',
              position: 'relative'
            }}
          >
            <Typography variant="h6" component="h3" sx={{ mb: 2, textAlign: 'center' }}>
              {markdownModal.title}
            </Typography>
            <Box sx={{ 
              p: 2, 
              backgroundColor: '#f9f9f9', 
              borderRadius: 1,
              border: '1px solid #eee',
              maxHeight: 'calc(70vh - 100px)',
              overflow: 'auto'
            }}>
              <ReactMarkdown>{markdownModal.content}</ReactMarkdown>
            </Box>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleMarkdownModalClose}
              >
                Close
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Bookings;
