import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';

const publicDir = path.resolve('public');

const standardSvg = fs.readFileSync(path.join(publicDir, 'icon.svg'), 'utf-8');
const maskableSvg = fs.readFileSync(path.join(publicDir, 'icon-maskable.svg'), 'utf-8');

function renderPng(svgString, width, outputPath) {
  const resvg = new Resvg(svgString, {
    fitTo: {
      mode: 'width',
      value: width,
    },
    font: {
      loadSystemFonts: true,
    },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  fs.writeFileSync(outputPath, pngBuffer);
  console.log(`Rendered: ${outputPath} (${width}x${width})`);
}

// 1. PWA 192x192
renderPng(standardSvg, 192, path.join(publicDir, 'pwa-192x192.png'));

// 2. PWA 512x512
renderPng(standardSvg, 512, path.join(publicDir, 'pwa-512x512.png'));

// 3. Apple Touch Icon 180x180 (for iOS Safari home screen)
renderPng(standardSvg, 180, path.join(publicDir, 'apple-touch-icon.png'));

// 4. PWA Maskable 512x512 (with safe-zone margin for Android squircle / circle adaptivity)
renderPng(maskableSvg, 512, path.join(publicDir, 'pwa-maskable-512x512.png'));

// 5. Favicon 48x48
renderPng(standardSvg, 48, path.join(publicDir, 'favicon.ico'));

console.log('All PWA home screen icons successfully generated!');
