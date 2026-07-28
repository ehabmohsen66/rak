import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = './public/client-logos';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg')).sort((a, b) => {
  const numA = parseInt(a.replace('logo_', '').replace('.jpg', ''));
  const numB = parseInt(b.replace('logo_', '').replace('.jpg', ''));
  return numA - numB;
});

console.log(`Found ${files.length} logos.`);

for (const file of files) {
  const filePath = path.join(dir, file);
  const meta = await sharp(filePath).metadata();
  console.log(`${file}: ${meta.width}x${meta.height}, format: ${meta.format}`);
}
