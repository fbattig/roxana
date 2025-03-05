// Script to create test appointments
import fetch from 'node-fetch';
import sqlite3 from 'better-sqlite3';

const db = sqlite3('./database.sqlite');

// Get the first user's email from the database
const userEmailQuery = db.prepare('SELECT email FROM users LIMIT 1');
const userEmail = userEmailQuery.get();

if (!userEmail) {
  console.error('No users found in the database. Please create a user first.');
  process.exit(1);
}

console.log(`Using email from first user: ${userEmail.email}`);

async function createAppointments() {
  const appointments = [
    {
      serviceId: 2,
      serviceTitle: 'Business Consultation',
      clientName: 'Fernando Battig',
      clientEmail: userEmail.email, // Use the email from the first user
      clientPhone: '4164187141',
      appointmentDate: '2025-03-20',
      appointmentTime: '2:00 PM'
    },
    {
      serviceId: 3,
      serviceTitle: 'Financial Planning',
      clientName: 'Fernando Battig',
      clientEmail: userEmail.email, // Use the email from the first user
      clientPhone: '4164187141',
      appointmentDate: '2025-04-05',
      appointmentTime: '11:30 AM'
    },
    {
      serviceId: 4,
      serviceTitle: 'Bookkeeping',
      clientName: 'Fernando Battig',
      clientEmail: userEmail.email, // Use the email from the first user
      clientPhone: '4164187141',
      appointmentDate: '2025-04-15',
      appointmentTime: '9:00 AM'
    }
  ];

  for (const appointment of appointments) {
    try {
      console.log(`Creating appointment: ${appointment.serviceTitle} on ${appointment.appointmentDate} at ${appointment.appointmentTime}`);
      const response = await fetch('http://localhost:3001/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointment)
      });
      
      const data = await response.json();
      console.log(`Created appointment: ${appointment.serviceTitle}`, data);
    } catch (error) {
      console.error(`Error creating appointment for ${appointment.serviceTitle}:`, error);
    }
  }
}

createAppointments();

db.close();
