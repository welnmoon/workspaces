import LoginForm from '@/components/forms/login/login-form';
import { authOptions } from '@/lib/auth';
import { Session } from 'next-auth';
import { UserService } from '@/lib/services/user';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { clientRoutes } from '@/lib/routes/client-routes';
import { RootHeading } from '@/components/root/root-heading';
import { WorkspaceLogo } from '@/components/ui/workspace-logo';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Workspaces',
  description: "Manage your team's work in one space",
  icons: {
    icon: '/icons/metadata/w.png',
  },
};

const LoginPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    returnTo?: string | string[];
    reason?: string | string[];
    from?: string | string[];
  }>;
}) => {
  const { returnTo, reason, from } = await searchParams;
  const normalizeOrigin = (value?: string) => {
    if (!value) return undefined;
    try {
      return new URL(value).origin;
    } catch {
      return undefined;
    }
  };
  const normalizeParam = (value?: string | string[]) =>
    Array.isArray(value) ? value[0] : value;
  const normalizeReturnTo = (value?: string) => {
    const trimmed = value?.trim();
    if (!trimmed) return undefined;
    if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return undefined;
    return trimmed;
  };
  const rawReturnTo = normalizeParam(returnTo);
  const rawFrom = normalizeParam(from);
  const spaOrigin = normalizeOrigin(process.env.VITE_URL);
  const safeFrom = normalizeReturnTo(rawFrom);
  const safeSpaReturnTo =
    safeFrom && spaOrigin ? new URL(safeFrom, spaOrigin).toString() : safeFrom;
  const safeReturnTo =
    safeSpaReturnTo ||
    normalizeReturnTo(rawReturnTo) ||
    clientRoutes.workspacesPage();
  const safeReason = normalizeParam(reason);
  const session = (await getServerSession(authOptions)) as Session | null;
  if (session?.user?.id) {
    const existingUser = await UserService.getUserById(session.user.id);
    if (existingUser) {
      redirect(safeReturnTo);
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
              <WorkspaceLogo className="text-white" />

              <div className="flex-1 flex flex-col justify-center items-center text-center">
                <RootHeading
                  level={3}
                  className="font-semibold leading-tight w-2/3"
                >
                  Управляйте задачами, проектами и командами в одном месте
                </RootHeading>
              </div>

              <div className="text-slate-100 text-sm italic mt-auto">
                <p>
                  «Нет ничего бесполезнее, чем эффективно делать то, что вообще
                  не должно было быть сделано.» {safeReturnTo}
                </p>
                <p className="mt-1">— Питер Друкер</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <LoginForm reason={safeReason} from={safeFrom} returnTo={safeReturnTo} />
    </main>
  );
};

export default LoginPage;
