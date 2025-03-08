import { API_URL } from './config.js';

// Storage key for appointments
const STORAGE_KEY = 'rr_tax_appointments';

// All possible time slots
const ALL_TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
];

// Initialize storage if needed
const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    
    // Add some test appointments for demo purposes
    addTestAppointments();
  }
};

// Add test appointments for demonstration
const addTestAppointments = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const appointments = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-123-4567',
      date: format(tomorrow, 'yyyy-MM-dd'),
      time: '10:00 AM',
      service: 'Personal Tax Declaration',
      message: 'First time filing taxes in the US',
      status: 'confirmed'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '555-987-6543',
      date: format(tomorrow, 'yyyy-MM-dd'),
      time: '2:00 PM',
      service: 'Small Business Taxes',
      message: 'Need help with my small business taxes',
      status: 'confirmed'
    },
    {
      id: 3,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '555-555-5555',
      date: format(nextWeek, 'yyyy-MM-dd'),
      time: '11:30 AM',
      service: 'Tax Planning',
      message: 'Looking for tax planning advice',
      status: 'pending'
    }
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
};

// Format date to yyyy-MM-dd
const format = (date, formatStr) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

// Get all appointments
export const getAllAppointments = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
};

// Save appointments
const saveAppointments = (appointments) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
};

// Create a new appointment
export const createAppointment = async (appointmentData) => {
  try {
    // Add to server
    const response = await fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create appointment');
    }

    // Also add to local storage for demo purposes
    const appointments = getAllAppointments();
    const newAppointment = {
      ...appointmentData,
      id: Date.now(), // Simple ID generation
      status: 'pending'
    };

    appointments.push(newAppointment);
    saveAppointments(appointments);

    return { appointment: newAppointment, ...data };
  } catch (error) {
    console.error('Create appointment error:', error);
    throw error;
  }
};

// Get available time slots for a date
export const getAvailableTimeSlots = async (date) => {
  try {
    console.log('Getting available time slots for date:', date);
    
    // Get appointments from local storage
    const localAppointments = getAppointmentsByDate(date);
    const localBookedTimeSlots = localAppointments.map(appointment => appointment.appointmentTime || appointment.time);
    
    // Get appointments from server for this date
    const response = await fetch(`${API_URL}/appointments?date=${date}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch(error => {
      console.warn('Failed to fetch server appointments, falling back to local data:', error);
      return { ok: false };
    });

    let serverBookedTimeSlots = [];
    if (response.ok) {
      const data = await response.json();
      // Extract appointment times from server response
      if (data.appointments && Array.isArray(data.appointments)) {
        serverBookedTimeSlots = data.appointments.map(appointment => 
          appointment.appointmentTime || appointment.time
        );
        console.log('Server booked slots:', serverBookedTimeSlots);
      }
    }
    
    // Combine booked slots from both sources
    const allBookedTimeSlots = [...new Set([...localBookedTimeSlots, ...serverBookedTimeSlots])];
    console.log('All booked slots:', allBookedTimeSlots);
    
    // Return available time slots as objects with time and available properties
    const availableSlots = ALL_TIME_SLOTS.map(timeSlot => {
      const isBooked = allBookedTimeSlots.includes(timeSlot);
      console.log(`Time slot ${timeSlot} is ${isBooked ? 'booked' : 'available'}`);
      return {
        time: timeSlot,
        available: !isBooked
      };
    });
    
    return availableSlots;
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    
    // Fallback to local data in case of error
    const localAppointments = getAppointmentsByDate(date);
    const localBookedTimeSlots = localAppointments.map(appointment => appointment.appointmentTime || appointment.time);
    
    return ALL_TIME_SLOTS.map(timeSlot => ({
      time: timeSlot,
      available: !localBookedTimeSlots.includes(timeSlot)
    }));
  }
};

// Get appointments for a date
export const getAppointmentsByDate = (date) => {
  const appointments = getAllAppointments();

  // Filter appointments by date
  return appointments.filter(appointment => 
    appointment.date === date || appointment.appointmentDate === date
  );
};

// Initialize storage
initStorage();