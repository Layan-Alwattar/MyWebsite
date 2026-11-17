'use client';

import { useEffect } from 'react';

/**
 * Visitors arriving from the business-card QR code (…/?cv) land on the site
 * and the CV starts downloading. The parameter is then removed so a refresh
 * or a shared link doesn't download again.
 */
export function CvAutoDownload({ href }: { href: string }) {
  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has('cv')) return;
    url.searchParams.delete('cv');
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);

    const target = new URL(href, window.location.href);
    const a = document.createElement('a');
    a.href = target.href;
    // `download` only applies to same-origin files; otherwise open it in a new tab.
    if (target.origin === window.location.origin) a.download = target.pathname.split('/').pop() || 'cv.pdf';
    else a.target = '_blank';
    a.rel = 'noopener';
    document.body.append(a);
    a.click();
    a.remove();
  }, [href]);

  return null;
}
