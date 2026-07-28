import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = './public/client-logos';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg') && f !== 'logo_1.jpg').sort((a, b) => {
  const numA = parseInt(a.replace('logo_', '').replace('.jpg', ''));
  const numB = parseInt(b.replace('logo_', '').replace('.jpg', ''));
  return numA - numB;
});

console.log(`Processing ${files.length} logos...`);

for (const file of files) {
  const filePath = path.join(dir, file);
  const tempPath = path.join(dir, `fixed_${file}`);

  try {
    // Read original image
    let pipeline = sharp(filePath);

    // Apply horizontal flip (flop) to un-mirror text
    // Also apply flip (vertical) if needed, or flop() alone
    await sharp(filePath)
      .flop() // horizontal mirror fix
      .toFile(tempPath);

    fs.renameSync(tempPath, filePath);
    console.log(`Un-mirrored (flop): ${file}`);
  } catch (err) {
    console.error(`Error processing ${file}:`, err);
  }
}

console.log("=== Flop complete ===");
