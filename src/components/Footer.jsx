import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Services',
      links: ['Bookkeeping', 'Financial Reporting', 'Tax Preparation', 'Payroll Services']
    },
    {
      title: 'Company',
      links: ['About Us', 'Our Team', 'Careers', 'Privacy Policy']
    },
    {
      title: 'Resources',
      links: ['Blog', 'Newsletter', 'Events', 'Help Center']
    }
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, url: '#' },
    { icon: <TwitterIcon />, url: '#' },
    { icon: <LinkedInIcon />, url: '#' },
    { icon: <InstagramIcon />, url: '#' }
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container>
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              RR Tax & Accounting
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Providing Solutions For All Your Tax Matters. Specialized in Canadian tax preparation 
              and helping newcomers with their first-time filing.
            </Typography>
            <Box sx={{ mt: 2 }}>
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  component={Link}
                  href={social.url}
                  sx={{
                    color: 'white',
                    mr: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <Grid item xs={12} sm={6} md={2} key={index}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                {section.title}
              </Typography>
              {section.links.map((link, linkIndex) => (
                <Typography
                  key={linkIndex}
                  component={Link}
                  href="#"
                  sx={{
                    display: 'block',
                    mb: 1,
                    color: 'white',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Grid>
          ))}

          {/* Newsletter Signup */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Contact
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              3250 Bloor Street West
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              East Tower, 6th Floor
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Toronto, ON
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Phone: (647) 775-1580
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Email: roxana@roxanarodriguez.ca
            </Typography>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box
          sx={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            mt: 6,
            pt: 3,
            textAlign: 'center'
          }}
        >
          <Typography variant="body2">
            {currentYear} RR Tax & Accounting - All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
