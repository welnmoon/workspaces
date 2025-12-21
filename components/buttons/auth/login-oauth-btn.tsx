'use client';

import { Button } from '@/components/ui/button';
import type { ReactNode } from 'react';
import { ProviderId } from '@/lib/providers';
import { clientRoutes } from '@/lib/routes/client-routes';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

const providerConfig: Record<ProviderId, { label: string; icon: ReactNode }> = {
  google: {
    label: 'Google',
    icon: <FcGoogle className="h-5 w-5" />,
  },
  github: {
    label: 'GitHub',
    icon: <FaGithub className="h-5 w-5" />,
  },
};

const LoginOauthButton = ({ provider }: { provider: ProviderId }) => {
  const config = providerConfig[provider];

  return (
    <Button
      type="button"
      variant="outline"
      className="flex-1 min-w-[200px] justify-center gap-2 border-slate-200 bg-white text-slate-900 hover:bg-slate-100"
      onClick={() => signIn(provider, { callbackUrl: clientRoutes.workspacesPage() })}
    >
      {config?.icon}
      Войти через {config?.label ?? provider}
    </Button>
  );
};

export default LoginOauthButton;

