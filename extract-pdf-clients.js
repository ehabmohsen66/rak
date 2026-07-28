import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

console.log("pdfParse object:", pdfParse);

const dataBuffer = fs.readFileSync('./RAK GROUP PROFILE.pdf');

if (typeof pdfParse === 'function') {
  pdfParse(dataBuffer).then(d => console.log("TEXT:\n", d.text));
} else if (pdfParse.default) {
  pdfParse.default(dataBuffer).then(d => console.log("TEXT:\n", d.text));
}
