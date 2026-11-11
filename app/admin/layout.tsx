import { IBM_Plex_Sans_Arabic, Plus_Jakarta_Sans } from 'next/font/google';

// Fonts for the admin portal (the public site loads its theme fonts separately).
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' });
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex-arabic',
  display: 'swap',
});

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${jakarta.variable} ${plexArabic.variable} font-sans`}>{children}</div>;
}
