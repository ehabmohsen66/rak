import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = './public/client-logos';

// Rotate logo_2.jpg through logo_8.jpg back by 180 degrees
const filesToFix = ['logo_2.jpg', 'logo_3.jpg', 'logo_4.jpg', 'logo_5.jpg', 'logo_6.jpg', 'logo_7.jpg', 'logo_8.jpg'];

console.log(`Flipping back ${filesToFix.length} logos (logo_2 to logo_8)...`);

for (const file of filesToFix) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) continue;

  const tempPath = path.join(dir, `fixed_${file}`);

  await sharp(filePath)
    .rotate(180)
    .toFile(tempPath);

  fs.renameSync(tempPath, filePath);
  console.log(`Flipped ${file} 180 degrees back to upright.`);
}

console.log("=== Fix complete! ===");
