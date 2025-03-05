import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const features = [
  {
    title: 'Canadian Tax Expertise',
    description: 'Over 20 years of experience in Canadian tax preparation and compliance'
  },
  {
    title: 'Newcomer Specialists',
    description: 'Specialized in helping newcomers file their taxes and first-time filing assistance'
  },
  {
    title: 'Comprehensive Services',
    description: 'Full range of tax, accounting, and advisory services for individuals and businesses'
  },
  {
    title: 'CRA Compliance',
    description: 'Expert handling of CRA business accounts, payroll, HST, and corporate filings'
  }
];

const About = () => {
  return (
    <Box
      id="about"
      sx={{
        py: 8,
        backgroundColor: 'var(--accent-color)'
      }}
    >
      <Container>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h2"
                sx={{
                  color: 'primary.main',
                  mb: 3,
                  fontSize: { xs: '2rem', md: '3rem' }
                }}
              >
                Why Choose Us?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  mb: 4,
                  fontSize: '1.1rem'
                }}
              >
                RR Tax & Accounting has specialized in helping newcomers to file their taxes and providing comprehensive tax solutions for over two decades. Our expertise ensures accurate filings and maximum benefits for our clients.
              </Typography>
              
              <Box sx={{ mt: 4 }}>
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        mb: 2,
                        gap: 2
                      }}
                    >
                      <CheckCircleOutlineIcon
                        sx={{
                          color: 'primary.main',
                          fontSize: 24,
                          mt: 0.5
                        }}
                      />
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: 'text.primary',
                            fontWeight: 600,
                            mb: 0.5
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: 'text.secondary'
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  borderRadius: 2,
                  backgroundColor: '#ffffff'
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    color: 'primary.main',
                    mb: 3,
                    textAlign: 'center'
                  }}
                >
                  Our Numbers
                </Typography>
                <Grid container spacing={3}>
                  {[
                    { number: '20+', label: 'Years Experience' },
                    { number: '1000+', label: 'Satisfied Clients' },
                    { number: '100%', label: 'CRA Compliance' },
                    { number: '24/7', label: 'Support' }
                  ].map((stat, index) => (
                    <Grid item xs={6} key={index}>
                      <Box
                        sx={{
                          textAlign: 'center',
                          p: 2
                        }}
                      >
                        <Typography
                          variant="h3"
                          sx={{
                            color: 'primary.main',
                            fontWeight: 700,
                            mb: 1
                          }}
                        >
                          {stat.number}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: 'text.secondary'
                          }}
                        >
                          {stat.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default About;
