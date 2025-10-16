import prisma from '@/lib/prisma';

import UnAuth from '@/components/profile/un-auth';
import AddAccounts from '@/components/profile/add-accounts';
import { Heading } from '@/components/ui/heading';
import { requireUser } from '@/helpers/require-user';
import type { SessionUser } from '@/helpers/require-user';

const ProfilePage = async () => {
  let sessionUser: SessionUser;
  try {
    sessionUser = await requireUser();
  } catch (error) {
    return <UnAuth />;
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    include: {
      accounts: true,
      memberships: {
        include: { workspace: true },
      },
    },
  });

  if (!user) {
    return <UnAuth />;
  }

  const accountProviders = user.accounts.map((a) => a.provider);

  return (
    <>
      <header>
        <Heading level={1}>Профиль</Heading>
      </header>

      <main>
        <article>
          <header>
            <h2>{user.firstName || 'Без имени'}</h2>
            <p>{user.email}</p>
          </header>

          <footer>
            <button>Редактировать профиль</button>
          </footer>
        </article>

        <section>
          <Heading level={2}>Аккаунты</Heading>
          {user.accounts.length > 0 ? (
            <ul>
              {user.accounts.map((acc) => (
                <li key={acc.id}>
                  <strong>{acc.provider}</strong> — {acc.providerAccountId}
                </li>
              ))}
            </ul>
          ) : (
            <p>Нет подключённых аккаунтов</p>
          )}

          <AddAccounts accountProviders={accountProviders} />
        </section>

        <section>
          <Heading level={2}>Ваши Workspace:</Heading>
          {user.memberships.map((m) => m.workspace.name)}
        </section>
      </main>
    </>
  );
};

export default ProfilePage;
