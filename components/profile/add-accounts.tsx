'use client';

import { Heading } from '../ui/heading';
import { PROVIDERS } from '@/lib/providers';
import { signIn } from 'next-auth/react';

const AddAccounts = ({ accountProviders }: { accountProviders: string[] }) => {
  const availableProviders = PROVIDERS.filter(
    (p) => !accountProviders.includes(p.id)
  );

  return (
    <section>
      <Heading level={2}>Добавить аккаунты</Heading>

      {availableProviders.length === 0 ? (
        <p>Все поддерживаемые провайдеры уже подключены</p>
      ) : (
        <ul>
          {availableProviders.map((provider) => (
            <li key={provider.id}>
              <button
                type="button"
                onClick={() => signIn(provider.id, { callbackUrl: '/profile' })}
              >
                Подключить {provider.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default AddAccounts;
