import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesToClean = [
  'src/api/appointmentApi.js',
  'src/api/auth.js',
  'src/api/bookings.js'
];

filesToClean.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  const content = fs.readFileSync(fullPath, 'utf8');
  // Remove BOM if present
  const cleanedContent = content.replace(/^\uFEFF/, '');
  fs.writeFileSync(fullPath, cleanedContent, 'utf8');
  console.log(`Cleaned BOM from ${filePath}`);
});

console.log('BOM removal complete');