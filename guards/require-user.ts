import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth/next';
import { UserService } from '@/lib/services/user';
import { AppError } from '@/lib/errors';
import { Session } from 'next-auth';
import { markUserOnline } from '@/helpers/mark-user-online';

export type SessionUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
};

export async function requireUser(): Promise<SessionUser> {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (!session?.user?.id) {
    throw new AppError(401, 'UNAUTHORIZED', 'Unauthorized');
  }

  const dbUser = await UserService.getUserById(session.user.id);
  if (!dbUser) {
    throw new AppError(401, 'UNAUTHORIZED', 'Unauthorized');
  }

  markUserOnline(session.user.id).catch((err) => console.error(err));

  return session.user as SessionUser;
}
