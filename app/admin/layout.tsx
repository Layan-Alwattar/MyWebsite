import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic, Plus_Jakarta_Sans } from 'next/font/google';
import '../globals.css';

// Root layout for the admin portal (the public site has its own under app/[locale]).
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' });
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s · Admin' },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${plexArabic.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
