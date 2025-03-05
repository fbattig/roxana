import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import db from './src/utils/database.js';
import { format } from 'date-fns';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'dist')));

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
  
  console.log('Database initialized successfully');
};

// API Routes
app.post('/api/appointments', (req, res) => {
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

    // Validate required fields
    if (!serviceId || !serviceTitle || !clientName || !clientEmail || !appointmentDate || !appointmentTime) {
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

app.get('/api/appointments/available-slots', (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
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

// Catch-all route to serve the React app
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Initialize database and start server
initDb();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
