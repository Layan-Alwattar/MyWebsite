import type { Metadata, Viewport } from 'next';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { CursorGlow, SiteHeader, type NavItem } from '@/components/site/chrome';
import { MotionProvider } from '@/components/site/motion';
import { PreviewBanner, SiteFooter } from '@/components/site/ui';
import { isLocale, LOCALE_DIR, LOCALES, tr, type Locale } from '@/lib/i18n';
import { getActiveTheme, getSections, getSettings, getSocialLinks } from '@/lib/site/data';
import { getDictionary } from '@/lib/site/dictionary';
import { SITE_URL } from '@/lib/site/url';
import { themeToCss } from '@/lib/theme/css';
import { googleFontsUrl } from '@/lib/theme/fonts';
import '../globals.css';

// Unknown locales are rejected by isLocale() below (dynamicParams stays default so new slugs render on demand).
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFF7F9' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1220' },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const settings = await getSettings();
  const name = tr(settings?.full_name, locale) || 'Layan Alwattar';
  const title = tr(settings?.seo_title, locale) || name;
  const description = tr(settings?.seo_description, locale) || tr(settings?.tagline, locale);

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s · ${name}` },
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: { en: '/en', ar: '/ar', 'x-default': '/en' },
    },
    openGraph: {
      type: 'website',
      siteName: name,
      title,
      description,
      locale: locale === 'ar' ? 'ar_QA' : 'en_US',
      ...(settings?.og_image_url ? { images: [{ url: settings.og_image_url, width: 1200, height: 630 }] } : {}),
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

/** Runs before paint so dark-mode visitors never see a light flash. */
const THEME_INIT = `try{var t=localStorage.getItem('theme');if(t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches)document.documentElement.classList.add('dark')}catch(e){}`;

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const [theme, settings, sections, socials, { isEnabled: preview }] = await Promise.all([
    getActiveTheme(),
    getSettings(),
    getSections(),
    getSocialLinks(),
    draftMode(),
  ]);

  const name = tr(settings?.full_name, locale) || 'Layan Alwattar';
  const brand = name.split(' ')[0];
  const nav: NavItem[] = sections
    .filter((s) => s.visible && s.key !== 'hero')
    .map((s) => ({ href: `/${locale}#${s.key}`, label: tr(s.label, locale) }));

  const fontsHref = googleFontsUrl([theme.fonts.heading, theme.fonts.body, theme.fonts.headingAr, theme.fonts.bodyAr]);

  return (
    <html lang={locale} dir={LOCALE_DIR[locale]} data-motion={theme.motion_level} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        {/* Theme colors/fonts from the admin theme editor (values are validated & sanitized). */}
        <style dangerouslySetInnerHTML={{ __html: themeToCss(theme) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={fontsHref} />
      </head>
      <body className="site-body min-h-screen overflow-x-clip">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-card focus:px-5 focus:py-2.5 focus:font-semibold focus:text-fg focus:shadow-lg"
        >
          {dict.skipToContent}
        </a>
        {preview && <PreviewBanner dict={dict} path={`/${locale}`} />}
        <MotionProvider level={theme.motion_level}>
          <SiteHeader locale={locale} dict={dict} brand={brand} nav={nav} />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <SiteFooter name={name} links={socials} locale={locale} dict={dict} />
          {theme.cursor_glow && theme.motion_level !== 'off' && <CursorGlow />}
        </MotionProvider>
      </body>
    </html>
  );
}
