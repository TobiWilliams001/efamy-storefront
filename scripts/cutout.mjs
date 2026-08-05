// Removes the white studio background from a packshot PNG.
//
// Flood fills inward from the border rather than thresholding the whole image,
// so white that belongs to the product — lids, labels, highlights — survives.
// Edge pixels get partial alpha so the cutout does not look cut with scissors.
import { inflateSync, deflateSync } from "node:zlib";
import { readFileSync, writeFileSync } from "node:fs";

const HARD = 246; // at or above this, background
const SOFT = 196; // below this, keep fully

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

function decode(src) {
  const width = src.readUInt32BE(16);
  const height = src.readUInt32BE(20);
  const colorType = src[25];
  const channels = colorType === 6 ? 4 : 3;
  let idat = [];
  let off = 8;
  while (off < src.length) {
    const len = src.readUInt32BE(off);
    const type = src.toString("ascii", off + 4, off + 8);
    if (type === "IDAT") idat.push(src.subarray(off + 8, off + 8 + len));
    off += 12 + len;
  }
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const px = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? px[y * stride + x - channels] : 0;
      const b = y > 0 ? px[(y - 1) * stride + x] : 0;
      const c =
        x >= channels && y > 0 ? px[(y - 1) * stride + x - channels] : 0;
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
  return { width, height, channels, px };
}

const { width, height, channels, px } = decode(readFileSync(process.argv[2]));
const out = Buffer.alloc(width * height * 4);
for (let i = 0, o = 0; i < width * height; i++, o += 4) {
  out[o] = px[i * channels];
  out[o + 1] = px[i * channels + 1];
  out[o + 2] = px[i * channels + 2];
  out[o + 3] = 255;
}

const isBackground = (i) => {
  const r = out[i * 4],
    g = out[i * 4 + 1],
    b = out[i * 4 + 2];
  return (
    Math.min(r, g, b) >= SOFT && Math.max(r, g, b) - Math.min(r, g, b) < 26
  );
};

// Flood fill from every border pixel.
const seen = new Uint8Array(width * height);
const queue = [];
for (let x = 0; x < width; x++) {
  queue.push(x, (height - 1) * width + x);
}
for (let y = 0; y < height; y++) {
  queue.push(y * width, y * width + width - 1);
}

let head = 0;
while (head < queue.length) {
  const i = queue[head++];
  if (i < 0 || i >= width * height || seen[i]) continue;
  if (!isBackground(i)) continue;
  seen[i] = 1;
  const x = i % width;
  if (x > 0) queue.push(i - 1);
  if (x < width - 1) queue.push(i + 1);
  if (i >= width) queue.push(i - width);
  if (i + width < width * height) queue.push(i + width);
}

let cleared = 0;
for (let i = 0; i < width * height; i++) {
  if (!seen[i]) continue;
  const lum = Math.min(out[i * 4], out[i * 4 + 1], out[i * 4 + 2]);
  // Ramp the alpha through the soft band so edges stay smooth.
  const alpha =
    lum >= HARD ? 0 : Math.round(255 * (1 - (lum - SOFT) / (HARD - SOFT)));
  out[i * 4 + 3] = Math.max(0, Math.min(255, alpha));
  if (alpha === 0) cleared++;
}

const stride = width * 4;
const filtered = Buffer.alloc(height * (stride + 1));
for (let y = 0; y < height; y++) {
  filtered[y * (stride + 1)] = 0;
  out.copy(filtered, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
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
    chunk("IDAT", deflateSync(filtered, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]),
);

const pct = ((cleared / (width * height)) * 100).toFixed(1);
console.log(`${process.argv[3]}  ${width}x${height}  ${pct}% cleared`);
