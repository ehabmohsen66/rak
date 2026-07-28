import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = './public/client-logos';

const filesToFlipBack = [
  'logo_11.jpg',
  'logo_12.jpg',
  'logo_13.jpg',
  'logo_14.jpg',
  'logo_15.jpg',
  'logo_16.jpg',
  'logo_17.jpg'
];

console.log(`Rotating exactly ${filesToFlipBack.length} logos (logo_11 to logo_17) 180 degrees back to upright...`);

for (const file of filesToFlipBack) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) continue;

  const tempPath = path.join(dir, `upright_${file}`);

  await sharp(filePath)
    .rotate(180)
    .toFile(tempPath);

  fs.renameSync(tempPath, filePath);
  console.log(`Restored ${file} 180 degrees back to upright.`);
}

console.log("=== Flip back complete! ===");
