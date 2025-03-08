import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import { useAuth } from '../utils/AuthContext';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const scrollToSection = (sectionId) => {
    // If not on home page, navigate to home page first
    if (window.location.pathname !== '/') {
      navigate('/');
      // Add a small delay to allow navigation to complete
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileOpen(false);
  };

  // Get user's first name or full name
  const getUserDisplayName = () => {
    if (!currentUser) return '';
    
    return `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || 'User';
  };

  // Get user's initials for avatar
  const getUserInitials = () => {
    if (!currentUser) return '';
    
    const firstName = currentUser.first_name || '';
    const lastName = currentUser.last_name || '';
    
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const menuItems = [
    { label: 'Home', id: 'hero' },
    { label: 'Services', id: 'services' },
    { label: 'Consultation', id: 'consultation' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ backgroundColor: 'white', boxShadow: 1 }}>
        <Toolbar>
          <Box 
            component={Link}
            to="/"
            sx={{ 
              flexGrow: 1, 
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none'
            }}
          >
            <Box 
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                backgroundColor: 'primary.main',
                borderRadius: '50%',
                mr: 1.5,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  fontFamily: '"Playfair Display", serif',
                  lineHeight: 1,
                }}
              >
                RR
              </Typography>
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'primary.main',
                fontWeight: 600,
                fontSize: '1.5rem',
              }}
            >
              Tax & Accounting
            </Typography>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {menuItems.map((item) => (
              <Button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                sx={{ 
                  color: 'text.primary',
                  mx: 1,
                  '&:hover': {
                    color: 'primary.main'
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
            {currentUser && (
              <Button
                component={Link}
                to="/bookings"
                startIcon={<BookmarkIcon />}
                sx={{ 
                  ml: 2,
                  color: 'text.primary',
                  '&:hover': {
                    color: 'primary.main'
                  }
                }}
              >
                My Bookings
              </Button>
            )}
            {currentUser ? (
              <Chip
                avatar={<Avatar>{getUserInitials()}</Avatar>}
                label={getUserDisplayName()}
                component={Link}
                to="/account"
                clickable
                color="primary"
                variant="outlined"
                sx={{ 
                  ml: 2,
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'white'
                  },
                  maxWidth: { xs: '150px', sm: '200px', md: '250px' },
                  '& .MuiChip-label': {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }
                }}
              />
            ) : (
              <Button
                component={Link}
                to="/account"
                startIcon={<AccountCircleIcon />}
                sx={{ 
                  ml: 2,
                  color: 'text.primary',
                  '&:hover': {
                    color: 'primary.main'
                  }
                }}
              >
                Sign In
              </Button>
            )}
          </Box>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' }, color: 'primary.main' }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: 240 },
        }}
      >
        <List sx={{ mt: 8 }}>
          {currentUser && (
            <ListItem sx={{ mb: 2, justifyContent: 'center' }}>
              <Chip
                avatar={<Avatar>{getUserInitials()}</Avatar>}
                label={`Welcome, ${getUserDisplayName()}`}
                color="primary"
                sx={{ 
                  fontSize: '0.9rem',
                  py: 0.5,
                  maxWidth: '200px',
                  '& .MuiChip-label': {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }
                }}
              />
            </ListItem>
          )}
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.id}
              onClick={() => scrollToSection(item.id)}
            >
              <ListItemText 
                primary={item.label}
                sx={{ 
                  '& .MuiTypography-root': { 
                    color: 'text.primary',
                    fontWeight: 500
                  }
                }}
              />
            </ListItem>
          ))}
          {currentUser && (
            <ListItem 
              button
              component={Link}
              to="/bookings"
              onClick={() => setMobileOpen(false)}
            >
              <ListItemText 
                primary="My Bookings"
                sx={{ 
                  '& .MuiTypography-root': { 
                    color: 'text.primary',
                    fontWeight: 500
                  }
                }}
              />
            </ListItem>
          )}
          <ListItem 
            button
            component={Link}
            to="/account"
            onClick={() => setMobileOpen(false)}
          >
            <ListItemText 
              primary={currentUser ? 'My Account' : 'Sign In'}
              sx={{ 
                '& .MuiTypography-root': { 
                  color: 'text.primary',
                  fontWeight: 500
                }
              }}
            />
          </ListItem>
        </List>
      </Drawer>
      <Toolbar /> {/* This empty Toolbar is for spacing */}
    </Box>
  );
};

export default Navbar;
