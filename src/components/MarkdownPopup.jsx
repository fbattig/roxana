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
import { fetchMarkdownContent, convertMarkdownToHtml } from '../utils/markdownUtils';
import './MarkdownPopup.css';

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
      
      console.log(`MarkdownPopup: Attempting to load file: ${markdownFile}`);
      
      fetchMarkdownContent(markdownFile)
        .then(text => {
          console.log(`MarkdownPopup: Successfully loaded file: ${markdownFile} (${text.length} characters)`);
          // Filter out any HTML-like content from the markdown before converting
          const cleanedMarkdown = text
            .replace(/<script.*?>.*?<\/script>/gs, '')
            .replace(/<meta.*?>/g, '')
            .replace(/<link.*?>/g, '')
            .replace(/<title>.*?<\/title>/g, '');
          setContent(cleanedMarkdown);
          setLoading(false);
        })
        .catch(err => {
          console.error(`MarkdownPopup: Error loading markdown file: ${markdownFile}`, err);
          setError(`Failed to load document: ${markdownFile}. Please try again later.`);
          setLoading(false);
        });
    }
  }, [open, markdownFile]);

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
          <Box 
            className="markdown-content"
            sx={{ p: 1 }}
            dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(content) }}
          />
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
