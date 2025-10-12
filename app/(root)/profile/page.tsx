import AddAccounts from '@/components/profile/add-accounts';
import UnAuth from '@/components/profile/un-auth';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';

const ProfilePage = async () => {
  const session = await getServerSession();
  if (!session) {
    return <UnAuth />;
  }
  const accounts = await prisma.account.findMany({
    where: {
      userId: Number(session?.user?.id),
    },
  });

  const accountProviders = accounts.map((a) => a.provider);
  return (
    <>
      <header>Профиль</header>

      <main>
        <article>
          <header>
            <h2>Иван Петров</h2>
            <p>Разработчик фронтенда</p>
          </header>

          <section>
            <h3>О себе</h3>
            <p>Люблю React и TypeScript, работаю в Next Pizza.</p>
          </section>

          <section>
            <h3>Контакты</h3>
            <ul>
              <li>Email: ivan@example.com</li>
              <li>Телефон: +7 700 123 4567</li>
            </ul>
          </section>

          <footer>
            <button>Редактировать профиль</button>
          </footer>
        </article>

        <AddAccounts accountProviders={accountProviders}/>
      </main>
    </>
  );
};

export default ProfilePage;
