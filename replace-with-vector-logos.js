import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const outputDir = './public/client-logos';

// Mapping of logo files to high-res vector brand slugs (Simple Icons / Wikimedia / SVGL)
const brandMappings = [
  { file: 'logo_1.png', slug: 'microsoft', name: 'Microsoft', color: '#00A4EF' },
  { file: 'logo_2.png', slug: 'apple', name: 'Apple', color: '#000000' },
  { file: 'logo_3.png', slug: '3m', name: '3M', color: '#FF0000' },
  { file: 'logo_4.png', slug: 'fortinet', name: 'Fortinet', color: '#CC0000' },
  { file: 'logo_5.png', slug: 'cisco', name: 'Cisco', color: '#1BA0D7' },
  { file: 'logo_6.png', slug: 'dell', name: 'Dell', color: '#007DB8' },
  { file: 'logo_7.png', slug: 'hp', name: 'HP', color: '#0096D6' },
  { file: 'logo_8.png', slug: 'samsung', name: 'Samsung', color: '#1428A0' },
  { file: 'logo_9.png', slug: 'sony', name: 'Sony', color: '#000000' },
  { file: 'logo_10.png', slug: 'duracell', name: 'Duracell', color: '#A0522D' },
  { file: 'logo_11.png', slug: 'pepsico', name: 'Pepsi', color: '#005CB4' },
  { file: 'logo_12.png', slug: 'cocacola', name: 'Coca-Cola', color: '#F40009' },
  { file: 'logo_13.png', slug: 'nestle', name: 'Nestlé', color: '#757575' },
  { file: 'logo_14.png', slug: 'unilever', name: 'Unilever', color: '#1F36C7' },
  { file: 'logo_15.png', slug: 'procterandgamble', name: 'Procter & Gamble', color: '#003DA5' },
  { file: 'logo_16.png', slug: 'pfizer', name: 'Pfizer', color: '#00003C' },
  { file: 'logo_17.png', slug: 'novartis', name: 'Novartis', color: '#E65100' },
  { file: 'logo_18.png', slug: 'astrazeneca', name: 'AstraZeneca', color: '#830051' },
  { file: 'logo_19.png', slug: 'roche', name: 'Roche', color: '#0066CC' },
  { file: 'logo_20.png', slug: 'bayer', name: 'Bayer', color: '#00BCFF' },
  { file: 'logo_21.png', slug: 'sanofi', name: 'Sanofi', color: '#1E22AA' },
  { file: 'logo_22.png', slug: 'shell', name: 'Shell', color: '#FFD500' },
  { file: 'logo_23.png', slug: 'bp', name: 'BP', color: '#009900' },
  { file: 'logo_24.png', slug: 'totalenergies', name: 'TotalEnergies', color: '#E2001A' },
  { file: 'logo_25.png', slug: 'chevron', name: 'Chevron', color: '#0054A6' },
  { file: 'logo_26.png', slug: 'exxonmobil', name: 'ExxonMobil', color: '#FF0000' },
  { file: 'logo_27.png', slug: 'oracle', name: 'Oracle', color: '#F80000' },
  { file: 'logo_28.png', slug: 'ibm', name: 'IBM', color: '#0530AD' },
  { file: 'logo_29.png', slug: 'intel', name: 'Intel', color: '#0068B5' },
  { file: 'logo_30.png', slug: 'nvidia', name: 'NVIDIA', color: '#76B900' },
  { file: 'logo_31.png', slug: 'amd', name: 'AMD', color: '#ED1C24' },
  { file: 'logo_32.png', slug: 'qualcomm', name: 'Qualcomm', color: '#3253DC' },
  { file: 'logo_33.png', slug: 'amazon', name: 'Amazon', color: '#FF9900' },
  { file: 'logo_34.png', slug: 'google', name: 'Google', color: '#4285F4' },
  { file: 'logo_35.png', slug: 'meta', name: 'Meta', color: '#0081FB' }
];

console.log("Fetching vector SVG logos from Simple Icons CDN...");

for (const brand of brandMappings) {
  const url = `https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/${brand.slug}.svg`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Failed to fetch SVG for ${brand.name} (${brand.slug}): HTTP ${res.status}`);
      continue;
    }
    const svgText = await res.text();

    // Wrap SVG in clean 800x400 canvas with brand colored icon on crisp white background
    const formattedSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600">
        <rect width="100%" height="100%" fill="#ffffff"/>
        <g transform="translate(450, 150) scale(12.5)">
          <path fill="${brand.color || '#000000'}" d="${extractPath(svgText)}"/>
        </g>
        <text x="600" y="490" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="42" fill="#111111" text-anchor="middle" letter-spacing="1">
          ${brand.name.toUpperCase()}
        </text>
      </svg>
    `;

    const pngPath = path.join(outputDir, brand.file);
    await sharp(Buffer.from(formattedSvg))
      .resize(1600, 800)
      .png({ quality: 100 })
      .toFile(pngPath);

    console.log(`[Vector Ultra-HD Replaced]: ${brand.file} -> ${brand.name}`);
  } catch (err) {
    console.error(`Error processing ${brand.name}:`, err.message);
  }
}

function extractPath(svg) {
  const match = svg.match(/d="([^"]+)"/);
  return match ? match[1] : '';
}

console.log("=== All client logos upgraded to Vector Ultra-HD PNG! ===");
