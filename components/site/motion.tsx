'use client';

/**
 * Animation building blocks. Intensity comes from the theme's
 * "animation intensity" (off / subtle / playful); visitors with
 * prefers-reduced-motion always get no movement.
 */
import { animate, MotionConfig, motion, useInView, useReducedMotion, type Variants } from 'motion/react';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { MotionLevel } from '@/lib/theme/types';

const MotionLevelContext = createContext<MotionLevel>('subtle');

export function MotionProvider({ level, children }: { level: MotionLevel; children: ReactNode }) {
  return (
    <MotionLevelContext.Provider value={level}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </MotionLevelContext.Provider>
  );
}

/** 0 = no motion, 1 = subtle, 1.6 = playful. */
export function useMotionScale() {
  const level = useContext(MotionLevelContext);
  const reduced = useReducedMotion();
  if (reduced || level === 'off') return 0;
  return level === 'playful' ? 1.6 : 1;
}

/** Fades + slides children in when they scroll into view. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'article';
}) {
  const scale = useMotionScale();
  const Cmp = motion[as];
  if (scale === 0) return <Cmp className={className}>{children}</Cmp>;
  return (
    <Cmp
      className={className}
      initial={{ opacity: 0, y: y * scale }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Cmp>
  );
}

/** Container whose direct <StaggerItem> children animate in one after another. */
export function Stagger({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'ul' }) {
  const scale = useMotionScale();
  const Cmp = motion[as];
  const variants: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
  if (scale === 0) return <Cmp className={className}>{children}</Cmp>;
  return (
    <Cmp className={className} variants={variants} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}>
      {children}
    </Cmp>
  );
}

export function StaggerItem({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'li' }) {
  const scale = useMotionScale();
  const Cmp = motion[as];
  const variants: Variants = {
    hidden: { opacity: 0, y: 18 * scale, scale: scale ? 0.98 : 1 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };
  return (
    <Cmp className={className} variants={scale ? variants : undefined}>
      {children}
    </Cmp>
  );
}

/** Counts up from 0 when scrolled into view. */
export function Counter({ value, suffix = '', locale }: { value: number; suffix?: string; locale: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const scale = useMotionScale();
  const [shown, setShown] = useState(scale === 0 ? value : 0);
  const format = (n: number) => new Intl.NumberFormat(locale === 'ar' ? 'ar-QA' : 'en').format(Math.round(n));

  useEffect(() => {
    if (!inView || scale === 0) return;
    const controls = animate(0, value, { duration: 1.6, ease: 'easeOut', onUpdate: setShown });
    return () => controls.stop();
  }, [inView, value, scale]);

  return (
    <span ref={ref} className="tabular-nums">
      {format(scale === 0 ? value : shown)}
      {suffix}
    </span>
  );
}
