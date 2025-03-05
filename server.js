import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import db from './src/utils/database.js';
import { format } from 'date-fns';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(join(__dirname, 'dist')));

// Serve markdown files from the documents directory
app.use('/src/assets/images/documents', express.static(join(__dirname, 'src/assets/images/documents')));

// Initialize database
const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      service_id INTEGER NOT NULL,
      service_title TEXT NOT NULL,
      client_name TEXT NOT NULL,
      client_email TEXT NOT NULL,
      client_phone TEXT,
      appointment_date TEXT NOT NULL,
      appointment_time TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'pending'
    )
  `);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      phone TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log('Database initialized successfully');
};

// Helper function to hash passwords
const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { salt, hash };
};

// Helper function to verify passwords
const verifyPassword = (password, hash, salt) => {
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
};

// API Routes
app.post('/api/appointments', (req, res) => {
  console.log('Appointment endpoint hit with body:', JSON.stringify(req.body));
  try {
    const { 
      serviceId, 
      serviceTitle, 
      clientName, 
      clientEmail, 
      clientPhone, 
      appointmentDate, 
      appointmentTime 
    } = req.body;

    console.log('Appointment request received:', { serviceId, serviceTitle, clientName, clientEmail, clientPhone, appointmentDate, appointmentTime });

    // Validate required fields
    if (!serviceId || !serviceTitle || !clientName || !clientEmail || !appointmentDate || !appointmentTime) {
      console.log('Missing required fields for appointment');
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    const stmt = db.prepare(`
      INSERT INTO appointments (
        service_id, 
        service_title, 
        client_name, 
        client_email, 
        client_phone, 
        appointment_date, 
        appointment_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      serviceId,
      serviceTitle,
      clientName,
      clientEmail,
      clientPhone || '',
      appointmentDate,
      appointmentTime
    );

    console.log('Appointment booked successfully with ID:', result.lastInsertRowid);
    res.status(201).json({ 
      success: true, 
      id: result.lastInsertRowid,
      message: 'Appointment booked successfully!'
    });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to book appointment. Please try again.' 
    });
  }
});

// User registration endpoint
app.post('/api/users/register', (req, res) => {
  console.log('Registration endpoint hit with body:', JSON.stringify(req.body));
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    console.log('Registration request received:', { firstName, lastName, email, phone });

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      console.log('Missing required fields for registration');
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if user already exists
    const checkUser = db.prepare('SELECT email FROM users WHERE email = ?');
    const existingUser = checkUser.get(email);

    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash the password
    const { salt, hash } = hashPassword(password);
    
    // Store the password as salt:hash
    const passwordStore = `${salt}:${hash}`;

    // Insert the new user
    const stmt = db.prepare(`
      INSERT INTO users (
        first_name,
        last_name,
        email,
        password,
        phone
      ) VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      firstName,
      lastName,
      email,
      passwordStore,
      phone || ''
    );

    console.log('User registered successfully with ID:', result.lastInsertRowid);
    res.status(201).json({
      success: true,
      id: result.lastInsertRowid,
      message: 'Account created successfully!'
    });
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create account. Please try again.'
    });
  }
});

// User login endpoint
app.post('/api/users/login', (req, res) => {
  console.log('Login endpoint hit with body:', JSON.stringify(req.body));
  try {
    const { email, password } = req.body;

    console.log('Login request received:', { email });

    // Validate required fields
    if (!email || !password) {
      console.log('Missing email or password for login');
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find the user
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email);

    if (!user) {
      console.log('User not found with email:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify the password
    const [salt, storedHash] = user.password.split(':');
    const isValid = verifyPassword(password, storedHash, salt);

    if (!isValid) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Return user info (excluding password)
    const { password: _, ...userInfo } = user;
    
    console.log('User logged in successfully:', email);
    res.json({
      success: true,
      message: 'Login successful',
      user: userInfo
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
});

app.get('/api/appointments/available-slots', (req, res) => {
  console.log('Available slots endpoint hit with query:', JSON.stringify(req.query));
  try {
    const { date } = req.query;
    
    if (!date) {
      console.log('Missing date for available slots');
      return res.status(400).json({ 
        success: false, 
        message: 'Date is required' 
      });
    }
    
    // Define all possible time slots
    const allTimeSlots = [
      '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
      '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
      '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
    ];
    
    // Get booked time slots for the given date
    const stmt = db.prepare(`
      SELECT appointment_time 
      FROM appointments 
      WHERE appointment_date = ?
    `);
    
    const bookedSlots = stmt.all(date).map(row => row.appointment_time);
    
    // Filter out booked slots
    const availableSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot));
    
    console.log('Available slots for date:', date, availableSlots);
    res.json({ 
      success: true, 
      availableSlots 
    });
  } catch (error) {
    console.error('Error getting available time slots:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get available time slots' 
    });
  }
});

// Get user appointments
app.get('/api/users/:userId/appointments', (req, res) => {
  console.log('User appointments endpoint hit for userId:', req.params.userId);
  try {
    const { userId } = req.params;
    
    if (!userId) {
      console.log('Missing userId for user appointments');
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }
    
    // Find the user to verify they exist
    const userStmt = db.prepare('SELECT id FROM users WHERE id = ?');
    const user = userStmt.get(userId);
    
    if (!user) {
      console.log('User not found with id:', userId);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get the user's appointments
    const stmt = db.prepare(`
      SELECT 
        a.id,
        a.service_id,
        a.service_title,
        a.client_name,
        a.client_email,
        a.client_phone,
        a.appointment_date,
        a.appointment_time,
        a.status,
        a.created_at
      FROM appointments a
      WHERE a.client_email = (SELECT email FROM users WHERE id = ?)
      ORDER BY a.appointment_date DESC, a.appointment_time ASC
    `);
    
    const appointments = stmt.all(userId);
    
    console.log(`Found ${appointments.length} appointments for user ${userId}`);
    
    res.json({
      success: true,
      appointments
    });
  } catch (error) {
    console.error('Error fetching user appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments. Please try again.'
    });
  }
});

// Cancel an appointment
app.put('/api/appointments/:appointmentId/cancel', (req, res) => {
  console.log('Cancel appointment endpoint hit for appointmentId:', req.params.appointmentId);
  try {
    const { appointmentId } = req.params;
    const { userId } = req.body;
    
    if (!appointmentId) {
      console.log('Missing appointmentId for cancellation');
      return res.status(400).json({ 
        success: false, 
        message: 'Appointment ID is required' 
      });
    }
    
    // Find the appointment
    const findStmt = db.prepare(`
      SELECT a.*, u.id as user_id
      FROM appointments a
      JOIN users u ON a.client_email = u.email
      WHERE a.id = ?
    `);
    
    const appointment = findStmt.get(appointmentId);
    
    if (!appointment) {
      console.log('Appointment not found with id:', appointmentId);
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    // Verify the appointment belongs to the user
    if (userId && appointment.user_id != userId) {
      console.log('Unauthorized cancellation attempt. User:', userId, 'Appointment owner:', appointment.user_id);
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this appointment'
      });
    }
    
    // Update the appointment status to 'cancelled'
    const updateStmt = db.prepare(`
      UPDATE appointments
      SET status = 'cancelled'
      WHERE id = ?
    `);
    
    updateStmt.run(appointmentId);
    
    console.log('Appointment cancelled successfully:', appointmentId);
    res.json({
      success: true,
      message: 'Appointment cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment. Please try again.'
    });
  }
});

// Catch-all route to serve the React app
app.get('*', (req, res) => {
  console.log('Catch-all route hit with path:', req.path);
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Initialize database and start server
initDb();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
