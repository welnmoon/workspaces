'use client';

import { Session } from 'next-auth';
import WorknestLogotype from '../ui/worknest-logotype';
import LogOutButton from '../buttons/auth/log-out-btn';
import LoginButton from '../buttons/auth/login-btn';
import RegisterButton from '../buttons/auth/register-btn.';

const Header = ({ session }: { session: Session | null }) => {
  return (
    <header className="flex justify-between mt-4 mb-4">
      <WorknestLogotype />
      {session?.user && <LogOutButton />}
      {!session?.user && (
        <div className="flex gap-2">
          <LoginButton />
          <RegisterButton />
        </div>
      )}
    </header>
  );
};

export default Header;
