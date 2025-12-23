'use client';

import LogOutButton from '@/components/buttons/auth/log-out-btn';
import { WorkspaceLogo } from '@/components/ui/workspace-logo';
import LinkButton from '@/ui/button/link-button';
import { Session } from 'next-auth';

const Header = ({ session }: { session: Session | null }) => {
  return (
    <header className="flex justify-between mt-4 mb-4">
      <WorkspaceLogo />
      {session?.user && <LogOutButton />}
      {!session?.user && (
        <div className="flex gap-2">
          <LinkButton href="/login" text="Войти" />
          <LinkButton href="/register" text="Регистрация" />
        </div>
      )}
    </header>
  );
};

export default Header;
