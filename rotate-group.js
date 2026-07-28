import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = './public/client-logos';

// Rotate logo_1.jpg to logo_18.jpg by 180 degrees
const groupToRotate = [];
for (let i = 1; i <= 18; i++) {
  groupToRotate.push(`logo_${i}.jpg`);
}

console.log(`Rotating ${groupToRotate.length} logos (logo_1 to logo_18) by 180 degrees...`);

for (const file of groupToRotate) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) continue;

  const tempPath = path.join(dir, `temp_${file}`);

  await sharp(filePath)
    .rotate(180)
    .toFile(tempPath);

  fs.renameSync(tempPath, filePath);
  console.log(`Rotated ${file} 180 degrees.`);
}

console.log("=== Group rotation complete! ===");
