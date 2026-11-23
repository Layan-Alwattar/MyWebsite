/**
 * Builds the downloadable CV (English + Arabic PDFs) from the same content
 * as the website, so the two never drift apart.
 *
 *   node scripts/build-cv.mjs
 *
 * Writes public/content/cv/layan-alwattar-cv-{en,ar}.pdf using a headless
 * Chromium browser (Microsoft Edge or Google Chrome). Set CHROME_PATH to use
 * a specific browser. The phone number is left out on purpose: the PDF is public.
 *
 *   node scripts/build-cv.mjs --it
 *
 * Builds the private IT-support version instead (general Al Arqam duties,
 * phone number, small website QR code) into private-assets/cv/, which is
 * gitignored and never published.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import QRCode from 'qrcode';
import * as c from '../supabase/seed/content.mjs';

const IT = process.argv.includes('--it');
const OUT_DIR = fileURLToPath(new URL(IT ? '../private-assets/cv/' : '../public/content/cv/', import.meta.url));
const SITE = 'https://layanalwattar.netlify.app';

/**
 * Overrides for the IT-department application, kept in the gitignored
 * private-assets/cv/it-cv.json (it holds the phone number).
 * Shape: { phone, headline, summary, arqam: { when, bullets }, education: { org, body } }.
 */
const IT_CV = IT ? JSON.parse(readFileSync(new URL('../private-assets/cv/it-cv.json', import.meta.url), 'utf8')) : null;

const BROWSERS = [
  process.env.CHROME_PATH,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

const T = {
  en: {
    summary: 'Profile',
    experience: 'Experience',
    education: 'Education',
    projects: 'Selected projects',
    awards: 'Awards & activities',
    certificates: 'Certifications & training',
    skills: 'Skills',
    present: 'Present',
  },
  ar: {
    summary: 'نبذة',
    experience: 'الخبرات',
    education: 'التعليم',
    projects: 'مشاريع مختارة',
    awards: 'الإنجازات والأنشطة',
    certificates: 'الشهادات والدورات',
    skills: 'المهارات',
    present: 'حتى الآن',
  },
};

// Projects shown on the CV, in this order (the rest stay on the website).
const CV_PROJECTS = [
  'eventura',
  'sadeeq-npc-datathon',
  'brain-tumor-classification',
  'multi-tenant-bilingual-platform',
  'video-game-sales-predictor',
  'kalimati',
];
// Timeline entries that already appear as projects or certificates.
const SKIP_TIMELINE = new Set(['eventura-capstone', 'deans-list', 'high-school']);
// Certificates already covered by an experience/award entry, or too minor for the CV.
const SKIP_CERTS = new Set([
  'qu-ysc-research-excellence-2024',
  'npc-microsoft-datathon-2025',
  'ai-week-2025-organizer',
  'shatharat-summer-program-2023',
  'shell-intilaaqah-2026',
  'sap-exploring-cloud-erp', // both listed on the SAP diploma
  'sap-rise-methodology',
  'note-taking-workshop',
  'ielts-preparation-workshop',
  'ielts-writing-task-1',
  'srip-2026-participation', // already under Experience
  'deans-list-recognition-day-volunteer-2023',
  'tomer-turkish-a1', // listed under Skills → Languages
]);

const esc = (v = '') => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** Strip the light markdown used in content.mjs down to plain text. */
const plain = (v = '') => v.replace(/\*\*/g, '').replace(/^## .*$/gm, '').replace(/^- /gm, '').replace(/\s+/g, ' ').trim();
const firstPara = (v = '') => plain(v.split(/\n\s*\n/)[0]);
const pick = (v, l) => (v && (v[l] || v.en)) || '';

function month(iso, l) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00Z');
  return new Intl.DateTimeFormat(l === 'ar' ? 'ar-QA-u-nu-latn' : 'en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(d);
}
function range(item, l) {
  const label = pick(item.date_label, l);
  if (label) return label;
  const a = month(item.start_date, l);
  const b = item.is_current ? T[l].present : month(item.end_date, l);
  return a && b && a !== b ? `${a} – ${b}` : a || b;
}

function entry({ title, org, when, body, bullets = [], tags = [] }) {
  return `<article class="entry">
  <header><h3>${esc(title)}${org ? ` <span class="org">· ${esc(org)}</span>` : ''}</h3>${when ? `<span class="when">${esc(when)}</span>` : ''}</header>
  ${body ? `<p>${esc(body)}</p>` : ''}
  ${bullets.length ? `<ul>${bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
  ${tags.length ? `<p class="tags" dir="ltr">${tags.map(esc).join(' · ')}</p>` : ''}
</article>`;
}

function render(l, qrSvg = '') {
  const s = c.settings;
  const t = T[l];
  const timeline = c.timeline.filter((x) => !SKIP_TIMELINE.has(x.key));
  let experience = timeline.filter((x) => x.kind === 'experience');
  // The IT version leads with the IT role.
  if (IT) experience = [...experience.filter((x) => x.key === 'al-arqam-it'), ...experience.filter((x) => x.key !== 'al-arqam-it')];
  const education = c.timeline.filter((x) => x.kind === 'education');
  const awards = timeline.filter((x) => x.kind === 'achievement');
  const projects = CV_PROJECTS.map((slug) => c.projects.find((p) => p.slug === slug)).filter(Boolean);
  const certs = c.certificates.filter((x) => x.status === 'published' && !SKIP_CERTS.has(x.slug));
  const contacts = [
    ...(IT ? [['Phone', IT_CV.phone, `tel:${IT_CV.phone.replace(/\s/g, '')}`]] : []),
    ['Email', 'alwattarlayan@gmail.com', 'mailto:alwattarlayan@gmail.com'],
    ['LinkedIn', 'linkedin.com/in/layanalwattar', 'https://www.linkedin.com/in/layanalwattar'],
    ['GitHub', 'github.com/Layan-Alwattar', 'https://github.com/Layan-Alwattar'],
  ];

  return `<!doctype html>
<html lang="${l}" dir="${l === 'ar' ? 'rtl' : 'ltr'}">
<head>
<meta charset="utf-8">
<title>${esc(pick(s.full_name, l))} — CV</title>
<style>
  @page { size: A4; margin: 11mm 14mm; }
  :root { --ink: #2a2230; --muted: #6b6070; --accent: #c13a73; --soft: #fbeef4; }
  * { box-sizing: border-box; }
  body { margin: 0; font: 9.3pt/1.4 "Segoe UI", "Noto Sans", "Noto Sans Arabic", Tahoma, sans-serif; color: var(--ink); }
  h1 { font-size: 23pt; margin: 0; letter-spacing: ${l === 'ar' ? '0' : '-0.01em'}; }
  .headline { color: var(--accent); font-weight: 600; font-size: 11.5pt; margin: 2px 0 6px; }
  .contacts { color: var(--muted); font-size: 8.8pt; display: flex; flex-wrap: wrap; gap: 4px 14px; }
  .contacts a { color: inherit; text-decoration: none; }
  .top { border-bottom: 2px solid var(--soft); padding-bottom: 8px; margin-bottom: 8px; }
  h2 { break-after: avoid; font-size: 10.5pt; text-transform: ${l === 'ar' ? 'none' : 'uppercase'}; letter-spacing: ${l === 'ar' ? '0' : '0.08em'}; color: var(--accent); margin: 9px 0 4px; padding-bottom: 2px; border-bottom: 1px solid #f0d9e4; }
  .entry { margin: 0 0 5px; break-inside: avoid; }
  .entry header { display: flex; justify-content: space-between; gap: 10px; align-items: baseline; }
  h3 { font-size: 9.9pt; margin: 0; }
  .org { font-weight: 400; color: var(--muted); }
  .when { color: var(--muted); font-size: 8.6pt; white-space: nowrap; }
  p { margin: 1px 0; }
  ul { margin: 2px 0 0; padding-inline-start: 15px; }
  li { margin: 0; }
  .tags { color: var(--muted); font-size: 8.4pt; }
  .skills p { margin: 0 0 2px; }
  .skills b { color: var(--ink); }
  .certs { columns: 2; column-gap: 18px; margin: 0; padding-inline-start: 15px; }
  .certs li { break-inside: avoid; }
  [dir='rtl'] .tags { text-align: right; }
  [dir='rtl'] .contacts { justify-content: flex-end; }
  .top.has-qr { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
  .qr { text-align: center; color: var(--muted); font-size: 6.8pt; line-height: 1.2; flex: none; }
  .qr svg { width: 17mm; height: 17mm; display: block; margin: 0 auto 1px; }
</style>
</head>
<body>
  <section class="top${qrSvg ? ' has-qr' : ''}">
    <div>
    <h1>${esc(pick(s.full_name, l))}</h1>
    <p class="headline">${esc(pick(IT ? IT_CV.headline : s.headline, l))} · ${esc(pick(s.location, l))}</p>
    <p class="contacts" dir="ltr">${contacts.map(([, label, href]) => `<a href="${href}">${esc(label)}</a>`).join('')}</p>
    </div>
    ${qrSvg ? `<a class="qr" href="${SITE}/${l}" style="text-decoration:none;color:inherit">${qrSvg}${l === 'ar' ? 'موقعي' : 'Portfolio'}</a>` : ''}
  </section>

  <h2>${t.summary}</h2>
  <p>${esc(pick(IT ? IT_CV.summary : s.tagline, l))}</p>

  <h2>${t.experience}</h2>
  ${experience
    .map((x) => {
      const o = IT && x.key === 'al-arqam-it' ? IT_CV.arqam : null;
      return entry({
        title: pick(x.title, l),
        org: pick(x.organization, l),
        when: o ? pick(o.when, l) : range(x, l),
        body: o ? '' : pick(x.description, l),
        bullets: (o ? o.bullets : x.highlights ?? []).map((h) => pick(h, l)),
      });
    })
    .join('\n')}

  <h2>${t.education}</h2>
  ${education
    .map((x) =>
      entry({
        title: pick(x.title, l),
        org: pick(IT && x.key === 'qu-bsc' ? IT_CV.education.org : x.organization, l),
        when: range(x, l),
        body: pick(IT && x.key === 'qu-bsc' ? IT_CV.education.body : x.description, l),
        bullets: (x.highlights ?? []).map((h) => pick(h, l)),
      }),
    )
    .join('\n')}

  <h2>${t.projects}</h2>
  ${projects
    .map((p) =>
      entry({
        title: pick(p.title, l),
        org: pick(p.label, l),
        body: plain(pick(p.summary, l)) || firstPara(pick(p.description, l)),
        tags: (p.tools ?? []).slice(0, 7),
      }),
    )
    .join('\n')}

  <h2>${t.awards}</h2>
  ${awards
    .map((x) => entry({ title: pick(x.title, l), org: pick(x.organization, l), when: range(x, l), body: pick(x.description, l) }))
    .join('\n')}

  <h2>${t.certificates}</h2>
  <ul class="certs">
    ${certs
      .map((x) => `<li><b>${esc(pick(x.title, l))}</b> — ${esc(pick(x.provider, l))}${x.issued_on ? ` (${esc(month(x.issued_on, l))})` : ''}</li>`)
      .join('\n')}
  </ul>

  <h2>${t.skills}</h2>
  <div class="skills">
    ${c.skillCategories
      .map((cat) => {
        const names = cat.skills.map((sk) => (Array.isArray(sk) ? (l === 'ar' ? sk[1] : sk[0]) : sk));
        return `<p><b>${esc(pick(cat.name, l))}:</b> ${esc(names.join(' · '))}</p>`;
      })
      .join('\n')}
  </div>
</body>
</html>`;
}

/** Wait until the browser has finished writing the file (size stops changing). */
async function waitForFile(file, timeoutMs = 60000) {
  const start = Date.now();
  let last = -1;
  while (Date.now() - start < timeoutMs) {
    const size = existsSync(file) ? statSync(file).size : -1;
    if (size > 0 && size === last) return;
    last = size;
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Timed out waiting for ${file}`);
}

const browser = BROWSERS.find((b) => existsSync(b));
if (!browser) throw new Error('No Chromium browser found. Set CHROME_PATH to Edge or Chrome.');

mkdirSync(OUT_DIR, { recursive: true });
const tmp = mkdtempSync(join(tmpdir(), 'cv-'));
try {
  for (const l of ['en', 'ar']) {
    const html = join(tmp, `cv-${l}.html`);
    const pdf = join(OUT_DIR, `layan-alwattar-cv-${IT ? 'it-' : ''}${l}.pdf`);
    const qr = IT ? await QRCode.toString(`${SITE}/${l}`, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#2a2230', light: '#0000' } }) : '';
    writeFileSync(html, render(l, qr.replace(/^<\?xml[^>]*>/, '')));
    rmSync(pdf, { force: true });
    execFileSync(browser, [
      '--headless=new',
      '--disable-gpu',
      '--no-pdf-header-footer',
      `--user-data-dir=${join(tmp, 'profile')}`,
      `--print-to-pdf=${pdf}`,
      pathToFileURL(html).href,
    ]);
    // Newer Edge builds hand the job to a background process and return early.
    await waitForFile(pdf);
    console.log('Wrote', pdf);
  }
} finally {
  try {
    rmSync(tmp, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 });
  } catch {
    // The browser may still hold its profile lock; the OS temp cleaner will get it.
  }
}
