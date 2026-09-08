'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Flame, FolderOpen, CheckCircle2, Users, Search, Settings } from 'lucide-react';
import clsx from 'clsx';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/new', label: 'New', icon: Flame },
  { href: '/categories', label: 'Categories', icon: FolderOpen },
  { href: '/done', label: 'Done', icon: CheckCircle2 },
  { href: '/prophets', label: 'Prophets', icon: Users },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/settings', label: 'Settings', icon: Settings }
];

export function NavShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Desktop left rail */}
      <aside className="hidden md:flex md:w-56 md:flex-col border-r border-border px-4 py-6 gap-1 shrink-0">
        <div className="mb-6 px-2">
          <p className="font-display text-xl leading-tight">Prophecy Radar</p>
          <p className="text-xs text-ink-muted mt-1">Nigeria prophecy watch</p>
        </div>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'focus-ring flex items-center gap-3 rounded-card px-3 py-2 text-sm transition-colors',
                active ? 'bg-base-raised text-ink' : 'text-ink-muted hover:text-ink hover:bg-base-raised/60'
              )}
            >
              <Icon size={18} strokeWidth={1.8} />
              {label}
            </Link>
          );
        })}
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <main className="pb-24 md:pb-8">{children}</main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-base-raised border-t border-border flex justify-around py-2 z-40">
        {NAV_ITEMS.slice(0, 5).map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={clsx('focus-ring flex flex-col items-center gap-0.5 px-2 py-1 text-[11px]', active ? 'text-signal-gold' : 'text-ink-muted')}
            >
              <Icon size={20} strokeWidth={1.8} />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
