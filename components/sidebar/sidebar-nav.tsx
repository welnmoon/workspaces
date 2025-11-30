'use client';

import { NAV_LINKS } from '@/const/navigation';
import Link from 'next/link';

export function RenderNavigation() {
  return (
    <ul className="flex flex-col gap-2">
      {NAV_LINKS.map(({ label, href, icon: Icon }) => (
        <li key={label}>
          <Link
            href={href}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-500 transition hover:bg-zinc-100"
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
