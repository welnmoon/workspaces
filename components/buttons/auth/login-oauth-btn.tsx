'use client';

import { Button } from '@/components/ui/button';
import { ProviderId } from '@/lib/providers';
import { clientRoutes } from '@/lib/routes/client-routes';
import { cn } from '@/lib/utils';
import { signIn } from 'next-auth/react';

const LoginOauthButton = ({ provider }: { provider: ProviderId }) => {
  return (
    <Button
      className={cn(
        '',
        provider === 'github' && 'bg-zinc-800',
        provider === 'google' && 'bg-white text-zinc-800 hover:bg-zinc-100'
      )}
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
