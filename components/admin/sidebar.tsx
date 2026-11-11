'use client';

import {
  Award,
  BarChart3,
  BookOpenText,
  Brush,
  ExternalLink,
  FolderKanban,
  GraduationCap,
  Images,
  Inbox,
  LayoutDashboard,
  LayoutList,
  Link2,
  LogOut,
  Menu,
  Sparkles,
  Tags,
  UserRound,
  X,
  LineChart,
  Layers,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/cn';

type NavItem = { href: string; label: string; icon: typeof Award };

const NAV: { heading: string; items: NavItem[] }[] = [
  {
    heading: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/messages', label: 'Messages', icon: Inbox },
    ],
  },
  {
    heading: 'Content',
    items: [
      { href: '/admin/settings', label: 'Hero & About', icon: UserRound },
      { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
      { href: '/admin/project-categories', label: 'Project categories', icon: Tags },
      { href: '/admin/skills', label: 'Skills', icon: Sparkles },
      { href: '/admin/skill-categories', label: 'Skill categories', icon: Layers },
      { href: '/admin/certificates', label: 'Courses & certificates', icon: Award },
      { href: '/admin/posts', label: 'Reflections', icon: BookOpenText },
      { href: '/admin/timeline', label: 'Education & achievements', icon: GraduationCap },
      { href: '/admin/analyses', label: 'Data & analysis', icon: LineChart },
      { href: '/admin/social-links', label: 'Social links', icon: Link2 },
    ],
  },
  {
    heading: 'Library',
    items: [
      { href: '/admin/charts', label: 'Chart builder', icon: BarChart3 },
      { href: '/admin/media', label: 'Media', icon: Images },
    ],
  },
  {
    heading: 'Design',
    items: [
      { href: '/admin/theme', label: 'Theme', icon: Brush },
      { href: '/admin/sections', label: 'Homepage sections', icon: LayoutList },
    ],
  },
];

export function Sidebar({
  email,
  unread,
  signOut,
}: {
  email: string;
  unread: number;
  signOut: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href));

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-line bg-white px-4 py-3 lg:hidden">
        <span className="font-semibold">Portfolio Admin</span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="rounded-lg p-2 hover:bg-blush-100"
        >
          <Menu size={20} />
        </button>
      </div>

      {open && <div className="fixed inset-0 z-30 bg-ink/30 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} aria-hidden />}

      <aside
        className={cn(
          'fixed inset-y-0 start-0 z-40 flex w-72 flex-col border-e border-line bg-white transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/admin" className="flex items-center gap-2 font-semibold" onClick={() => setOpen(false)}>
            <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-blush-400 to-[#b9a3f5] text-sm text-white">
              L
            </span>
            Portfolio Admin
          </Link>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-lg p-1.5 hover:bg-blush-100 lg:hidden">
            <X size={18} />
          </button>
        </div>

        <nav aria-label="Admin" className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
          {NAV.map((section) => (
            <div key={section.heading}>
              <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-widest text-muted">{section.heading}</p>
              <ul className="space-y-0.5">
                {section.items.map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive(href) ? 'page' : undefined}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
                        isActive(href) ? 'bg-blush-100 text-blush-800' : 'text-muted hover:bg-blush-50 hover:text-ink',
                      )}
                    >
                      <Icon size={17} aria-hidden />
                      <span className="flex-1">{label}</span>
                      {href === '/admin/messages' && unread > 0 && (
                        <span className="rounded-full bg-blush-600 px-2 py-0.5 text-[11px] font-bold text-white">
                          {unread}
                          <span className="sr-only"> unread</span>
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="space-y-1 border-t border-line p-3">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted hover:bg-blush-50 hover:text-ink">
            <ExternalLink size={17} aria-hidden /> View site
          </a>
          <form action={signOut}>
            <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted hover:bg-blush-50 hover:text-ink">
              <LogOut size={17} aria-hidden /> Sign out
            </button>
          </form>
          <p className="truncate px-3 pt-1 text-xs text-muted" title={email}>
            {email}
          </p>
        </div>
      </aside>
    </>
  );
}
