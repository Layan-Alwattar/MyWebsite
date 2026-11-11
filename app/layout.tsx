import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Layan Mohammad Alwattar | AI/ML Engineer',
  description: 'Premium developer portfolio for AI/ML and software engineering roles.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
