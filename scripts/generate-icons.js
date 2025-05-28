const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Icon sizes we need
const sizes = [16, 48, 128];

// Function to generate an icon
function generateIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#0A66C2'; // LinkedIn blue
    ctx.fillRect(0, 0, size, size);

    // AI text
    ctx.fillStyle = 'white';
    ctx.font = `bold ${size * 0.5}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('AI', size / 2, size / 2);

    // Save the icon
    const buffer = canvas.toBuffer('image/png');
    const filePath = path.join(__dirname, '..', 'extension', 'src', 'images', `icon${size}.png`);
    fs.writeFileSync(filePath, buffer);
    console.log(`Generated icon${size}.png`);
}

// Generate all sizes
sizes.forEach(generateIcon);
console.log('Icon generation complete!'); 