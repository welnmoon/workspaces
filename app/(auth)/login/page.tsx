import LoginForm from '@/components/forms/login/login-form';
import { authOptions } from '@/lib/auth';
import { Session } from 'next-auth';
import { UserService } from '@/lib/services/user';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { clientRoutes } from '@/lib/routes/client-routes';
import { RootHeading } from '@/components/root/root-heading';
import { WorkspaceLogo } from '@/components/ui/workspace-logo';
import Image from 'next/image';

// sign in - это вход
const LoginPage = async () => {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (session?.user?.id) {
    const existingUser = await UserService.getUserById(session.user.id);
    if (existingUser) {
      redirect(clientRoutes.workspacesPage());
    }
  }
  return (
    <main className="min-h-screen flex bg-slate-50">
      <section className="relative hidden lg:flex w-1/2 min-h-screen rounded-xl overflow-hidden">
        <div className="absolute w-full inset-0 p-4 pr-0">
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            <Image
              src="/images/auth/login-astro.jpeg"
              alt="Workflows preview"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 0px"
              className="object-cover"
            />

            <div className="absolute w-full inset-0 bg-gradient-to-br from-indigo-900/40 via-indigo-800/30 to-slate-900/20 pointer-events-none" />

            <div className="absolute inset-0 z-10 flex flex-col p-8 text-white">
              {/* Лого сверху */}
              <WorkspaceLogo className="text-white" />

              {/* Контейнер для заголовка и цитаты */}
              <div className="flex-1 flex flex-col justify-center items-center text-center">
                <RootHeading
                  level={3}
                  className="font-semibold leading-tight w-2/3"
                >
                  Управляйте задачами, проектами и командами в одном месте
                </RootHeading>
              </div>

              {/* Цитата снизу */}
              <div className="text-slate-100 text-sm italic mt-auto">
                <p>
                  «Нет ничего бесполезнее, чем эффективно делать то, что вообще
                  не должно было быть сделано.»
                </p>
                <p className="mt-1">— Питер Друкер</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <LoginForm />
    </main>
  );
};

export default LoginPage;
