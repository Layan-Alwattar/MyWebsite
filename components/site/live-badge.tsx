import { cn } from '@/lib/cn';

/**
 * Small "happening now" pill with a softly pulsing dot (the pulse stops for
 * visitors who prefer reduced motion). Dependency-free so client components
 * can use it too.
 */
export function LiveBadge({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800',
        'dark:bg-emerald-950/60 dark:text-emerald-200',
        className,
      )}
    >
      <span aria-hidden className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70 motion-reduce:animate-none" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
      </span>
      {label}
    </span>
  );
}
