import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = './public/client-logos';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg') && f !== 'logo_1.jpg');

console.log(`Enhancing ${files.length} logos for maximum quality and crispness...`);

for (const file of files) {
  const filePath = path.join(dir, file);
  const tempPath = path.join(dir, `temp_${file}`);

  try {
    const image = sharp(filePath);
    const meta = await image.metadata();

    // Trim surrounding white margins, sharpen, and save with high JPEG quality (95%)
    await sharp(filePath)
      .trim({ background: '#ffffff', threshold: 25 })
      .resize({
        height: 180,
        fit: 'inside',
        withoutEnlargement: false
      })
      .sharpen({ sigma: 1.2, m1: 1.0, m2: 2.0 })
      .jpeg({ quality: 95, mozjpeg: true })
      .toFile(tempPath);

    fs.renameSync(tempPath, filePath);
    console.log(`Enhanced quality & trimmed margins for: ${file}`);
  } catch (err) {
    // If trimming fails (e.g. non-white background), just resize and sharpen
    try {
      await sharp(filePath)
        .resize({ height: 180, fit: 'inside' })
        .sharpen({ sigma: 1.0 })
        .jpeg({ quality: 95 })
        .toFile(tempPath);
      fs.renameSync(tempPath, filePath);
      console.log(`Enhanced (fallback) for: ${file}`);
    } catch (e) {
      console.error(`Failed to enhance ${file}:`, e);
    }
  }
}

console.log("=== All logos enhanced successfully! ===");
