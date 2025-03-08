import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Card, CardContent, Container, Button, useTheme, useMediaQuery, Modal, Fade, Tooltip } from '@mui/material';
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
    description: 'Expert guidance and assistance with CRA review letters to help resolve tax inquiries and issues.',
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
    description: 'Specialized tax filing service for individuals earning commission-based income.',
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
    description: 'Initial consultation for new clients to assess tax needs and provide personalized guidance.',
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
    description: 'Comprehensive corporate tax preparation and filing service for businesses of all sizes.',
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
    description: 'Expert consultation on corporate tax matters to optimize tax strategies and ensure compliance.',
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
    description: 'Assistance with completing and filing disability tax credit applications with the CRA.',
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
    description: 'Specialized tax filing service for full-time students, maximizing education-related credits and deductions.',
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
    description: 'Professional preparation and filing of Harmonized Sales Tax (HST) returns for businesses.',
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
    description: 'Specialized tax filing service for professionals such as doctors, lawyers, and consultants.',
    icon: <BookIcon sx={{ fontSize: 48 }} />,
    image: professionalIncomeImage,
    time: '24 hrs',
    price: '$780',
    delay: 0.6,
    category: ['All Services', 'Business']
  },
  {
    id:   13,
    title: 'Monthly Corporate Bookkeeping Services',
    description: 'Monthly reconciliation of accounts, transaction tracking, and financial record maintenance for corporations.',
    icon: <BookIcon sx={{ fontSize: 48 }} />,
    image: monthlyBookkeepingImage,
    time: '4 hrs',
    price: '$400',
    delay: 0.6,
    category: ['All Services', 'Business']
  },
  {
    id: 14,
    title: 'Monthly Payroll',
    description: 'Complete payroll management including reports, remittances, and tax payments to CRA.',
    icon: <PaymentsIcon sx={{ fontSize: 48 }} />,
    image: monthlyPayrollImage,
    time: '8 hrs',
    price: '$180',
    delay: 0.8,
    category: ['All Services', 'Business']
  },
  {
    id: 15,
    title: 'New Comers Tax Filing',
    description: 'Specialized tax filing service for newcomers to Canada, addressing unique tax situations and credits.',
    icon: <PaymentsIcon sx={{ fontSize: 48 }} />,
    image: newComersImage,
    time: '6 hrs',
    price: '$250',
    delay: 0.8,
    category: ['All Services', 'Business']
  },
  {
    id: 16,
    title: 'Personal Tax Filing',
    description: 'Comprehensive personal income tax preparation and filing service for individuals.',
    icon: <PaymentsIcon sx={{ fontSize: 48 }} />,
    image: personalTaxFilingImage,
    time: '4 hrs 15 mins',
    price: '$180',
    delay: 0.8,
    category: ['All Services', 'Business']
  },
  {
    id: 17,
    title: 'Record of Employment Filing',
    description: 'Preparation and filing of Record of Employment (ROE) documents for employers and employees.',
    icon: <PaymentsIcon sx={{ fontSize: 48 }} />,
    image: recordOfEmploymentImage,
    time: '2 hrs',
    price: '$90',
    delay: 0.8,
    category: ['All Services', 'Business']
  },
  {
    id: 18,
    title: 'Rental Income for Sole Proprietorship/Partners Filing',
    description: 'Specialized tax filing for property owners reporting rental income as sole proprietors or partners.',
    icon: <PaymentsIcon sx={{ fontSize: 48 }} />,
    image: rentalIncomeImage,
    time: '5 hrs',
    price: '$400',
    delay: 0.8,
    category: ['All Services', 'Business']
  },
  {
    id: 19,
    title: 'Senior (Over 65+) Tax Filing',
    description: 'Tailored tax filing service for seniors, maximizing age-related credits and benefits.',
    icon: <PaymentsIcon sx={{ fontSize: 48 }} />,
    image: seniorTaxFilingImage,
    time: '3 hrs',
    price: '$60',
    delay: 0.8,
    category: ['All Services', 'Business']
  },
  {
    id: 20,
    title: 'T1 Adjustment Consultation',
    description: 'Expert guidance on adjusting previously filed T1 tax returns to correct errors or claim missed deductions.',
    icon: <PaymentsIcon sx={{ fontSize: 48 }} />,
    image: '',
    time: '1 hrs',
    price: '$120',
    delay: 0.8,
    category: ['All Services', 'Business']
  },
  {
    id: 21,
    title: 'Final Tax return (Deceased)',
    description: 'Preparation and filing of final tax returns for deceased individuals, ensuring proper estate compliance.',
    icon: <PaymentsIcon sx={{ fontSize: 48 }} />,
    image: finalTaxReturnImage,
    time: '5 hrs',
    price: '$180',
    delay: 0.8,
    category: ['All Services', 'Business']
  },
  {
    id: 22,
    title: 'WSIB Clearance',
    description: 'Assistance with obtaining Workplace Safety and Insurance Board (WSIB) clearance certificates.',
    icon: <PaymentsIcon sx={{ fontSize: 48 }} />,
    image: wsibClearanceImage,
    time: '2 hrs',
    price: '$100',
    delay: 0.8,
    category: ['All Services', 'Business']
  },
  {
    id: 23,
    title: 'Uber or Taxi Driver',
    description: 'Specialized tax filing service for Uber, taxi, and rideshare drivers, maximizing eligible deductions.',
    icon: <PaymentsIcon sx={{ fontSize: 48 }} />,
    image: uberTaxiDriverImage,
    time: '8 hrs',
    price: '$380',
    delay: 0.8,
    category: ['All Services', 'Business']
  },
  {
    id: 24,
    title: 'Year end Adjustment and Financial Report Preparation',
    description: 'Comprehensive year-end financial adjustments and preparation of detailed financial reports for businesses.',
    icon: <PaymentsIcon sx={{ fontSize: 48 }} />,
    image: '',
    time: '7 hrs',
    price: '$600',
    delay: 0.8,
    category: ['All Services', 'Business']
  },
  {
    id: 25,
    title: 'Child Tax Benefit Application',
    description: 'Assistance with applying for and maximizing Canada Child Benefit (CCB) and related tax credits.',
    icon: <PaymentsIcon sx={{ fontSize: 48 }} />,
    image: childTaxBenefitImage,
    time: '3 hrs',
    price: '$275',
    delay: 0.8,
    category: ['All Services', 'Business']
  },
  {
    id: 26,
    title: 'Marital Status Change',
    description: 'Tax guidance and filing assistance for individuals who have experienced a change in marital status.',
    icon: <PaymentsIcon sx={{ fontSize: 48 }} />,
    image: maritalStatusChangeImage,
    time: '6 hrs',
    price: '$150',
    delay: 0.8,
    category: ['All Services', 'Business']
  },
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
  const [imagePopup, setImagePopup] = useState({ open: false, image: null, title: null, isSpecialService: false });

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

  // Handle image popup open
  const handleImagePopupOpen = (service, event) => {
    // Prevent the click from propagating to parent elements
    event.stopPropagation();
    setImagePopup({ 
      open: true, 
      image: service.image, 
      title: service.title,
      isSpecialService: service.title === 'Tax Slips Preparation and Filing' // Track if this is the special service
    });
  };

  // Handle image popup close
  const handleImagePopupClose = () => {
    setImagePopup({ open: false, image: null, title: null, isSpecialService: false });
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
            {filteredServices.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={service.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: isMobile ? 0 : service.delay }}
                  viewport={{ once: true }}
                  style={{ height: '100%' }}
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
                    <Tooltip title="Click to view larger image" placement="top" arrow>
                      <Box 
                        sx={{ 
                          height: 180, 
                          overflow: 'hidden',
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          '& img': {
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease-in-out'
                          },
                          '&:hover img': {
                            transform: 'scale(1.05)'
                          },
                          cursor: 'pointer',
                          backgroundColor: 'rgba(245, 245, 245, 0.5)',
                          padding: 2
                        }}
                        onClick={(e) => handleImagePopupOpen(service, e)}
                      >
                        <Box 
                          sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            borderRadius: '50%',
                            width: 30,
                            height: 30,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 2
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>+</Typography>
                        </Box>
                        <img 
                          src={service.image} 
                          alt={service.title} 
                          onError={(e) => {
                            console.log(`Failed to load image: ${service.image}`);
                            e.target.src = DEFAULT_IMAGE;
                          }}
                        />
                      </Box>
                    </Tooltip>
                    <CardContent sx={{ 
                      flexGrow: 1, 
                      p: 2, 
                      pt: 1.5,
                      display: 'flex',
                      flexDirection: 'column',
                      height: 180
                    }}>
                      <Typography 
                        gutterBottom 
                        variant="h6" 
                        component="h3" 
                        sx={{ 
                          fontWeight: 'bold',
                          mb: 1,
                          height: 'auto',
                          whiteSpace: 'normal',
                          overflow: 'visible'
                        }}
                      >
                        {service.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ 
                        mb: 2,
                        height: 110,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 6,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {service.description}
                      </Typography>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          mt: 'auto', 
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

      {/* Image Popup Modal */}
      <Modal
        open={imagePopup.open}
        onClose={handleImagePopupClose}
        closeAfterTransition
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Fade in={imagePopup.open} timeout={200}>
          <Box
            sx={{
              position: 'relative',
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 2,
              maxWidth: imagePopup.isSpecialService ? '95vw' : '80vw',
              maxHeight: imagePopup.isSpecialService ? '90vh' : '80vh',
              overflow: 'hidden',
              outline: 'none'
            }}
          >
            <Typography variant="h6" component="h3" gutterBottom sx={{ mb: 2, textAlign: 'center' }}>
              {imagePopup.title}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                maxHeight: imagePopup.isSpecialService ? 'calc(90vh - 80px)' : 'calc(80vh - 80px)',
                overflow: 'hidden'
              }}
            >
              <img
                src={imagePopup.image}
                alt={imagePopup.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  transform: imagePopup.isSpecialService ? 'scale(1.5)' : 'none'
                }}
                onError={(e) => {
                  console.log(`Failed to load popup image`);
                  e.target.src = DEFAULT_IMAGE;
                }}
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleImagePopupClose}
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                minWidth: 'auto',
                width: 30,
                height: 30,
                p: 0,
                borderRadius: '50%'
              }}
            >
              X
            </Button>
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
