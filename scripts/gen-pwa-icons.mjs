/**
 * Generates PWA icon PNGs (192x192 and 512x512) without external dependencies.
 * Draws a purple-to-pink gradient background with a simple unicorn head emoji 
 * rendered as a centered ✦ star shape (emoji rendering requires canvas; 
 * we use a stylized geometric approach instead).
 */
import { deflateSync } from 'zlib';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '../public');

function u32(n) {
  const b = Buffer.alloc(4);
  b.writeUInt32BE(n, 0);
  return b;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (const byte of buf) {
    crc ^= byte;
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (~crc) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const len = u32(data.length);
  const crcInput = Buffer.concat([typeBytes, data]);
  const crcVal = u32(crc32(crcInput));
  return Buffer.concat([len, typeBytes, data, crcVal]);
}

function makePNG(size) {
  const PNG_SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR: width, height, bit depth 8, color type 2 (RGB)
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);
  ihdrData.writeUInt32BE(size, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 2;  // color type: RGB
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  // Build raw pixel data with filter bytes
  const rawData = Buffer.alloc(size * (1 + size * 3));
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;

  for (let y = 0; y < size; y++) {
    rawData[y * (1 + size * 3)] = 0; // filter byte = None
    for (let x = 0; x < size; x++) {
      const offset = y * (1 + size * 3) + 1 + x * 3;
      const t = x / size; // horizontal gradient 0..1
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);

      if (dist > r - 1) {
        // outside circle - transparent-ish white (we use white since no alpha in RGB)
        // We'll keep a softer border
        rawData[offset]     = 255;
        rawData[offset + 1] = 255;
        rawData[offset + 2] = 255;
        continue;
      }

      // Purple (#a855f7) → Pink (#ec4899) gradient
      const pr = Math.round(168 + (236 - 168) * t);
      const pg = Math.round(85  + (72  - 85)  * t);
      const pb = Math.round(247 + (153 - 247) * t);

      // Draw a simple star/unicorn silhouette in white
      const nx = (x - cx) / r;
      const ny = (y - cy) / r;
      const angle = Math.atan2(ny, nx);
      const starR = 0.35 + 0.15 * Math.cos(5 * angle);
      const isIcon = dist / r < starR;

      // Horn (triangle above center)
      const isHorn = (x >= cx - size * 0.04 && x <= cx + size * 0.04) &&
                     (y >= cy - r * 0.75 && y <= cy - r * 0.3) &&
                     Math.abs(x - cx) <= (cy - r * 0.3 - y) * 0.15;

      if (isHorn) {
        rawData[offset]     = 255;
        rawData[offset + 1] = 215;
        rawData[offset + 2] = 0;
      } else if (isIcon) {
        rawData[offset]     = 255;
        rawData[offset + 1] = 255;
        rawData[offset + 2] = 255;
      } else {
        rawData[offset]     = pr;
        rawData[offset + 1] = pg;
        rawData[offset + 2] = pb;
      }
    }
  }

  const compressed = deflateSync(rawData, { level: 9 });

  const idat = chunk('IDAT', compressed);
  const ihdr = chunk('IHDR', ihdrData);
  const iend = chunk('IEND', Buffer.alloc(0));

  return Buffer.concat([PNG_SIG, ihdr, idat, iend]);
}

for (const size of [192, 512]) {
  const png = makePNG(size);
  const outPath = join(OUT_DIR, `pwa-${size}x${size}.png`);
  writeFileSync(outPath, png);
  console.log(`✅ Written ${outPath} (${png.length} bytes)`);
}
