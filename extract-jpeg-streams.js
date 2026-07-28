import fs from 'fs';
import path from 'path';

const pdfPath = './RAK GROUP PROFILE.pdf';
const outputDir = './public/client-logos';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const buffer = fs.readFileSync(pdfPath);
let count = 0;
let pos = 0;

while (pos < buffer.length - 2) {
  // Check for JPEG SOI marker (0xFF, 0xD8, 0xFF)
  if (buffer[pos] === 0xFF && buffer[pos + 1] === 0xD8 && buffer[pos + 2] === 0xFF) {
    let endPos = pos + 2;
    let foundEnd = false;
    
    // Find EOI marker (0xFF, 0xD9)
    while (endPos < buffer.length - 1) {
      if (buffer[endPos] === 0xFF && buffer[endPos + 1] === 0xD9) {
        foundEnd = true;
        endPos += 2;
        break;
      }
      endPos++;
    }

    if (foundEnd) {
      const imgBuffer = buffer.slice(pos, endPos);
      // Filter out tiny images (less than 2KB)
      if (imgBuffer.length > 2000) {
        count++;
        const filename = `logo_${count}.jpg`;
        fs.writeFileSync(path.join(outputDir, filename), imgBuffer);
        console.log(`Saved ${filename} (${imgBuffer.length} bytes)`);
      }
      pos = endPos;
      continue;
    }
  }
  pos++;
}

console.log(`=== Extracted ${count} images to ${outputDir} ===`);
