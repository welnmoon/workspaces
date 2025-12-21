'use client';

import Link from 'next/link';
import { WorkspaceLogo } from '@/components/ui/workspace-logo';
import { AuthButtons } from '../buttons/auth-btns';
import { navSections } from '@/const/root-navigation';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export function RootNavigationMenu() {
  return (
    <header className="flex items-center justify-between gap-3">
      <WorkspaceLogo />

      {/* Desktop nav */}
      <div className="hidden lg:flex flex-1 justify-center">
        <NavigationMenu>
          <NavigationMenuList>
            {navSections.map((section) => (
              <NavigationMenuItem key={section.title}>
                <NavigationMenuTrigger>{section.title}</NavigationMenuTrigger>
                <NavigationMenuContent className="flex gap-2 p-4 w-max">
                  <ul className="flex-1 list-none">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={link.href}
                            className="block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            {link.label}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Right side desktop */}
      <div className="hidden lg:flex items-center gap-2">
        <AuthButtons />
      </div>

      {/* Mobile controls */}
      <div className="lg:hidden flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Открыть меню">
              <Menu />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-[320px]">
            <nav className="mt-6 space-y-6 px-6 overflow-y-auto pb-6">
              <div className="items-center gap-2 border-b pb-4">
                <AuthButtons />
              </div>
              {navSections.map((section) => (
                <div key={section.title} className="space-y-2">
                  <p className="text-sm font-semibold">{section.title}</p>
                  <ul className="space-y-1">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
