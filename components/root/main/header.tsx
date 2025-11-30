'use client';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { navSections } from '@/const/root-navigation';
import { Heading } from '@/components/ui/heading';
import { WorkspaceLogo } from '@/components/ui/workspace-logo';
import { AuthButtons } from '../buttons/auth-btns';

export function RootNavigationMenu() {
  return (
    <header className="grid grid-cols-[1fr_auto_1fr]">
      <WorkspaceLogo className="justify-self-start" />
      <div className="relative flex w-full justify-center pt-6 text-sm leading-[1.5]">
        <NavigationMenu>
          <NavigationMenuList>
            {navSections.map((section) => (
              <NavigationMenuItem key={section.title}>
                <NavigationMenuTrigger>{section.title}</NavigationMenuTrigger>
                <NavigationMenuContent className="flex w-[260px] gap-2 p-4 md:w-[320px] lg:w-[360px]">
                  {section.title === 'Продукт' && (
                    <div className="w-1/2 px-3 py-2 rounded-md flex flex-col gap-2 bg-zinc-50">
                      <Heading level={4} className="font-semibold">
                        Workspaces 2.0
                      </Heading>
                      <p className="text-xs text-muted-foreground leading-snug">
                        Обновлённая навигация, интеграции и умные дашборды в
                        одном месте.
                      </p>
                      <Link
                        href="/product"
                        className="text-xs text-blue-600 font-medium hover:underline"
                      >
                        Узнать больше →
                      </Link>
                    </div>
                  )}
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
      <AuthButtons className="justify-self-end"/>
    </header>
  );
}
