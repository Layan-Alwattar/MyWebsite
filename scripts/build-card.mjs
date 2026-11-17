/**
 * Builds Layan's business card (front + back) with a QR code that opens the
 * portfolio and starts the CV download.
 *
 *   node scripts/build-card.mjs
 *
 * Writes public/content/card/:
 *   layan-alwattar-card.pdf        print file, 2 pages, 85 × 55 mm + 3 mm bleed
 *   layan-alwattar-card-front.png  sharing images (4× resolution)
 *   layan-alwattar-card-back.png
 *
 * The QR code points to SITE_URL (default: the live site) + "/?cv"; the site
 * picks English or Arabic from the phone's language and downloads the CV.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import QRCode from 'qrcode';

const SITE = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://layanalwattar.netlify.app').replace(/\/$/, '');
const QR_TARGET = `${SITE}/?cv`;
const DOMAIN = SITE.replace(/^https?:\/\//, '');
const OUT_DIR = fileURLToPath(new URL('../public/content/card/', import.meta.url));

const BROWSERS = [
  process.env.CHROME_PATH,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

// Blush Pink theme.
const C = { bg: '#FFF7F9', primary: '#E05A8E', ink: '#2B1B2E', primaryInk: '#A8275E', secondary: '#B9A3F5', accent: '#FFB38A', muted: '#6E5A70' };

const icon = {
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z"/></svg>',
};

const qr = await QRCode.toString(QR_TARGET, { type: 'svg', margin: 0, errorCorrectionLevel: 'Q', color: { dark: C.ink, light: '#0000' } });

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@500;600;700&family=El+Messiri:wght@600&display=block');
:root { --bleed: 3mm; }
* { box-sizing: border-box; margin: 0; }
html, body { background: #fff; }
body { font-family: 'Plus Jakarta Sans', sans-serif; color: ${C.ink}; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
/* Page = card + bleed on every side; .safe keeps content 3 mm inside the trim. */
.card { position: relative; width: calc(85mm + 2 * var(--bleed)); height: calc(55mm + 2 * var(--bleed)); overflow: hidden; break-after: page; }
.safe { position: absolute; inset: calc(var(--bleed) + 3.5mm); }
.blob { position: absolute; border-radius: 50%; filter: blur(7mm); }
.front { background: ${C.bg}; }
.front .b1 { width: 38mm; height: 38mm; background: ${C.primary}; opacity: .30; top: -12mm; right: -6mm; }
.front .b2 { width: 34mm; height: 34mm; background: ${C.secondary}; opacity: .38; bottom: -16mm; left: 18mm; }
.front .b3 { width: 22mm; height: 22mm; background: ${C.accent}; opacity: .35; top: 20mm; right: 22mm; }
.name { font-family: 'Fraunces', serif; font-weight: 700; font-size: 17pt; line-height: 1; letter-spacing: -.01em; }
.name .hi { background: linear-gradient(90deg, ${C.primary}, ${C.secondary}); -webkit-background-clip: text; background-clip: text; color: transparent; }
.ar { font-family: 'El Messiri', sans-serif; font-size: 9pt; color: ${C.primaryInk}; margin-top: 1.2mm; }
.role { font-size: 6.6pt; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: ${C.primaryInk}; margin-top: 2.2mm; }
.contacts { position: absolute; left: 0; bottom: 0; display: grid; gap: 1.15mm; font-size: 6.4pt; font-weight: 600; }
.contacts div { display: flex; align-items: center; gap: 1.6mm; white-space: nowrap; }
.contacts svg { width: 2.7mm; height: 2.7mm; color: ${C.primaryInk}; flex: none; }
.polaroid { position: absolute; right: 0; bottom: 0; width: 23mm; padding: 1.6mm 1.6mm 3.6mm; background: #fff; border-radius: 1.2mm; transform: rotate(3deg);
  box-shadow: 0 .4mm 1mm rgba(43,27,46,.12), 0 2mm 5mm -1.5mm rgba(224,90,142,.35); }
.polaroid .qr { width: 100%; aspect-ratio: 1; }
.polaroid .qr svg { width: 100%; height: 100%; display: block; }
.polaroid p { font-family: 'Fraunces', serif; font-size: 5.6pt; text-align: center; margin-top: 1.3mm; color: ${C.primaryInk}; }
.washi { position: absolute; top: -2.2mm; left: 50%; width: 11mm; height: 4mm; transform: translateX(-50%) rotate(-4deg); opacity: .9;
  background: repeating-linear-gradient(45deg, ${C.accent} 0 1.2mm, #ffd3bd 1.2mm 2.4mm); }
.back { background: linear-gradient(135deg, ${C.primary} 0%, #c86fc4 48%, ${C.secondary} 100%); color: #fff; }
.back .b1 { width: 40mm; height: 40mm; background: ${C.accent}; opacity: .45; bottom: -18mm; right: -10mm; }
.back .b2 { width: 30mm; height: 30mm; background: #fff; opacity: .22; top: -14mm; left: -8mm; }
.back .safe { display: flex; align-items: center; gap: 5mm; }
.tile { flex: none; width: 33mm; height: 33mm; padding: 2.3mm; background: #fff; border-radius: 2.6mm; box-shadow: 0 2mm 6mm -2mm rgba(43,27,46,.45); }
.tile svg { width: 100%; height: 100%; display: block; }
.cta h2 { font-family: 'Fraunces', serif; font-size: 12.5pt; line-height: 1.12; font-weight: 700; }
.cta .ar { color: #fff; font-size: 8.6pt; margin-top: 1.6mm; line-height: 1.5; }
.cta .domain { margin-top: 2.6mm; display: inline-block; font-size: 6.2pt; font-weight: 700; letter-spacing: .02em; padding: .9mm 2.4mm; border-radius: 9mm; background: rgba(255,255,255,.22); }
.spark { position: absolute; color: #fff; opacity: .9; font-size: 7pt; }
.front .ar { text-align: left; }
`;

const front = `
<section class="card front">
  <div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div>
  <div class="safe">
    <div class="name"><span class="hi">Layan</span> Alwattar</div>
    <div class="ar" dir="rtl" lang="ar">ليان محمد الوتار</div>
    <div class="role">AI/ML &amp; Software Engineer</div>
    <div class="contacts">
      <div>${icon.globe}<span>${DOMAIN}</span></div>
      <div>${icon.mail}<span>alwattarlayan@gmail.com</span></div>
      <div>${icon.linkedin}<span>in/layanalwattar</span></div>
      <div>${icon.github}<span>Layan-Alwattar</span></div>
    </div>
    <div class="polaroid"><span class="washi"></span><div class="qr">${qr}</div><p>scan me ✿</p></div>
  </div>
</section>`;

const back = `
<section class="card back">
  <div class="blob b1"></div><div class="blob b2"></div>
  <span class="spark" style="top:7mm;right:9mm">✦</span><span class="spark" style="bottom:8mm;left:46mm;font-size:5pt">✦</span>
  <div class="safe">
    <div class="tile">${qr}</div>
    <div class="cta">
      <h2>See my work &amp; get my CV</h2>
      <div class="ar" dir="rtl" lang="ar">امسح الرمز لزيارة موقعي<br>وتحميل سيرتي الذاتية</div>
      <span class="domain">${DOMAIN}</span>
    </div>
  </div>
</section>`;

const page = (body, { bleed = true } = {}) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<style>${STYLE}${bleed ? '' : ':root{--bleed:0mm}'}
@page { size: calc(85mm + 2 * var(--bleed, 3mm)) calc(55mm + 2 * var(--bleed, 3mm)); margin: 0; }</style>
<style>@page { size: ${bleed ? '91mm 61mm' : '85mm 55mm'}; margin: 0; }</style></head><body>${body}</body></html>`;

const browser = BROWSERS.find((b) => existsSync(b));
if (!browser) throw new Error('No Chromium browser found. Set CHROME_PATH to Edge or Chrome.');

mkdirSync(OUT_DIR, { recursive: true });
const tmp = mkdtempSync(join(tmpdir(), 'card-'));
const run = (args, html) => {
  const file = join(tmp, `${Math.random().toString(36).slice(2)}.html`);
  writeFileSync(file, html);
  execFileSync(browser, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=8000', `--user-data-dir=${join(tmp, 'profile')}`, ...args, pathToFileURL(file).href], { stdio: 'ignore' });
};
try {
  run(['--no-pdf-header-footer', `--print-to-pdf=${join(OUT_DIR, 'layan-alwattar-card.pdf')}`], page(front + back));
  // Sharing images: trimmed card (no bleed). 85 × 55 mm ≈ 322 × 208 CSS px.
  for (const [side, html] of [['front', front], ['back', back]]) {
    run(['--force-device-scale-factor=4', '--window-size=322,208', `--screenshot=${join(OUT_DIR, `layan-alwattar-card-${side}.png`)}`], page(html, { bleed: false }));
  }
  console.log(`Card written to ${OUT_DIR}\nQR → ${QR_TARGET}`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
