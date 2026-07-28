import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = './public/client-logos';

// Logos from logo_7.jpg to logo_35.jpg were already upright originally,
// so rotating them back 180 degrees restores them to right-side up!
const filesToFlipBack = [];
for (let i = 7; i <= 35; i++) {
  filesToFlipBack.push(`logo_${i}.jpg`);
}

console.log(`Flipping back ${filesToFlipBack.length} logos that were already upright...`);

for (const file of filesToFlipBack) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) continue;
  
  const tempPath = path.join(dir, `temp_${file}`);

  await sharp(filePath)
    .rotate(180)
    .toFile(tempPath);

  fs.renameSync(tempPath, filePath);
  console.log(`Restored ${file} right-side up.`);
}

console.log("=== Selective logo orientation fix complete! ===");
