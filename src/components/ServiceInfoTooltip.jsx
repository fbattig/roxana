import { useState } from 'react';
import { 
  Box, 
  Tooltip, 
  IconButton, 
  Typography,
  Paper,
  Button
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import MarkdownPopup from './MarkdownPopup';
import { getMarkdownFileForService } from '../utils/markdownUtils';

/**
 * Component that displays service information with a tooltip and popup
 */
const ServiceInfoTooltip = ({ serviceTitle, children }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  
  // Get the markdown file for this service
  const markdownFile = getMarkdownFileForService(serviceTitle);
  
  // If no markdown file is available for this service, just render the children
  if (!markdownFile) {
    return children;
  }
  
  const handleTooltipOpen = () => {
    setTooltipOpen(true);
  };
  
  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };
  
  const handlePopupOpen = () => {
    setPopupOpen(true);
    setTooltipOpen(false);
  };
  
  const handlePopupClose = () => {
    setPopupOpen(false);
  };
  
  const TooltipContent = () => (
    <Paper sx={{ p: 1.5, maxWidth: 220 }}>
      <Typography variant="body2" gutterBottom>
        Additional information is available for this service.
      </Typography>
      <Button 
        size="small" 
        variant="contained" 
        onClick={handlePopupOpen}
        fullWidth
        sx={{ mt: 1 }}
      >
        View Details
      </Button>
    </Paper>
  );
  
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography 
          component="span" 
          sx={{ 
            cursor: 'pointer', 
            '&:hover': { 
              textDecoration: 'underline',
              color: 'primary.main'
            } 
          }}
          onClick={handlePopupOpen}
        >
          {children}
        </Typography>
        <Tooltip
          title={<TooltipContent />}
          open={tooltipOpen}
          onClose={handleTooltipClose}
          onOpen={handleTooltipOpen}
          placement="right"
          arrow
          interactive
        >
          <IconButton 
            size="small" 
            color="primary"
            sx={{ ml: 1 }}
          >
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      
      <MarkdownPopup
        open={popupOpen}
        onClose={handlePopupClose}
        markdownFile={markdownFile}
        title={`${serviceTitle} Information`}
      />
    </>
  );
};

export default ServiceInfoTooltip;
