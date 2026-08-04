// Recolours the white wordmark to charcoal while leaving the gold-and-red
// swirl untouched, so the logo works on the ivory header.
import { inflateSync, deflateSync } from "node:zlib";
import { readFileSync, writeFileSync } from "node:fs";

const INK = [36, 36, 36]; // #242424

function crc32(buf) {
  let c,
    t = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (const b of buf) crc = t[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

const src = readFileSync(process.argv[2]);
const width = src.readUInt32BE(16);
const height = src.readUInt32BE(20);

// Concatenate every IDAT, then inflate.
let idat = [];
let off = 8;
while (off < src.length) {
  const len = src.readUInt32BE(off);
  const type = src.toString("ascii", off + 4, off + 8);
  if (type === "IDAT") idat.push(src.subarray(off + 8, off + 8 + len));
  off += 12 + len;
}
const raw = inflateSync(Buffer.concat(idat));

const bpp = 4;
const stride = width * bpp;
const px = Buffer.alloc(height * stride);

// Undo the per-scanline filters.
for (let y = 0; y < height; y++) {
  const filter = raw[y * (stride + 1)];
  const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
  for (let x = 0; x < stride; x++) {
    const a = x >= bpp ? px[y * stride + x - bpp] : 0;
    const b = y > 0 ? px[(y - 1) * stride + x] : 0;
    const c = x >= bpp && y > 0 ? px[(y - 1) * stride + x - bpp] : 0;
    let v = line[x];
    if (filter === 1) v += a;
    else if (filter === 2) v += b;
    else if (filter === 3) v += (a + b) >> 1;
    else if (filter === 4) {
      const p = a + b - c;
      const pa = Math.abs(p - a),
        pb = Math.abs(p - b),
        pc = Math.abs(p - c);
      v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
    }
    px[y * stride + x] = v & 0xff;
  }
}

// Anything near-neutral becomes ink; the saturated swirl is left alone.
let changed = 0;
for (let i = 0; i < px.length; i += 4) {
  const [r, g, b, a] = [px[i], px[i + 1], px[i + 2], px[i + 3]];
  if (a === 0) continue;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max === 0 ? 0 : (max - min) / max;
  if (saturation < 0.18 && max > 90) {
    // Keep the original luminance so anti-aliased edges stay smooth.
    const k = max / 255;
    px[i] = Math.round(INK[0] * k + 255 * (1 - k) * 0);
    px[i + 1] = Math.round(INK[1] * k + 255 * (1 - k) * 0);
    px[i + 2] = Math.round(INK[2] * k + 255 * (1 - k) * 0);
    px[i + 3] = Math.round(a * k);
    changed++;
  }
}

// Re-filter with filter 0 and deflate.
const out = Buffer.alloc(height * (stride + 1));
for (let y = 0; y < height; y++) {
  out[y * (stride + 1)] = 0;
  px.copy(out, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
}
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8;
ihdr[9] = 6;

writeFileSync(
  process.argv[3],
  Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(out, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]),
);
console.log(`recoloured ${changed} pixels -> ${process.argv[3]}`);
