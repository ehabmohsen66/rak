import fs from 'fs';
import path from 'path';

const dir = './public/client-logos';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg'));

console.log("Existing logo files:", files);
