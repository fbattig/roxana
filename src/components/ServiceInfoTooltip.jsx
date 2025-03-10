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
 * @param {Object|string} service - The service object or name
 * @param {string} serviceTitle - The service title (legacy prop for backward compatibility)
 * @param {React.ReactNode} children - Optional children to render alongside the tooltip
 */
const ServiceInfoTooltip = ({ service, serviceTitle, children }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  
  // Handle service prop which can be either a string or an object
  let title = '';
  
  if (typeof service === 'string') {
    // If service is a string, use it directly
    title = service;
  } else if (service && typeof service === 'object') {
    // If service is an object, extract the name or title
    title = service.name || service.title || service.serviceName || service.ServiceName || '';
  }
  
  // Fall back to serviceTitle for backward compatibility
  if (!title && serviceTitle) {
    title = serviceTitle;
  }
  
  // Skip markdown lookup if title is empty
  if (!title) {
    return children || <span>No service information available</span>;
  }
  
  // Get the markdown file for this service
  const markdownFile = getMarkdownFileForService(title);
  
  // If no markdown file is available for this service, just render the children
  if (!markdownFile) {
    return children || <span>{title}</span>;
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
        variant="outlined" 
        onClick={handlePopupOpen}
        fullWidth
      >
        View Details
      </Button>
    </Paper>
  );
  
  return (
    <>
      {/* Render children if provided */}
      {children || <span>{title}</span>}
      
      {/* Info icon with tooltip */}
      <Tooltip
        title={<TooltipContent />}
        open={tooltipOpen}
        onClose={handleTooltipClose}
        disableFocusListener
        disableTouchListener
        arrow
        placement="top"
        PopperProps={{
          sx: {
            '& .MuiTooltip-tooltip': {
              bgcolor: 'background.paper',
              color: 'text.primary',
              boxShadow: 3,
              p: 0,
              maxWidth: 'none'
            },
            '& .MuiTooltip-arrow': {
              color: 'background.paper'
            }
          }
        }}
      >
        <IconButton 
          size="small" 
          color="primary"
          onClick={handleTooltipOpen}
          sx={{ ml: 0.5, p: 0.5 }}
        >
          <InfoIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      
      {/* Full markdown popup */}
      <MarkdownPopup
        open={popupOpen}
        onClose={handlePopupClose}
        title={`${title} Information`}
        markdownFile={markdownFile}
      />
    </>
  );
};

export default ServiceInfoTooltip;
