'use client';

import { signOut } from 'next-auth/react';
import { Button } from '../../ui/button';
import { redirect } from 'next/navigation';

const LogOutButton = () => {
  return (
    <Button
      onClick={() => {
        signOut();
        redirect('/');
      }}
    >
      Выйти
    </Button>
  );
};

export default LogOutButton;
