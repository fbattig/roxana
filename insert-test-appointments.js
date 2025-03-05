// Script to directly insert test appointments into the database
import sqlite3 from 'better-sqlite3';

const db = sqlite3('./database.sqlite');

// Check if the appointments table exists
try {
  const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='appointments'").get();
  if (!tableCheck) {
    console.error('The appointments table does not exist. Please initialize the database first.');
    process.exit(1);
  }
} catch (error) {
  console.error('Error checking database tables:', error);
  process.exit(1);
}

// Check if the users table exists and get a user email
let userEmail = 'test@example.com'; // Default fallback
try {
  const userTableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
  if (userTableCheck) {
    const userEmailRow = db.prepare('SELECT email FROM users LIMIT 1').get();
    if (userEmailRow) {
      userEmail = userEmailRow.email;
      console.log(`Using email from first user: ${userEmail}`);
    } else {
      console.log('No users found in the database. Using default test email.');
    }
  } else {
    console.log('Users table does not exist. Using default test email.');
  }
} catch (error) {
  console.log('Error fetching user email:', error);
  console.log('Using default test email.');
}

// Create a test appointment
const insertAppointment = db.prepare(`
  INSERT INTO appointments (
    service_id, 
    service_title, 
    client_name, 
    client_email, 
    client_phone, 
    appointment_date, 
    appointment_time, 
    status, 
    created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

// Create multiple appointments with different services and dates
const services = [
  { id: 1, title: 'Tax Preparation' },
  { id: 2, title: 'Bookkeeping' },
  { id: 3, title: 'Financial Planning' }
];

// Create dates for the next few days
const today = new Date();
const dates = [
  new Date(today.getTime() + 24 * 60 * 60 * 1000), // tomorrow
  new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), // day after tomorrow
  new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
];

// Create times
const times = ['09:00 AM', '11:30 AM', '02:00 PM'];

// Create statuses
const statuses = ['pending', 'confirmed', 'cancelled'];

// Create appointments
for (let i = 0; i < services.length; i++) {
  const service = services[i];
  const date = dates[i];
  const time = times[i];
  const status = statuses[i];
  
  const formattedDate = date.toISOString().split('T')[0];
  
  try {
    const result = insertAppointment.run(
      service.id,
      service.title,
      'Test Client',
      userEmail,
      '555-123-4567',
      formattedDate,
      time,
      status,
      new Date().toISOString()
    );
    
    console.log(`Created appointment for ${service.title} on ${formattedDate} at ${time} with status ${status}`);
  } catch (error) {
    console.error(`Error creating appointment for ${service.title}:`, error);
  }
}

console.log('Test appointments created successfully');
db.close();
