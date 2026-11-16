/**
 * Turn a photo into a pencil sketch or a cartoon, entirely in the browser
 * (no image ever leaves the device except the result you choose to upload).
 */

export type ImageStyle = 'sketch' | 'cartoon';

const MAX_SIDE = 1400;

async function loadImage(url: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.decoding = 'async';
  img.src = url;
  await img.decode();
  return img;
}

/** Separable box blur on a single channel (running sums, O(n) per pass). */
function boxBlur(src: Float32Array, w: number, h: number, r: number): Float32Array {
  const tmp = new Float32Array(src.length);
  const out = new Float32Array(src.length);
  const size = r * 2 + 1;
  for (let y = 0; y < h; y++) {
    const row = y * w;
    let sum = 0;
    for (let i = -r; i <= r; i++) sum += src[row + Math.min(w - 1, Math.max(0, i))];
    for (let x = 0; x < w; x++) {
      tmp[row + x] = sum / size;
      sum += src[row + Math.min(w - 1, x + r + 1)] - src[row + Math.max(0, x - r)];
    }
  }
  for (let x = 0; x < w; x++) {
    let sum = 0;
    for (let i = -r; i <= r; i++) sum += tmp[Math.min(h - 1, Math.max(0, i)) * w + x];
    for (let y = 0; y < h; y++) {
      out[y * w + x] = sum / size;
      sum += tmp[Math.min(h - 1, y + r + 1) * w + x] - tmp[Math.max(0, y - r) * w + x];
    }
  }
  return out;
}

/** Pencil lines in 0..1 (1 = paper, lower = darker stroke): grayscale "color dodge" with its blurred inverse. */
function pencil(gray: Float32Array, w: number, h: number): Float32Array {
  const radius = Math.max(2, Math.round(Math.max(w, h) / 110));
  const inv = new Float32Array(gray.length);
  for (let i = 0; i < gray.length; i++) inv[i] = 255 - gray[i];
  const blur = boxBlur(boxBlur(inv, w, h, radius), w, h, radius);
  const lines = new Float32Array(gray.length);
  for (let i = 0; i < gray.length; i++) {
    const dodge = Math.min(255, (gray[i] * 255) / Math.max(1, 255 - blur[i]));
    lines[i] = Math.pow(dodge / 255, 2.2); // deepen strokes a little
  }
  return lines;
}

/** Applies the style in place to RGBA pixels (pure; no DOM needed). */
export function stylizePixels(px: Uint8ClampedArray, w: number, h: number, style: ImageStyle) {
  const n = w * h;
  const gray = new Float32Array(n);
  for (let i = 0; i < n; i++) gray[i] = 0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2];
  const lines = pencil(gray, w, h);

  if (style === 'sketch') {
    // Graphite on warm paper.
    const paper = [253, 250, 246];
    const ink = [52, 44, 58];
    for (let i = 0; i < n; i++) {
      const t = lines[i];
      px[i * 4] = ink[0] + (paper[0] - ink[0]) * t;
      px[i * 4 + 1] = ink[1] + (paper[1] - ink[1]) * t;
      px[i * 4 + 2] = ink[2] + (paper[2] - ink[2]) * t;
    }
  } else {
    // Cartoon: smooth + posterize the colors, then lay the pencil lines on top.
    const r = Math.max(2, Math.round(Math.max(w, h) / 150));
    const channels = [0, 1, 2].map((c) => {
      const ch = new Float32Array(n);
      for (let i = 0; i < n; i++) ch[i] = px[i * 4 + c];
      return boxBlur(boxBlur(ch, w, h, r), w, h, r);
    });
    const levels = 6;
    const step = 255 / (levels - 1);
    for (let i = 0; i < n; i++) {
      // Flatten brightness into bands but keep each area's own color, so
      // whites stay white (per-channel banding turns camera noise into blotches).
      const r0 = channels[0][i];
      const g0 = channels[1][i];
      const b0 = channels[2][i];
      const luma = 0.299 * r0 + 0.587 * g0 + 0.114 * b0;
      const banded = Math.max(step * 0.5, Math.round(luma / step) * step);
      const k = banded / Math.max(1, luma);
      const edge = lines[i] < 0.55 ? 0.25 : Math.min(1, lines[i] * 1.08);
      px[i * 4] = Math.min(255, r0 * k) * edge;
      px[i * 4 + 1] = Math.min(255, g0 * k) * edge;
      px[i * 4 + 2] = Math.min(255, b0 * k) * edge;
    }
  }

}

/** Returns a new WebP file in the chosen style. */
export async function stylizeImage(url: string, style: ImageStyle, name: string): Promise<File> {
  const img = await loadImage(url);
  const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.round(img.naturalWidth * scale);
  const h = Math.round(img.naturalHeight * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('This browser cannot edit images.');
  ctx.fillStyle = '#fff'; // transparent PNGs get a paper background
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);

  const data = ctx.getImageData(0, 0, w, h);
  stylizePixels(data.data, w, h, style);
  ctx.putImageData(data, 0, 0);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.9));
  if (!blob) throw new Error('Could not create the image.');
  const base = name.replace(/\.[a-z0-9]+$/i, '');
  return new File([blob], `${base}-${style}.webp`, { type: 'image/webp' });
}
