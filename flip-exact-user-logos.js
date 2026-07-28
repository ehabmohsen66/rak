import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = './public/client-logos';

const filesToFlip = [
  'logo_9.jpg',
  'logo_10.jpg',
  'logo_11.jpg',
  'logo_12.jpg',
  'logo_13.jpg',
  'logo_14.jpg',
  'logo_15.jpg',
  'logo_16.jpg',
  'logo_17.jpg',
  'logo_18.jpg',
  'logo_24.jpg',
  'logo_25.jpg',
  'logo_30.jpg'
];

console.log(`Rotating exactly ${filesToFlip.length} specified logo files 180 degrees...`);

for (const file of filesToFlip) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${file}`);
    continue;
  }

  const tempPath = path.join(dir, `flipped_${file}`);

  await sharp(filePath)
    .rotate(180)
    .toFile(tempPath);

  fs.renameSync(tempPath, filePath);
  console.log(`Flipped ${file} 180 degrees to upright.`);
}

console.log("=== Exact logo flip complete! ===");
