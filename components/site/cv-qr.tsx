import { Download, QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/site/dictionary';
import type { Settings } from '@/lib/site/data';
import { SITE_URL } from '@/lib/site/url';

/** The uploaded CV for this language, falling back to the other one. */
export function cvUrl(settings: Pick<Settings, 'cv_url'> | null, locale: Locale) {
  const cv = settings?.cv_url;
  return cv?.[locale] || cv?.en || cv?.ar || null;
}

/**
 * QR code that opens the CV on a phone. It encodes the stable /{locale}/cv
 * address (which redirects to the current file), so a printed code keeps
 * working after the CV is replaced in the admin.
 */
export async function CvQr({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const target = `${SITE_URL}/${locale}/cv`;
  // Always dark-on-white: inverted codes scan poorly on many phones.
  const svg = await QRCode.toString(target, {
    type: 'svg',
    margin: 1,
    errorCorrectionLevel: 'M',
    color: { dark: '#1f1a24', light: '#ffffff' },
  });

  return (
    <figure className="mt-8 flex max-w-sm items-center gap-4 rounded-theme bg-card p-4 shadow-sm">
      <div
        role="img"
        aria-label={dict.cvQrAlt}
        className="size-28 shrink-0 overflow-hidden rounded-[calc(var(--radius)*0.5)] bg-white p-1 [&_svg]:size-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <figcaption className="space-y-2">
        <p className="flex items-center gap-1.5 font-display text-lg text-fg">
          <QrCode size={18} aria-hidden className="text-primary-ink" /> {dict.cvQrTitle}
        </p>
        <p className="text-sm text-fg-muted">{dict.cvQrHint}</p>
        <a
          href={`/${locale}/cv`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-ink underline-offset-4 hover:underline"
        >
          <Download size={14} aria-hidden /> {dict.downloadCv}
        </a>
      </figcaption>
    </figure>
  );
}
