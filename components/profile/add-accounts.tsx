'use client';

import { Heading } from '../ui/heading';
import { PROVIDERS } from '@/lib/providers';
import { signIn } from 'next-auth/react';
import { Button } from '../ui/button';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

const AddAccounts = ({ accountProviders }: { accountProviders: string[] }) => {
  const availableProviders = PROVIDERS.filter(
    (p) => !accountProviders.includes(p.id)
  );

  return (
    <section>
      <Heading level={2} className="mb-2">
        Добавить аккаунты
      </Heading>

      {availableProviders.length === 0 ? (
        <p>Все поддерживаемые провайдеры уже подключены</p>
      ) : (
        <ul className="flex gap-2">
          {availableProviders.map((provider) => (
            <li key={provider.id}>
              <Button
                className="bg-muted border border-foreground-muted hover:bg-foreground-muted/15 text-foreground hover:text-foreground-muted"
                key={provider.id}
                type="button"
                onClick={() => signIn(provider.id, { callbackUrl: '/profile' })}
              >
                Подключить {provider.name}
                {provider.id === 'google' && <FcGoogle />}
                {provider.id === 'github' && <FaGithub />}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default AddAccounts;
