/**
 * Simple client-side database using localStorage
 * This is a simplified solution for demo purposes
 * In a production environment, use a proper backend database
 */

const DB_KEY = 'rr_tax_appointments';

// Initialize the database
const initDb = () => {
  if (!localStorage.getItem(DB_KEY)) {
    localStorage.setItem(DB_KEY, JSON.stringify([]));
  }
};

// Get all appointments
export const getAllAppointments = () => {
  initDb();
  return JSON.parse(localStorage.getItem(DB_KEY));
};

// Add a new appointment
export const addAppointment = (appointment) => {
  const appointments = getAllAppointments();
  
  // Generate a simple ID
  appointment.id = Date.now();
  appointment.created_at = new Date().toISOString();
  appointment.status = 'pending';
  
  appointments.push(appointment);
  localStorage.setItem(DB_KEY, JSON.stringify(appointments));
  
  return appointment;
};

// Get appointments for a specific date
export const getAppointmentsByDate = (date) => {
  const appointments = getAllAppointments();
  return appointments.filter(app => app.appointmentDate === date);
};

// Get available time slots for a specific date
export const getAvailableTimeSlots = (date) => {
  // Define all possible time slots
  const allTimeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];
  
  // Get booked time slots for the given date
  const appointments = getAppointmentsByDate(date);
  const bookedSlots = appointments.map(app => app.appointmentTime);
  
  // Filter out booked slots
  return allTimeSlots.filter(slot => !bookedSlots.includes(slot));
};

// Initialize the database
initDb();
