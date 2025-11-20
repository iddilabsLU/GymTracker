/**
 * Generate Placeholder PWA Icons
 *
 * Creates simple SVG placeholder icons for development.
 * For production, replace these with proper branded PNG icons.
 *
 * Usage: node scripts/generate-placeholder-icons.js
 */

const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, '../public/icons');
const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

// Create icons directory if it doesn't exist
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// Generate SVG for each size
SIZES.forEach(size => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="#2563eb" rx="${size * 0.15}"/>

  <!-- Dumbbell Icon (simplified) -->
  <g fill="white">
    <!-- Left weight -->
    <rect x="${size * 0.1}" y="${size * 0.35}" width="${size * 0.12}" height="${size * 0.3}" rx="${size * 0.02}"/>
    <!-- Right weight -->
    <rect x="${size * 0.78}" y="${size * 0.35}" width="${size * 0.12}" height="${size * 0.3}" rx="${size * 0.02}"/>
    <!-- Bar -->
    <rect x="${size * 0.22}" y="${size * 0.46}" width="${size * 0.56}" height="${size * 0.08}" rx="${size * 0.02}"/>
    <!-- Left grip -->
    <rect x="${size * 0.24}" y="${size * 0.42}" width="${size * 0.08}" height="${size * 0.16}" rx="${size * 0.01}"/>
    <!-- Right grip -->
    <rect x="${size * 0.68}" y="${size * 0.42}" width="${size * 0.08}" height="${size * 0.16}" rx="${size * 0.01}"/>
  </g>

  <!-- Size label for development -->
  <text x="${size / 2}" y="${size * 0.9}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${size * 0.1}" font-weight="bold">${size}px</text>
</svg>`;

  const filename = path.join(ICONS_DIR, `icon-${size}x${size}.png`);
  const svgFilename = path.join(ICONS_DIR, `icon-${size}x${size}.svg`);

  // Save as SVG (browsers can use these as fallback)
  fs.writeFileSync(svgFilename, svg);
  console.log(`✓ Generated ${svgFilename}`);
});

console.log('\n✅ Placeholder icons generated successfully!');
console.log('\n⚠️  Note: These are SVG placeholders. For production:');
console.log('   1. Design a proper app icon (1024x1024 PNG)');
console.log('   2. Use https://realfavicongenerator.net/ or ImageMagick');
console.log('   3. Replace the SVG files with PNG files\n');
