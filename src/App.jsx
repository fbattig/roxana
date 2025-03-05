import { useState } from 'react'
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate,
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
  useRoutes
} from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ConsultationScheduler from './components/ConsultationScheduler'
import Account from './components/Account'
import Bookings from './components/Bookings'
import { AuthProvider } from './utils/AuthContext'
import './styles/main.css'

// Configure future flags for React Router
const router = {
  basename: "/",
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e',
    },
    secondary: {
      main: '#534bae',
    },
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
  },
})

function App() {
  return (
    <Router {...router}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <CssBaseline />
            <Navbar />
            <Routes>
              <Route path="/" element={
                <main>
                  <Hero />
                  <Services />
                  <ConsultationScheduler />
                  <About />
                  <Contact />
                </main>
              } />
              <Route path="/account" element={<Account />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
          </LocalizationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
