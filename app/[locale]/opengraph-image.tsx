import { ImageResponse } from 'next/og';
import { tr } from '@/lib/i18n';
import { getActiveTheme, getSettings } from '@/lib/site/data';

export const alt = 'Layan Alwattar — AI/ML & Software Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const revalidate = 3600;

/** Default social-share image, drawn in the active theme's colors. */
export default async function OpenGraphImage() {
  // The built-in OG font has no Arabic glyphs, so both languages share the English card.
  const locale = 'en';
  const [settings, theme] = await Promise.all([getSettings(), getActiveTheme()]);
  const c = theme.colors.light;
  const name = tr(settings?.full_name, locale) || 'Layan Alwattar';
  const headline = tr(settings?.headline, locale) || 'AI/ML & Software Engineer';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: c.bg,
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ position: 'absolute', top: -120, right: -80, width: 520, height: 520, borderRadius: 9999, background: c.primary, opacity: 0.45, filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: -160, left: -60, width: 480, height: 480, borderRadius: 9999, background: c.secondary, opacity: 0.4, filter: 'blur(60px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 30, color: c.primaryInk, fontWeight: 700 }}>
          <div style={{ width: 18, height: 18, borderRadius: 9999, background: c.primary }} />
          Portfolio
        </div>
        <div style={{ display: 'flex', fontSize: 84, fontWeight: 700, color: c.ink, marginTop: 20, lineHeight: 1.05 }}>{name}</div>
        <div style={{ display: 'flex', fontSize: 40, color: c.muted, marginTop: 24 }}>{headline}</div>
      </div>
    ),
    size,
  );
}
