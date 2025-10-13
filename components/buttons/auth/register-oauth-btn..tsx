'use client';

import { Button } from '@/components/ui/button';
import { ProviderId } from '@/lib/providers';
import { signIn } from 'next-auth/react';

const RegisterOauthButton = ({ provider }: { provider: ProviderId }) => {
  return (
    <section>
      <Button onClick={() => signIn(provider)}>
        {/* {provider.charAt(0).toUpperCase() + provider.slice(1)} */}
        {provider}
      </Button>
    </section>
  );
};

export default RegisterOauthButton;
