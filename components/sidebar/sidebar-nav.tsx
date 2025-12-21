'use client';

import { NAV_LINKS } from '@/const/navigation';
import Link from 'next/link';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, LogOut, UserRound } from 'lucide-react';
import { LogoutConfirmDialog } from '../dialogs/profile/logout-confirm-dialog';

export function RenderNavigation() {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const itemClass =
    'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-500 transition hover:bg-zinc-100';

  return (
    <>
      <ul className="flex flex-col gap-2">
        {NAV_LINKS.map(({ label, href, icon: Icon }) => {
          if (label === 'Профиль') {
            return (
              <li key={label}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className={`${itemClass} text-left`}>
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{label}</span>
                      <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[200px]">
                    <DropdownMenuItem asChild>
                      <Link href={href} className="flex items-center gap-2">
                        <UserRound className="h-4 w-4" /> Перейти в профиль
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={(event) => {
                        event.preventDefault();
                        setLogoutDialogOpen(true);
                      }}
                      className="text-rose-500 focus:text-rose-600"
                    >
                      <LogOut className="h-4 w-4" /> Выйти
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            );
          }

          return (
            <li key={label}>
              <Link href={href} className={itemClass}>
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <LogoutConfirmDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        description="Вы уверены, что хотите выйти?"
      />
    </>
  );
}

