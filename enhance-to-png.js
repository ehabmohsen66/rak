import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = './public/client-logos';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));

console.log(`Processing ${files.length} client logos into Ultra-HD lossless PNGs...`);

for (const file of files) {
  const filePath = path.join(dir, file);
  const baseName = path.basename(file, path.extname(file));
  const pngFilename = `${baseName}.png`;
  const pngPath = path.join(dir, pngFilename);

  try {
    const meta = await sharp(filePath).metadata();
    
    // Calculate target width for 4K / Retina clarity
    const targetWidth = Math.min(Math.max((meta.width || 400) * 3, 1600), 2400);

    // Pipeline: Trim white padding -> High quality resize -> Contrast enhancement -> Sharpen -> PNG output
    let pipeline = sharp(filePath);

    // Auto-trim white border if present
    try {
      pipeline = pipeline.trim({ background: '#ffffff', threshold: 30 });
    } catch (e) {
      // ignore trim errors if image has non-white background
    }

    await pipeline
      .resize({
        width: targetWidth,
        kernel: sharp.kernel.lanczos3,
        withoutEnlargement: false,
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .linear(1.08, -8) // Subtle contrast enhancement to remove compression haze
      .sharpen({
        sigma: 1.0,
        m1: 1.5,
        m2: 3.0
      })
      .png({ quality: 100, compressionLevel: 8 })
      .toFile(pngPath + '.tmp');

    // Rename tmp to final png
    fs.renameSync(pngPath + '.tmp', pngPath);
    console.log(`[PNG HD Ready]: ${pngFilename} (${targetWidth}px wide)`);
  } catch (err) {
    console.error(`Failed to process ${file}:`, err);
  }
}

console.log("=== All client logos converted to Ultra-HD PNG! ===");
