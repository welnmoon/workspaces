'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';

const LoginButton = () => {
  return (
    <section>
      <Button onClick={() => signIn('google')}>Войти</Button>
    </section>
  );
};

export default LoginButton;
