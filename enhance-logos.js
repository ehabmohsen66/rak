import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = './public/client-logos';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg'));

console.log(`Enhancing ${files.length} logos to HD/4K quality with Sharp...`);

for (const file of files) {
  const filePath = path.join(dir, file);
  const tempPath = path.join(dir, `hd_${file}`);

  const metadata = await sharp(filePath).metadata();
  const targetWidth = Math.min(Math.max((metadata.width || 300) * 4, 1200), 2000);

  await sharp(filePath)
    .resize({
      width: targetWidth,
      kernel: sharp.kernel.lanczos3,
      withoutEnlargement: false,
    })
    .sharpen({
      sigma: 1.2,
      m1: 1.0,
      m2: 2.0
    })
    .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
    .toFile(tempPath);

  fs.renameSync(tempPath, filePath);
  console.log(`Enhanced ${file} from ${metadata.width}px to ${targetWidth}px HD resolution.`);
}

console.log("=== All client logos enhanced to high resolution! ===");
