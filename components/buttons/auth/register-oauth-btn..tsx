'use client';

import { Button } from '@/components/ui/button';
import { ProviderId } from '@/lib/providers';
import { signIn } from 'next-auth/react';

const RegisterOauthButton = ({ provider }: { provider: ProviderId }) => {
  return (
    <section>
      <Button onClick={() => signIn(provider)}>
        
        {provider}
      </Button>
    </section>
  );
};

export default RegisterOauthButton;
