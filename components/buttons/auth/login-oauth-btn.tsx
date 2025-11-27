'use client';

import { Button } from '@/components/ui/button';
import { ProviderId } from '@/lib/providers';
import { clientRoutes } from '@/lib/routes/client-routes';
import { signIn } from 'next-auth/react';

const LoginOauthButton = ({ provider }: { provider: ProviderId }) => {
  return (
    <Button
      onClick={() =>
        signIn(provider, { callbackUrl: clientRoutes.workspacesPage() })
      }
    >
      {/* {provider.charAt(0).toUpperCase() + provider.slice(1)} */}
      {provider}
    </Button>
  );
};

export default LoginOauthButton;
