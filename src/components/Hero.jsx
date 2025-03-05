import { Box, Container, Typography, Button, Stack, Grid } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SecurityIcon from '@mui/icons-material/Security';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { useState, useEffect } from 'react';

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = [
    {
      url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=2000",
      alt: "Professional accountant working on financial reports"
    },
    {
      url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=2000",
      alt: "Modern office with financial charts"
    },
    {
      url: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=2000",
      alt: "Business analytics and growth"
    },
    {
      url: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=2000",
      alt: "Tax planning and consultation"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Secure & Confidential',
      description: 'Your financial data is protected with industry-standard security'
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: '25+ Years Experience',
      description: 'Trusted expertise in tax and accounting services'
    },
    {
      icon: <ThumbUpAltIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Client Satisfaction',
      description: '98% client retention rate with personalized service'
    }
  ];

  return (
    <Box
      id="hero"
      sx={{
        background: 'linear-gradient(to right, #ffffff 0%, #f8fafc 100%)',
        pt: { xs: 4, md: 12 },
        pb: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
          opacity: 0.1,
          background: 'radial-gradient(circle at 90% 50%, var(--primary-color) 0%, transparent 60%)',
          zIndex: 0
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 700,
                  color: 'primary.main',
                  lineHeight: 1.2,
                  mb: 1
                }}
              >
                Tax Season is All Year Long
              </Typography>
              
              <Typography
                component="h2"
                sx={{
                  fontSize: { xs: '1.8rem', md: '2.2rem' },
                  fontWeight: 600,
                  color: 'primary.main',
                  lineHeight: 1.2,
                  mb: 2
                }}
              >
                Providing Solutions For All Your Tax Matters
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: 'text.secondary',
                  mb: 4,
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  lineHeight: 1.6,
                  maxWidth: '90%'
                }}
              >
                Professional tax, accounting, and business advisory services tailored to your needs. Let us handle the numbers while you focus on growth.
              </Typography>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    document.getElementById('consultation').scrollIntoView({ behavior: 'smooth' });
                  }}
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    borderRadius: 2,
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    }
                  }}
                >
                  Schedule Consultation
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  href="#services"
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    borderRadius: 2,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      backgroundColor: 'transparent',
                    }
                  }}
                >
                  Our Services
                </Button>
              </Stack>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                height: { xs: '300px', md: '400px' },
                width: '100%',
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              }}
            >
              <AnimatePresence mode='wait'>
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    filter: 'blur(0px)',
                  }}
                  exit={{ 
                    opacity: 0,
                    scale: 1.1,
                    filter: 'blur(8px)',
                  }}
                  transition={{ 
                    duration: 1,
                    ease: 'easeInOut'
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <Box
                    component="img"
                    src={images[currentImageIndex].url}
                    alt={images[currentImageIndex].alt}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 4,
                    }}
                  />
                </motion.div>
              </AnimatePresence>
              
              {/* Image overlay gradient */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '50%',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 100%)',
                  borderRadius: 4,
                }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Features Section */}
        <Box sx={{ mt: { xs: 6, md: 10 } }}>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.2 }}
                >
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor: 'white',
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    {feature.icon}
                    <Typography
                      variant="h6"
                      sx={{
                        mt: 2,
                        mb: 1,
                        fontWeight: 600,
                        color: 'text.primary'
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        lineHeight: 1.6
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
