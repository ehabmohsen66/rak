import fs from 'fs';

const files = fs.readdirSync('./public/client-logos').filter(f => f.endsWith('.jpg')).sort((a, b) => {
  const numA = parseInt(a.replace('logo_', '').replace('.jpg', ''));
  const numB = parseInt(b.replace('logo_', '').replace('.jpg', ''));
  return numA - numB;
});

const html = `<!DOCTYPE html>
<html>
<head>
<style>
body { background: #111; color: #fff; font-family: sans-serif; padding: 20px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
.card { background: #222; border: 1px solid #444; border-radius: 8px; padding: 10px; text-align: center; }
.card img { max-width: 100%; max-height: 120px; object-fit: contain; background: #fff; border-radius: 4px; padding: 5px; }
</style>
</head>
<body>
<h1>Logo Gallery Inspection</h1>
<div class="grid">
${files.map(f => `
  <div class="card">
    <img src="/client-logos/${f}?v=${Date.now()}" alt="${f}">
    <p><b>${f}</b></p>
  </div>
`).join('')}
</div>
</body>
</html>`;

fs.writeFileSync('./public/logo-preview.html', html);
console.log("Created public/logo-preview.html");
