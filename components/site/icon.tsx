/**
 * Renders a lucide icon by its name from the admin ("graduation-cap",
 * "brain"…). Server component only, so the full icon map never reaches
 * the browser bundle.
 */
import { icons, Sparkles, Mail, Globe, type LucideProps } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/icons/brand';

const toPascal = (name: string) =>
  name
    .trim()
    .split(/[-_\s]+/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');

export function Icon({ name, fallback = Sparkles, ...props }: Omit<LucideProps, 'name'> & { name?: string | null; fallback?: typeof Sparkles }) {
  const Cmp = (name && icons[toPascal(name) as keyof typeof icons]) || fallback;
  return <Cmp aria-hidden {...props} />;
}

/** Icon for a social platform. */
export function SocialIcon({ platform, size = 18 }: { platform: string; size?: number }) {
  if (platform === 'github') return <GithubIcon size={size} />;
  if (platform === 'linkedin') return <LinkedinIcon size={size} />;
  if (platform === 'email') return <Mail size={size} aria-hidden />;
  return <Icon name={platform} fallback={Globe} size={size} />;
}
