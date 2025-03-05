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
  CircularProgress
} from '@mui/material';
import { useAuth } from '../utils/AuthContext';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    // This is a placeholder for future implementation
    // In a real implementation, we would fetch the user's bookings from the server
    setLoading(false);
    setBookings([]);
  }, [currentUser]);

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
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.service_title}</TableCell>
                    <TableCell>{booking.appointment_date}</TableCell>
                    <TableCell>{booking.appointment_time}</TableCell>
                    <TableCell>{booking.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          This page will be enhanced in a future update to allow you to manage your bookings.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Bookings;
