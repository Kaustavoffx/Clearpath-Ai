const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const sourceLogo = path.join(publicDir, 'icon-512x512.png');

if (!fs.existsSync(sourceLogo)) {
  console.error('Source icon-512x512.png not found! Please restore it.');
  process.exit(1);
}

const v = '-v2';

const sizes = {
  favicon: [16, 32, 48],
  icon: [72, 96, 128, 144, 152, 180, 192, 384, 512],
};

async function generate() {
  try {
    // 1. Favicons
    for (const size of sizes.favicon) {
      await sharp(sourceLogo)
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .toFile(path.join(publicDir, `favicon-${size}${v}.png`));
    }
    fs.copyFileSync(path.join(publicDir, `favicon-32${v}.png`), path.join(publicDir, `favicon.ico`)); // legacy

    // 2. Standard Transparent Icons (for any)
    for (const size of sizes.icon) {
      await sharp(sourceLogo)
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .toFile(path.join(publicDir, `icon-${size}${v}.png`));
    }

    // 3. Maskable Icons (Android/Chrome Safe Area)
    // Logo should be ~60% of canvas
    for (const size of [192, 512]) {
      const logoSize = Math.floor(size * 0.6);
      const padding = Math.floor((size - logoSize) / 2);
      
      await sharp(sourceLogo)
        .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .extend({
          top: padding,
          bottom: size - logoSize - padding,
          left: padding,
          right: size - logoSize - padding,
          background: '#050816'
        })
        .resize(size, size) // force exact
        .toFile(path.join(publicDir, `maskable-${size}${v}.png`));
    }

    // 4. Apple Touch Icon (Opaque square, usually 180x180)
    // Logo ~80% of canvas
    const appleSize = 180;
    const appleLogoSize = Math.floor(appleSize * 0.8);
    const applePad = Math.floor((appleSize - appleLogoSize) / 2);
    
    await sharp(sourceLogo)
      .resize(appleLogoSize, appleLogoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extend({
        top: applePad,
        bottom: appleSize - appleLogoSize - applePad,
        left: applePad,
        right: appleSize - appleLogoSize - applePad,
        background: '#050816'
      })
      .resize(appleSize, appleSize)
      .toFile(path.join(publicDir, `apple-touch-icon${v}.png`));

    console.log('Successfully generated strict PWA pipeline icons.');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generate();
