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
  
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  
  const testAppointments = [
    {
      id: 1000001,
      serviceId: 1,
      serviceTitle: 'Tax Preparation',
      clientName: 'John Doe',
      clientEmail: 'john@example.com',
      clientPhone: '555-123-4567',
      appointmentDate: format(tomorrow, 'yyyy-MM-dd'),
      appointmentTime: '10:00 AM',
      status: 'confirmed',
      createdAt: new Date().toISOString()
    },
    {
      id: 1000002,
      serviceId: 2,
      serviceTitle: 'Business Accounting',
      clientName: 'Jane Smith',
      clientEmail: 'jane@example.com',
      clientPhone: '555-987-6543',
      appointmentDate: format(tomorrow, 'yyyy-MM-dd'),
      appointmentTime: '2:00 PM',
      status: 'confirmed',
      createdAt: new Date().toISOString()
    },
    {
      id: 1000003,
      serviceId: 3,
      serviceTitle: 'Financial Planning',
      clientName: 'Robert Johnson',
      clientEmail: 'robert@example.com',
      clientPhone: '555-456-7890',
      appointmentDate: format(dayAfterTomorrow, 'yyyy-MM-dd'),
      appointmentTime: '11:00 AM',
      status: 'confirmed',
      createdAt: new Date().toISOString()
    }
  ];
  
  saveAppointments(testAppointments);
};

// Format date to yyyy-MM-dd
const format = (date, formatStr) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get all appointments
const getAllAppointments = () => {
  initStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
};

// Save appointments
const saveAppointments = (appointments) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
};

// Create a new appointment
export const createAppointment = async (appointmentData) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const appointments = getAllAppointments();
    
    // Create appointment object with ID
    const newAppointment = {
      id: Date.now(),
      ...appointmentData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    // Add to appointments list
    appointments.push(newAppointment);
    
    // Save to localStorage
    saveAppointments(appointments);
    
    return {
      success: true,
      id: newAppointment.id,
      message: 'Appointment booked successfully!'
    };
  } catch (error) {
    console.error('Error booking appointment:', error);
    return { 
      success: false, 
      message: 'Failed to book appointment. Please try again.' 
    };
  }
};

// Get available time slots for a date
export const getAvailableTimeSlots = async (date) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get booked slots for the date
    const appointments = getAllAppointments();
    const bookedSlots = appointments
      .filter(app => app.appointmentDate === date)
      .map(app => app.appointmentTime);
    
    // Return all time slots with availability status
    return ALL_TIME_SLOTS.map(slot => ({
      time: slot,
      available: !bookedSlots.includes(slot)
    }));
  } catch (error) {
    console.error('Error getting available time slots:', error);
    return ALL_TIME_SLOTS.map(slot => ({
      time: slot,
      available: true
    }));
  }
};

// Get appointments for a date
export const getAppointmentsByDate = (date) => {
  try {
    const appointments = getAllAppointments();
    return appointments.filter(app => app.appointmentDate === date);
  } catch (error) {
    console.error('Error getting appointments:', error);
    return [];
  }
};
