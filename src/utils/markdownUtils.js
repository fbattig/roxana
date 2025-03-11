import { marked } from 'marked';
import childTaxBenefitMarkdown from '../assets/docs/Child Tax Benefit Application.md?raw';
import commissionIncomeMarkdown from '../assets/docs/Commission Income Tax Filing.md?raw';
import newClientsConsultationMarkdown from '../assets/docs/Consultation - New Clients.md?raw';
import reviewLettersConsultationMarkdown from '../assets/docs/Consultation on Review Letters received from Canada Revenue.md?raw';
import corporateTaxConsultationMarkdown from '../assets/docs/Corporate Tax Consultation.md?raw';
import taxSlipsMarkdown from '../assets/docs/Tax Slips Preparation and Filing.md?raw';
import personalTaxMarkdown from '../assets/docs/Personal Tax Filing.md?raw';
import fullTimeStudentsMarkdown from '../assets/docs/Full Time Students Tax Filing.md?raw';
import t1AdjustmentMarkdown from '../assets/docs/T1 Adjustment Consultation.md?raw';
import corporateTaxPrepMarkdown from '../assets/docs/Corporate Tax Preparation and filing.md?raw';
import businessIncomeMarkdown from '../assets/docs/Business Income Sole Proprietorship or Partnership.md?raw';
import disabilityCreditMarkdown from '../assets/docs/Disability Credit Application.md?raw';
import finalTaxReturnMarkdown from '../assets/docs/Final Tax return (Deceased).md?raw';
import hstPrepMarkdown from '../assets/docs/HST Preparation and Filing.md?raw';
import maritalStatusMarkdown from '../assets/docs/Marital Status change.md?raw';
import monthlyBookkeepingMarkdown from '../assets/docs/Monthly Corporate Bookkeeping Services.md?raw';
import monthlyPayrollMarkdown from '../assets/docs/Monthly Payroll.md?raw';
import newComersMarkdown from '../assets/docs/New Comers Tax Filing.md?raw';
import professionalIncomeMarkdown from '../assets/docs/Professional Income Tax.md?raw';
import rentalIncomeMarkdown from '../assets/docs/Rental Income for Sole Proprietorship_Partners Filing.md?raw';
import seniorTaxMarkdown from '../assets/docs/Senior (Over 65+) Tax Filing.md?raw';
import uberTaxiMarkdown from '../assets/docs/Uber or Taxi Driver.md?raw';
import wsibClearanceMarkdown from '../assets/docs/WSIB Clearance.md?raw';
import yearEndAdjustmentMarkdown from '../assets/docs/Year end Adjustment and Financial Report Preparation.md?raw';

/**
 * Utility functions for handling markdown files
 */

/**
 * Map service titles to their markdown content
 */
export const markdownMap = {
  'Tax Slips Preparation and Filing': taxSlipsMarkdown,
  'Child Tax Benefit Application': childTaxBenefitMarkdown,
  'Commission Income Tax Filing': commissionIncomeMarkdown,
  'Consultation - New Clients': newClientsConsultationMarkdown,
  'Consultation on Review Letters': reviewLettersConsultationMarkdown,
  'Corporate Tax Consultation': corporateTaxConsultationMarkdown,
  'Personal Tax Filing': personalTaxMarkdown,
  'Full Time Students Tax Filing': fullTimeStudentsMarkdown,
  'T1 Adjustment Consultation': t1AdjustmentMarkdown,
  'Corporate Tax Preparation and Filing': corporateTaxPrepMarkdown,
  'Business Income (Sole Proprietorship/Partnership)': businessIncomeMarkdown,
  'Disability Credit Application': disabilityCreditMarkdown,
  'Final Tax Return (Deceased)': finalTaxReturnMarkdown,
  'HST Preparation and Filing': hstPrepMarkdown,
  'Marital Status Change': maritalStatusMarkdown,
  'Monthly Corporate Bookkeeping Services': monthlyBookkeepingMarkdown,
  'Monthly Payroll': monthlyPayrollMarkdown,
  'New Comers Tax Filing': newComersMarkdown,
  'Professional Income Tax': professionalIncomeMarkdown,
  'Rental Income Filing': rentalIncomeMarkdown,
  'Senior Tax Filing (65+)': seniorTaxMarkdown,
  'Uber/Taxi Driver Tax Filing': uberTaxiMarkdown,
  'WSIB Clearance': wsibClearanceMarkdown,
  'Year End Adjustment': yearEndAdjustmentMarkdown
};

/**
 * Fetch markdown content from a file
 * @param {string} filename - The name of the markdown file to fetch
 * @returns {Promise<string>} - The markdown content
 */
export const fetchMarkdownContent = async (filename) => {
  try {
    // Use the correct path to markdown files in src/assets/docs
    const response = await fetch(`/assets/docs/${filename}`); // Change the path
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
  // Check if serviceTitle is valid
  if (!serviceTitle || typeof serviceTitle !== 'string') {
    console.warn('Invalid service title provided:', serviceTitle);
    return null;
  }
  
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
      en: 'Financial_Planning_en.MD',
      es: 'Financial_Planning_es.MD'
    },
    'Personal Tax Declaration': {
      en: 'Personal_Tax_Declaration_en.MD',
      es: 'personal_Tax_declaration_es.MD'
    },
    'Personal Tax Return': {
      en: 'Personal_Tax_Declaration_en.MD',
      es: 'personal_Tax_declaration_es.MD'
    },
    'Small Business Taxes': {
      en: 'SmallBiz_Inde_Pro_Taxes_en.MD',
      es: 'SmallBiz_Inde_Pro_Taxes_es.MD'
    },
    'Tax Planning': {
      en: 'Financial_Planning_en.MD',
      es: 'Financial_Planning_es.MD'
    },
    'Tax Slips Preparation and Filing': {
      en: 'Tax Slips Preparation and Filing.MD',
      es: 'Tax Slips Preparation and Filing.MD'
    }
  };

  // Check if the service exists in our map
  if (!serviceMap[serviceTitle]) {
    console.warn(`No markdown mapping found for service: "${serviceTitle}"`);
    return null;
  }

  // Return the appropriate language version
  return serviceMap[serviceTitle][language] || serviceMap[serviceTitle]['en'];
};

/**
* Convert markdown text to HTML
* @param {string} markdown - The markdown content
* @returns {string} - The HTML content
*/
export const convertMarkdownToHtml = (markdown) => {
  return marked(markdown);
};