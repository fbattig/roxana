/**
 * Utility functions for handling markdown files
 */

/**
 * Fetch markdown content from a file
 * @param {string} filename - The name of the markdown file to fetch
 * @returns {Promise<string>} - The markdown content
 */
export const fetchMarkdownContent = async (filename) => {
  try {
    // Use the correct path to markdown files in src/assets/images/documents
    const response = await fetch(`/assets/images/documents/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch markdown content: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error fetching markdown content:', error);
    throw error;
  }
};

/**
 * Map service titles to their corresponding markdown files
 * @param {string} serviceTitle - The title of the service
 * @param {string} language - The language code (en, es)
 * @returns {string|null} - The markdown filename or null if no mapping exists
 */
export const getMarkdownFileForService = (serviceTitle, language = 'en') => {
  // Log the service title for debugging
  console.log('Getting markdown file for service:', serviceTitle);
  
  const serviceMap = {
    'Tax Preparation': {
      en: 'Personal_Tax_Declaration_en.MD',
      es: 'personal_Tax_declaration_es.MD'
    },
    'Business Accounting': {
      en: 'SmallBiz_Inde_Pro_Taxes_en.MD',
      es: 'SmallBiz_Inde_Pro_Taxes_es.MD'
    },
    'Bookkeeping': {
      en: 'Bookkeeping_Information_en.MD',
      es: 'SmallBiz_Inde_Pro_Taxes_es.MD'
    },
    'Bookkeeping Information': {
      en: 'Bookkeeping_Information_en.MD',
      es: 'Bookkeeping_Information_es.MD'
    },
    'Financial Planning': {
      en: 'SmallBiz_Inde_Pro_Taxes_en.MD',
      es: 'SmallBiz_Inde_Pro_Taxes_es.MD'
    }
  };

  const service = serviceMap[serviceTitle];
  if (!service) {
    console.warn(`No markdown mapping found for service: "${serviceTitle}"`);
    return null;
  }
  
  const result = service[language] || service['en']; // Fallback to English if language not available
  console.log(`Mapped "${serviceTitle}" to file: ${result}`);
  return result;
};
