import sharp from 'sharp';

const meta = await sharp('./public/client-logos/logo_1.jpg').metadata();
console.log("logo_1.jpg metadata:", meta);
