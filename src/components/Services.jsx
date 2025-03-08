import React, { useState } from 'react';
import { Box, Grid, Typography, Card, CardContent, Container, Button, useTheme, useMediaQuery, Modal, Fade } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BookIcon from '@mui/icons-material/Book';
import BusinessIcon from '@mui/icons-material/Business';
import CalculateIcon from '@mui/icons-material/Calculate';
import PaymentsIcon from '@mui/icons-material/Payments';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { motion } from 'framer-motion';
import BookingModal from './BookingModal';

// Import all images from RoxanaSupplied folder
import taxSlipsImage from '../assets/images/RoxanaSupplied/Tax Slips Preparation and Filing.webp';
import businessIncomeImage from '../assets/images/RoxanaSupplied/Business Income Sole Proprietorship or Partnership.webp';
import childTaxBenefitImage from '../assets/images/RoxanaSupplied/Child Tax Benefit Application.webp';
import commissionIncomeImage from '../assets/images/RoxanaSupplied/Commission Income Tax Filing.webp';
import newClientsConsultationImage from '../assets/images/RoxanaSupplied/Consultation - New Clients.webp';
import reviewLettersConsultationImage from '../assets/images/RoxanaSupplied/Consultation on Review Letters received from Canada Revenue.webp';
import corporateTaxConsultationImage from '../assets/images/RoxanaSupplied/Corporate Tax Consultation.webp';
import corporateTaxPreparationImage from '../assets/images/RoxanaSupplied/Corporate Tax Preparation and filing.webp';
import disabilityCreditImage from '../assets/images/RoxanaSupplied/Disability Credit Application.webp';
import finalTaxReturnImage from '../assets/images/RoxanaSupplied/Final Tax return (Deceased).webp';
import fullTimeStudentsImage from '../assets/images/RoxanaSupplied/Full Time Students Tax Filing.webp';
import hstPreparationImage from '../assets/images/RoxanaSupplied/HST Preparation and Filing.webp';
import maritalStatusChangeImage from '../assets/images/RoxanaSupplied/Marital Status change.webp';
import monthlyBookkeepingImage from '../assets/images/RoxanaSupplied/Monthly Corporate Bookkeeping Services.webp';
import monthlyPayrollImage from '../assets/images/RoxanaSupplied/Monthly Payroll.webp';
import newComersImage from '../assets/images/RoxanaSupplied/New Comers Tax Filing.webp';
import personalTaxFilingImage from '../assets/images/RoxanaSupplied/Personal Tax Filing.webp';
import professionalIncomeImage from '../assets/images/RoxanaSupplied/Professional Income Tax.webp';
import recordOfEmploymentImage from '../assets/images/RoxanaSupplied/Record of Employment Filing.webp';
import rentalIncomeImage from '../assets/images/RoxanaSupplied/Rental Income for Sole Proprietorship_Partners Filing.webp';
import seniorTaxFilingImage from '../assets/images/RoxanaSupplied/Senior (Over 65+) Tax Filing.webp';
import uberTaxiDriverImage from '../assets/images/RoxanaSupplied/Uber or Taxi Driver.webp';
import wsibClearanceImage from '../assets/images/RoxanaSupplied/WSIB Clearance.webp';

// Default image to use as fallback
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&w=1920&q=80&fm=webp';

const mainServices = [
  {
    id: 1,
    title: 'Tax Slips Preparation and Filing',
    description: 'Professional preparation and filing of your tax slips to ensure compliance and maximize returns.',
    icon: <CalculateIcon sx={{ fontSize: 48 }} />,
    image: taxSlipsImage,
    time: '3 hrs',
    price: '$465',
    delay: 0,
    category: ['All Services', 'Personal', 'Corporate']
  },
  {
    id: 2,
    title: 'Federal Corporation New Registration',
    description: 'Complete registration service for new federal corporations, ensuring all legal requirements are met.',
    icon: <ReceiptIcon sx={{ fontSize: 48 }} />,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&w=1920&q=80&fm=webp',
    time: '10 hrs 50 mins',
    price: '$1,150',
    delay: 0.2,
    category: ['All Services', 'Corporate', 'Business']
  },
  {
    id: 3,
    title: 'Business Income Sole Proprietorship or Partnership',
    description: 'Comprehensive income tax preparation for sole proprietorships and partnerships.',
    icon: <BusinessIcon sx={{ fontSize: 48 }} />,
    image: businessIncomeImage,
    time: '5 hrs',
    price: '$550',
    delay: 0.4,
    category: ['All Services', 'Business']
  },
  {
    id: 4,
    title: 'Consultation on Review Letters received from Canada Revenue',
    description: 'Monthly reconciliation of accounts, transaction tracking, and financial record maintenance.',
    icon: <BookIcon sx={{ fontSize: 48 }} />,
    image: reviewLettersConsultationImage,
    time: '4 hrs',
    price: '$400',
    delay: 0.6,
    category: ['All Services', 'Business']
  },
  {
    id: 5,
    title: 'Commission Income Tax Filing',
    description: 'Monthly reconciliation of accounts, transaction tracking, and financial record maintenance.',
    icon: <BookIcon sx={{ fontSize: 48 }} />,
    image: commissionIncomeImage,
    time: '8 hrs',
    price: '$580',
    delay: 0.6,
    category: ['All Services', 'Business']
  },
  {
    id: 6,
    title: 'Consultation - New Clients',
    description: 'Monthly reconciliation of accounts, transaction tracking, and financial record maintenance.',
    icon: <BookIcon sx={{ fontSize: 48 }} />,
    image: newClientsConsultationImage,
    time: '45 mins',
    price: '$60',
    delay: 0.6,
    category: ['All Services', 'Business']
  },
  {
    id: 7,
    title: 'Corporate Tax Preparation and filing',
    description: 'Monthly reconciliation of accounts, transaction tracking, and financial record maintenance.',
    icon: <BookIcon sx={{ fontSize: 48 }} />,
    image: corporateTaxPreparationImage,
    time: '24 hrs',
    price: '$2500',
    delay: 0.6,
    category: ['All Services', 'Business']
  },
  {
    id: 8,
    title: 'Corporate Tax Consultation',
    description: 'Monthly reconciliation of accounts, transaction tracking, and financial record maintenance.',
    icon: <BookIcon sx={{ fontSize: 48 }} />,
    image: corporateTaxConsultationImage,
    time: '1 hr',
    price: '$80',
    delay: 0.6,
    category: ['All Services', 'Business']
  },
  {
    id: 9,
    title: 'Disability Credit Application',
    description: 'Monthly reconciliation of accounts, transaction tracking, and financial record maintenance.',
    icon: <BookIcon sx={{ fontSize: 48 }} />,
    image: disabilityCreditImage,
    time: '2 hrs',
    price: '$250',
    delay: 0.6,
    category: ['All Services', 'Business']
  },
  {
    id: 10,
    title: 'Full Time Students Tax Filing',
    description: 'Monthly reconciliation of accounts, transaction tracking, and financial record maintenance.',
    icon: <BookIcon sx={{ fontSize: 48 }} />,
    image: fullTimeStudentsImage,
    time: '4 hrs',
    price: '$65',
    delay: 0.6,
    category: ['All Services', 'Business']
  },
  {
    id: 11,
    title: 'HST Preparation and Filing',
    description: 'Monthly reconciliation of accounts, transaction tracking, and financial record maintenance.',
    icon: <BookIcon sx={{ fontSize: 48 }} />,
    image: hstPreparationImage,
    time: '8 hrs',
    price: '$250',
    delay: 0.6,
    category: ['All Services', 'Business']
  },
  {
    id: 12,
    title: 'Professional Income Tax',
    description: 'Monthly reconciliation of accounts, transaction tracking, and financial record maintenance.',
    icon: <BookIcon sx={{ fontSize: 48 }} />,
    image: professionalIncomeImage,
    time: '24 hrs',
    price: '$780',
    delay: 0.6,
    category: ['All Services', 'Business']
  },
  {
    id:   13,
    title: 'Bookkeeping Services',
    description: 'Monthly reconciliation of accounts, transaction tracking, and financial record maintenance.',
    icon: <BookIcon sx={{ fontSize: 48 }} />,
    image: monthlyBookkeepingImage,
    time: '4 hrs',
    price: '$400',
    delay: 0.6,
    category: ['All Services', 'Business']
  },
  {
    id: 14,
    title: 'Payroll Services',
    description: 'Complete payroll management including reports, remittances, and tax payments to CRA.',
    icon: <PaymentsIcon sx={{ fontSize: 48 }} />,
    image: monthlyPayrollImage,
    time: '3 hrs',
    price: '$350',
    delay: 0.8,
    category: ['All Services', 'Business']
  },
  {
    id: 15,
    title: 'Auditing Services',
    description: 'Through analyzing procedures and documentation, we provide accurate and reliable financial decisions.',
    icon: <AccountBalanceIcon sx={{ fontSize: 48 }} />,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&w=1920&q=80&fm=webp',
    time: '6 hrs',
    price: '$750',
    delay: 1.0,
    category: ['All Services', 'Corporate', 'Consultations']
  },
  {
    id: 16,
    title: 'Personal Tax Return',
    description: 'Complete preparation and filing of personal income tax returns for individuals.',
    icon: <CalculateIcon sx={{ fontSize: 48 }} />,
    image: personalTaxFilingImage,
    time: '2 hrs',
    price: '$250',
    delay: 0.2,
    category: ['All Services', 'Personal']
  },
  {
    id:   17,
    title: 'Corporate Tax Return',
    description: 'Preparation and filing of corporate tax returns for businesses of all sizes.',
    icon: <BusinessIcon sx={{ fontSize: 48 }} />,
    image: corporateTaxPreparationImage,
    time: '8 hrs',
    price: '$950',
    delay: 0.4,
    category: ['All Services', 'Corporate']
  },
  {
    id: 18,
    title: 'Tax Planning Consultation',
    description: 'Strategic tax planning advice to minimize tax liability and maximize savings.',
    icon: <AssignmentIcon sx={{ fontSize: 48 }} />,
    image: corporateTaxConsultationImage,
    time: '2 hrs',
    price: '$300',
    delay: 0.6,
    category: ['All Services', 'Consultations', 'Personal', 'Corporate']
  },
  {
    id: 19,   
    title: 'Business Registration',
    description: 'Complete business registration services for new businesses.',
    icon: <DescriptionIcon sx={{ fontSize: 48 }} />,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&w=1920&q=80&fm=webp',
    time: '4 hrs',
    price: '$500',
    delay: 0.8,
    category: ['All Services', 'Business']
  },
  {
    id: 20,
    title: 'Financial Statement Preparation',
    description: 'Preparation of financial statements for businesses and organizations.',
    icon: <AssessmentIcon sx={{ fontSize: 48 }} />,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&w=1920&q=80&fm=webp',
    time: '6 hrs',
    price: '$700',
    delay: 1.0,
    category: ['All Services', 'Business', 'Corporate']
  },
  {
    id: 21,
    title: 'GST/HST Filing',
    description: 'Preparation and filing of GST/HST returns for businesses.',
    icon: <AttachMoneyIcon sx={{ fontSize: 48 }} />,
    image: hstPreparationImage,
    time: '2 hrs',
    price: '$200',
    delay: 0.2,
    category: ['All Services', 'Business']
  },
  {
    id: 22,
    title: 'Retirement Planning',
    description: 'Comprehensive retirement planning services to ensure financial security.',
    icon: <AccountBalanceWalletIcon sx={{ fontSize: 48 }} />,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&w=1920&q=80&fm=webp',
    time: '3 hrs',
    price: '$400',
    delay: 0.4,
    category: ['All Services', 'Personal', 'Consultations']
  },
  {
    id: 23,
    title: 'Estate Planning',
    description: 'Estate planning services to protect assets and minimize tax implications.',
    icon: <DescriptionIcon sx={{ fontSize: 48 }} />,
    image: finalTaxReturnImage,
    time: '4 hrs',
    price: '$600',
    delay: 0.6,
    category: ['All Services', 'Personal', 'Consultations']
  },
  {
    id:   24,
    title: 'Investment Consultation',
    description: 'Expert advice on investment strategies to maximize returns.',
    icon: <MonetizationOnIcon sx={{ fontSize: 48 }} />,
    image: newClientsConsultationImage,
    time: '2 hrs',
    price: '$350',
    delay: 0.8,
    category: ['All Services', 'Personal', 'Consultations']
  },
  {
    id: 25,
    title: 'Business Valuation',
    description: 'Professional valuation of businesses for sale, purchase, or other purposes.',
    icon: <BusinessIcon sx={{ fontSize: 48 }} />,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&w=1920&q=80&fm=webp',
    time: '8 hrs',
    price: '$1,200',
    delay: 1.0,
    category: ['All Services', 'Business', 'Corporate', 'Consultations']
  },
  {
    id: 26,
    title: 'Quarterly Tax Payments',
    description: 'Management and filing of quarterly tax payments for businesses.',
    icon: <PaymentsIcon sx={{ fontSize: 48 }} />,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&w=1920&q=80&fm=webp',
    time: '2 hrs',
    price: '$250',
    delay: 0.2,
    category: ['All Services', 'Business', 'Corporate']
  },
  {
    id: 27,
    title: 'Financial Forecasting',
    description: 'Development of financial forecasts and projections for businesses.',
    icon: <AssessmentIcon sx={{ fontSize: 48 }} />,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&w=1920&q=80&fm=webp',
    time: '5 hrs',
    price: '$650',
    delay: 0.4,
    category: ['All Services', 'Business', 'Corporate', 'Consultations']
  },
  {
    id: 28,
    title: 'Non-Profit Tax Filing',
    description: 'Specialized tax filing services for non-profit organizations.',
    icon: <ReceiptIcon sx={{ fontSize: 48 }} />,
    image: professionalIncomeImage,
    time: '6 hrs',
    price: '$700',
    delay: 0.6,
    category: ['All Services', 'Corporate']
  },
  {
    id: 30,
    title: 'Tax Audit Representation',
    description: 'Professional representation during tax audits by government agencies.',
    icon: <AccountBalanceIcon sx={{ fontSize: 48 }} />,
    image: reviewLettersConsultationImage,
    time: '10 hrs',
    price: '$1,500',
    delay: 0.8,
    category: ['All Services', 'Personal', 'Corporate', 'Business']
  },
  {
    id: 31,
    title: 'Cash Flow Management',
    description: 'Strategies and services to optimize cash flow for businesses.',
    icon: <AttachMoneyIcon sx={{ fontSize: 48 }} />,
    image: monthlyBookkeepingImage,
    time: '3 hrs',
    price: '$450',
    delay: 1.0,
    category: ['All Services', 'Business']
  },
  {
    id: 32,
    title: 'Tax Deduction Planning',
    description: 'Strategic planning to maximize tax deductions for individuals and businesses.',
    icon: <CalculateIcon sx={{ fontSize: 48 }} />,
    image: corporateTaxConsultationImage,
    time: '2 hrs',
    price: '$300',
    delay: 0.2,
    category: ['All Services', 'Personal', 'Corporate', 'Business']
  },
  {
    id: 33,
    title: 'International Tax Services',
    description: 'Specialized tax services for individuals and businesses with international operations.',
    icon: <BusinessIcon sx={{ fontSize: 48 }} />,
    image: newComersImage,
    time: '8 hrs',
    price: '$1,200',
    delay: 0.4,
    category: ['All Services', 'Personal', 'Corporate', 'Business']
  },
  {
    id: 34,
    title: 'Financial Software Setup',
    description: 'Installation and configuration of financial software for businesses.',
    icon: <BookIcon sx={{ fontSize: 48 }} />,
    image: monthlyBookkeepingImage,
    time: '5 hrs',
    price: '$600',
    delay: 0.6,
    category: ['All Services', 'Business']
  },
  {
    id: 35,
    title: 'Business Restructuring',
    description: 'Professional services for businesses undergoing restructuring or reorganization.',
    icon: <BusinessIcon sx={{ fontSize: 48 }} />,
    image: businessIncomeImage,
    time: '12 hrs',
    price: '$1,800',
    delay: 0.8,
    category: ['All Services', 'Business', 'Corporate', 'Consultations']
  }
];

const serviceCategories = [
  'All Services',
  'Consultations',
  'Personal',
  'Corporate',
  'Business'
];

const features = [
  {
    title: 'Quality Assurance',
    description: 'Our team ensures accurate and reliable financial reporting.',
    image: corporateTaxPreparationImage,
    delay: 0
  },
  {
    title: 'Affordability',
    description: 'Competitive pricing without compromising on service quality.',
    image: personalTaxFilingImage,
    delay: 0.2
  },
  {
    title: 'Security Guaranteed',
    description: 'Your financial data is protected with industry-standard security.',
    image: reviewLettersConsultationImage,
    delay: 0.4
  }
];

const Services = () => {
  const [activeCategory, setActiveCategory] = useState('All Services');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [hoveredImage, setHoveredImage] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Filter services based on active category
  const filteredServices = React.useMemo(() => {
    return mainServices.filter(service => 
      service.category.includes(activeCategory)
    );
  }, [activeCategory]);

  // Handle booking button click
  const handleBooking = (service) => {
    console.log(`Booking requested for: ${service.title}`);
    setSelectedService(service);
    setBookingModalOpen(true);
  };

  // Handle booking modal close
  const handleCloseBookingModal = () => {
    setBookingModalOpen(false);
    setSelectedService(null);
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  return (
    <Box
      id="services"
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: '#f8fafc'
      }}
    >
      {/* Services Section */}
      <Container sx={{ py: { xs: 2, md: 3 } }}>
        {/* Service Categories Navigation */}
        <Box sx={{ mb: 4, pb: 2, borderBottom: '1px solid #ddd' }}>
          <Box
            component="ul"
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              p: 0,
              listStyle: 'none'
            }}
          >
            {serviceCategories.map((category, index) => (
              <Box component="li" key={index} sx={{ mb: 1 }}>
                <Button
                  onClick={() => handleCategoryChange(category)}
                  variant={activeCategory === category ? "contained" : "outlined"}
                  color="primary"
                  sx={{
                    borderRadius: 1,
                    px: 2,
                    py: 1,
                    fontWeight: 'bold'
                  }}
                >
                  {category}
                </Button>
              </Box>
            ))}
          </Box>
        </Box>

        {filteredServices.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6">
              No services found in this category. Please select another category.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredServices.map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: isMobile ? 0 : service.delay }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)'
                      }
                    }}
                  >
                    <Box 
                      sx={{ 
                        height: 300, 
                        overflow: 'hidden',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '& img': {
                          width: '100%',
                          height: 'auto',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          transition: 'transform 0.3s ease-in-out'
                        },
                        '&:hover img': {
                          transform: 'scale(1.05)'
                        },
                        cursor: service.image === 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&w=1920&q=80&fm=webp' ? 'pointer' : 'default',
                        backgroundColor: 'rgba(245, 245, 245, 0.5)',
                        padding: 2
                      }}
                      onMouseEnter={() => service.image === 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&w=1920&q=80&fm=webp' ? setHoveredImage(service.image) : null}
                      onMouseLeave={() => service.image === 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&w=1920&q=80&fm=webp' ? setHoveredImage(null) : null}
                    >
                      <img 
                        src={service.image} 
                        alt={service.title} 
                        onError={(e) => {
                          console.log(`Failed to load image: ${service.image}`);
                          e.target.src = DEFAULT_IMAGE;
                        }}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
                        {service.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {service.description}
                      </Typography>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          mt: 2, 
                          pt: 2, 
                          borderTop: '1px solid #eee' 
                        }}
                      >
                        <Typography variant="body2" fontWeight="bold">
                          {service.time}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {service.price}
                        </Typography>
                      </Box>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        fullWidth 
                        onClick={() => handleBooking(service)}
                        sx={{ 
                          mt: 2, 
                          fontWeight: 'bold',
                          '&:hover': {
                            backgroundColor: theme.palette.primary.dark
                          }
                        }}
                      >
                        BOOK
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Booking Notice */}
        <Box
          sx={{
            mt: 6,
            p: 3,
            textAlign: 'center',
            backgroundColor: '#fff',
            borderRadius: 2,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Please be advised that our booking service fee will require a 50% deposit
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Now is about the start of tax appointment. Schedule appointment include tax consultation in
            which can be paid in full on the day of tax appointment.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            Find out more
          </Button>
        </Box>
      </Container>

      {/* What To Expect Section */}
      <Box sx={{ backgroundColor: '#fff', py: { xs: 4, md: 6 } }}>
        <Container>
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: 4,
              fontSize: { xs: '1.8rem', md: '2.2rem' },
              fontWeight: 600,
              position: 'relative',
              '&::before, &::after': {
                content: '""',
                position: 'absolute',
                height: '2px',
                width: { xs: '50px', md: '80px' },
                backgroundColor: 'primary.main',
                top: '50%'
              },
              '&::before': {
                left: { xs: '20%', md: '30%' }
              },
              '&::after': {
                right: { xs: '20%', md: '30%' }
              }
            }}
          >
            What To Expect
          </Typography>

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: isMobile ? 0 : feature.delay }}
                  viewport={{ once: true }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      aspectRatio: '16/9',
                      overflow: 'hidden',
                      borderRadius: 2,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 1
                      }
                    }}
                  >
                    <img
                      src={feature.image}
                      alt={feature.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        p: 2,
                        color: 'white',
                        zIndex: 2
                      }}
                    >
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2">
                        {feature.description}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Image Preview Modal */}
      <Modal
        open={hoveredImage !== null}
        onClose={() => setHoveredImage(null)}
        closeAfterTransition
        disableAutoFocus
        disableEnforceFocus
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}
      >
        <Fade in={hoveredImage !== null}>
          <Box
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 4,
              maxWidth: '95vw',
              maxHeight: '95vh',
              outline: 'none',
              borderRadius: 2,
              position: 'relative',
              pointerEvents: 'auto'
            }}
          >
            <img
              src={hoveredImage}
              alt="Enlarged view"
              style={{
                maxWidth: '100%',
                maxHeight: '85vh',
                objectFit: 'contain',
                display: 'block',
                margin: '0 auto',
                transform: 'scale(1.5)',
                transformOrigin: 'center center'
              }}
            />
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'white', 
                textAlign: 'center', 
                mt: 1,
                opacity: 0.8
              }}
            >
              Move mouse away to close
            </Typography>
          </Box>
        </Fade>
      </Modal>

      {/* Booking Modal */}
      <BookingModal 
        open={bookingModalOpen}
        onClose={handleCloseBookingModal}
        service={selectedService}
      />
    </Box>
  );
};

export default Services;
