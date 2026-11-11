// Converts raw PNG/JPG exports in ./assets-src/<app>/<key>.png to
// optimised WebP in ./public/assets/<app>/<key>.webp (max 1600 px wide).
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = path.resolve('assets-src');
const OUT = path.resolve('public/assets');
let n = 0;
for (const app of fs.existsSync(SRC) ? fs.readdirSync(SRC) : []) {
  const dir = path.join(SRC, app);
  if (!fs.statSync(dir).isDirectory()) continue;
  fs.mkdirSync(path.join(OUT, app), { recursive: true });
  for (const f of fs.readdirSync(dir)) {
    if (!/\.(png|jpe?g)$/i.test(f)) continue;
    const out = path.join(OUT, app, f.replace(/\.(png|jpe?g)$/i, '.webp'));
    await sharp(path.join(dir, f)).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(out);
    n++;
  }
}
console.log(`Converted ${n} images → public/assets`);
