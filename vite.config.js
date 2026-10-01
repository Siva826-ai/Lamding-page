import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

// --- PNG & ICO BINARY ENCODER ---
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[i] = c;
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function adler32(buf) {
  let s1 = 1, s2 = 0;
  for (let i = 0; i < buf.length; i++) {
    s1 = (s1 + buf[i]) % 65521;
    s2 = (s2 + s1) % 65521;
  }
  return ((s2 << 16) | s1) >>> 0;
}

function createChunk(typeStr, dataBuf) {
  const typeBuf = new Uint8Array([
    typeStr.charCodeAt(0), typeStr.charCodeAt(1),
    typeStr.charCodeAt(2), typeStr.charCodeAt(3)
  ]);
  const len = dataBuf.length;
  const chunk = new Uint8Array(4 + 4 + len + 4);
  chunk[0] = (len >>> 24) & 0xFF;
  chunk[1] = (len >>> 16) & 0xFF;
  chunk[2] = (len >>> 8) & 0xFF;
  chunk[3] = len & 0xFF;
  chunk.set(typeBuf, 4);
  chunk.set(dataBuf, 8);

  const crcInput = new Uint8Array(4 + len);
  crcInput.set(typeBuf, 0);
  crcInput.set(dataBuf, 4);
  const crcVal = crc32(crcInput);

  const crcPos = 8 + len;
  chunk[crcPos] = (crcVal >>> 24) & 0xFF;
  chunk[crcPos + 1] = (crcVal >>> 16) & 0xFF;
  chunk[crcPos + 2] = (crcVal >>> 8) & 0xFF;
  chunk[crcPos + 3] = crcVal & 0xFF;
  return chunk;
}

function createPng(width, height, getPixel) {
  const rowSize = 1 + width * 4;
  const rawData = new Uint8Array(height * rowSize);
  let ptr = 0;
  for (let y = 0; y < height; y++) {
    rawData[ptr++] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      rawData[ptr++] = r;
      rawData[ptr++] = g;
      rawData[ptr++] = b;
      rawData[ptr++] = a;
    }
  }

  const zlibChunks = [];
  zlibChunks.push(new Uint8Array([0x78, 0x01]));

  let offset = 0;
  while (offset < rawData.length) {
    const chunkSize = Math.min(rawData.length - offset, 65535);
    const isLast = (offset + chunkSize >= rawData.length) ? 1 : 0;
    const blockHeader = new Uint8Array(5);
    blockHeader[0] = isLast ? 0x01 : 0x00;
    blockHeader[1] = chunkSize & 0xFF;
    blockHeader[2] = (chunkSize >> 8) & 0xFF;
    const nlen = chunkSize ^ 0xFFFF;
    blockHeader[3] = nlen & 0xFF;
    blockHeader[4] = (nlen >> 8) & 0xFF;

    zlibChunks.push(blockHeader);
    zlibChunks.push(rawData.subarray(offset, offset + chunkSize));
    offset += chunkSize;
  }

  const adler = adler32(rawData);
  const adlerBuf = new Uint8Array(4);
  adlerBuf[0] = (adler >> 24) & 0xFF;
  adlerBuf[1] = (adler >> 16) & 0xFF;
  adlerBuf[2] = (adler >> 8) & 0xFF;
  adlerBuf[3] = adler & 0xFF;
  zlibChunks.push(adlerBuf);

  let zlibLen = 0;
  for (const chunk of zlibChunks) zlibLen += chunk.length;
  const zlibStream = new Uint8Array(zlibLen);
  let pos = 0;
  for (const chunk of zlibChunks) {
    zlibStream.set(chunk, pos);
    pos += chunk.length;
  }

  const pngHeader = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdrData = new Uint8Array(13);
  ihdrData[0] = (width >>> 24) & 0xFF;
  ihdrData[1] = (width >>> 16) & 0xFF;
  ihdrData[2] = (width >>> 8) & 0xFF;
  ihdrData[3] = width & 0xFF;
  ihdrData[4] = (height >>> 24) & 0xFF;
  ihdrData[5] = (height >>> 16) & 0xFF;
  ihdrData[6] = (height >>> 8) & 0xFF;
  ihdrData[7] = height & 0xFF;
  ihdrData[8] = 8; // Bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  const ihdrChunk = createChunk('IHDR', ihdrData);
  const idatChunk = createChunk('IDAT', zlibStream);
  const iendChunk = createChunk('IEND', new Uint8Array(0));

  const totalLen = pngHeader.length + ihdrChunk.length + idatChunk.length + iendChunk.length;
  const pngBuf = new Uint8Array(totalLen);
  let p = 0;
  pngBuf.set(pngHeader, p); p += pngHeader.length;
  pngBuf.set(ihdrChunk, p); p += ihdrChunk.length;
  pngBuf.set(idatChunk, p); p += idatChunk.length;
  pngBuf.set(iendChunk, p); p += iendChunk.length;

  return Buffer.from(pngBuf);
}

function createIcoFromPng(pngBuffer, width, height) {
  const icoHeader = Buffer.from([0x00, 0x00, 0x01, 0x00, 0x01, 0x00]);
  const pngLen = pngBuffer.length;
  const dirEntry = Buffer.alloc(16);
  dirEntry[0] = width >= 256 ? 0 : width;
  dirEntry[1] = height >= 256 ? 0 : height;
  dirEntry[2] = 0;
  dirEntry[3] = 0;
  dirEntry[4] = 1;
  dirEntry[5] = 0;
  dirEntry[6] = 32;
  dirEntry[7] = 0;
  dirEntry.writeUInt32LE(pngLen, 8);
  dirEntry.writeUInt32LE(22, 12); // Offset 22

  return Buffer.concat([icoHeader, dirEntry, pngBuffer]);
}

// --- TVS EMERALD PIXEL RENDERER ---
function getTvsEmeraldPixel(x, y, W, H) {
  const u = x / (W - 1);
  const v = y / (H - 1);

  // Rounded Corner Mask
  const cx = u < 0.15 ? u - 0.15 : (u > 0.85 ? u - 0.85 : 0);
  const cy = v < 0.15 ? v - 0.15 : (v > 0.85 ? v - 0.85 : 0);
  if (cx * cx + cy * cy > 0.15 * 0.15) {
    return [0, 0, 0, 0];
  }

  // Gold outer frame border
  if (u < 0.04 || u > 0.96 || v < 0.04 || v > 0.96) {
    return [200, 155, 60, 255]; // Gold #C89B3C
  }

  // Base background: Dark Emerald #063C2D
  let r = 6, g = 60, b = 45, a = 255;

  // Slanted Roof Highlight: #6BB238 (RGB 107, 178, 56)
  const roofLine = 0.30 - (u - 0.48) * 0.30;
  if (u >= 0.48 && u <= 0.90 && v >= roofLine - 0.07 && v <= roofLine) {
    return [107, 178, 56, 255];
  }

  // Emerald Badge Body: #2E8B34 (RGB 46, 139, 52)
  if (u >= 0.48 && u <= 0.90 && v > roofLine && v <= 0.70) {
    // White 'E' emblem inside green badge
    const inE = (u >= 0.54 && u <= 0.59 && v >= 0.38 && v <= 0.62) ||
                (v >= 0.38 && v <= 0.43 && u >= 0.54 && u <= 0.78) ||
                (v >= 0.48 && v <= 0.52 && u >= 0.54 && u <= 0.72) ||
                (v >= 0.57 && v <= 0.62 && u >= 0.54 && u <= 0.78);
    if (inE) {
      return [255, 255, 255, 255];
    }
    return [46, 139, 52, 255];
  }

  // Italic TVS Text (White #FFFFFF) in left section (u in 0.10 .. 0.44)
  const slantU = u + 0.12 * (v - 0.48);

  // Letter T
  const isT = (v >= 0.28 && v <= 0.36 && slantU >= 0.10 && slantU <= 0.24) ||
              (slantU >= 0.15 && slantU <= 0.19 && v >= 0.36 && v <= 0.68);

  // Letter V
  const vProgress = (v - 0.28) / 0.40;
  const vLeftU = 0.22 + vProgress * 0.05;
  const vRightU = 0.32 - vProgress * 0.05;
  const isV = (v >= 0.28 && v <= 0.68) &&
              (Math.abs(slantU - vLeftU) <= 0.025 || Math.abs(slantU - vRightU) <= 0.025);

  // Letter S
  const isS = (v >= 0.28 && v <= 0.68) && (
    (v >= 0.28 && v <= 0.35 && slantU >= 0.33 && slantU <= 0.44) ||
    (v >= 0.44 && v <= 0.51 && slantU >= 0.33 && slantU <= 0.44) ||
    (v >= 0.61 && v <= 0.68 && slantU >= 0.33 && slantU <= 0.44) ||
    (v >= 0.35 && v <= 0.44 && slantU >= 0.33 && slantU <= 0.36) ||
    (v >= 0.51 && v <= 0.61 && slantU >= 0.41 && slantU <= 0.44)
  );

  if (isT || isV || isS) {
    return [255, 255, 255, 255];
  }

  // Gold accent bar below logo
  if (u >= 0.10 && u <= 0.90 && v >= 0.76 && v <= 0.80) {
    return [200, 155, 60, 255]; // Gold #C89B3C
  }

  return [r, g, b, a];
}

function generateFaviconFiles() {
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const png16 = createPng(16, 16, getTvsEmeraldPixel);
  const png32 = createPng(32, 32, getTvsEmeraldPixel);
  const png180 = createPng(180, 180, getTvsEmeraldPixel);
  const ico32 = createIcoFromPng(png32, 32, 32);

  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), png16);
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), png32);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico32);
}

// Generate immediately on module load
generateFaviconFiles();

export default defineConfig({
  plugins: [
    {
      name: 'generate-tvs-favicons',
      buildStart() {
        generateFaviconFiles();
      },
      configureServer() {
        generateFaviconFiles();
      }
    }
  ]
});
