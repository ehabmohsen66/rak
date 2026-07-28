import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = './public/client-logos';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg'));

console.log(`Processing ${files.length} logo images with Sharp...`);

for (const file of files) {
  const filePath = path.join(dir, file);
  const tempPath = path.join(dir, `temp_${file}`);

  // Rotate 180 degrees to fix PDF upside-down Y-axis stream extraction
  await sharp(filePath)
    .rotate(180)
    .toFile(tempPath);

  fs.renameSync(tempPath, filePath);
  console.log(`Flipped ${file} 180 degrees right-side up.`);
}

console.log("=== All client logos fixed and right-side up! ===");
