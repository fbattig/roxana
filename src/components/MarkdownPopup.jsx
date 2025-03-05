import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { fetchMarkdownContent } from '../utils/markdownUtils';

/**
 * Component to display markdown content in a popup dialog
 */
const MarkdownPopup = ({ open, onClose, markdownFile, title }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && markdownFile) {
      setLoading(true);
      setError('');
      
      fetchMarkdownContent(markdownFile)
        .then(text => {
          setContent(text);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error loading markdown:', err);
          setError('Failed to load document. Please try again later.');
          setLoading(false);
        });
    }
  }, [open, markdownFile]);

  // Function to render markdown content with basic formatting
  const renderMarkdown = (text) => {
    if (!text) return null;
    
    // Remove markdown code blocks
    const cleanText = text.replace(/```md|```/g, '');
    
    // Split by lines to process headers and lists
    const lines = cleanText.split('\n');
    
    return lines.map((line, index) => {
      // Headers
      if (line.startsWith('# ')) {
        return (
          <Typography key={index} variant="h4" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
            {line.replace('# ', '')}
          </Typography>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <Typography key={index} variant="h5" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
            {line.replace('## ', '')}
          </Typography>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <Typography key={index} variant="h6" gutterBottom sx={{ mt: 1.5, fontWeight: 'bold' }}>
            {line.replace('### ', '')}
          </Typography>
        );
      }
      
      // List items
      if (line.match(/^- /)) {
        return (
          <Box key={index} sx={{ display: 'flex', ml: 2, mb: 0.5 }}>
            <Typography variant="body1" component="span" sx={{ mr: 1 }}>•</Typography>
            <Typography variant="body1" component="span">
              {line.replace(/^- /, '')}
            </Typography>
          </Box>
        );
      }
      
      // Bold text
      if (line.includes('**')) {
        const parts = [];
        let lastIndex = 0;
        let boldOpen = false;
        let currentText = line;
        
        while (currentText.includes('**')) {
          const index = currentText.indexOf('**');
          
          // Add text before the bold marker
          if (index > 0) {
            parts.push({
              text: currentText.substring(0, index),
              bold: boldOpen
            });
          }
          
          // Toggle bold state
          boldOpen = !boldOpen;
          
          // Move to the text after the marker
          currentText = currentText.substring(index + 2);
        }
        
        // Add any remaining text
        if (currentText.length > 0) {
          parts.push({
            text: currentText,
            bold: boldOpen
          });
        }
        
        return (
          <Typography key={index} variant="body1" paragraph>
            {parts.map((part, i) => (
              part.bold ? 
                <Box component="span" sx={{ fontWeight: 'bold' }} key={i}>{part.text}</Box> : 
                <Box component="span" key={i}>{part.text}</Box>
            ))}
          </Typography>
        );
      }
      
      // Regular paragraph
      if (line.trim()) {
        return (
          <Typography key={index} variant="body1" paragraph>
            {line}
          </Typography>
        );
      }
      
      // Empty line
      return <Box key={index} sx={{ height: '0.5em' }} />;
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      aria-labelledby="markdown-dialog-title"
    >
      <DialogTitle id="markdown-dialog-title">
        {title || 'Document Information'}
      </DialogTitle>
      
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Box sx={{ p: 1 }}>
            {renderMarkdown(content)}
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MarkdownPopup;
