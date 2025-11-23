import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { markUserOnline } from './mark-user-online';
import { UserService } from '@/lib/services/user';

export type SessionUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
};

export class UnauthorizedError extends Error {
  status = 401;
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export async function requireUser(): Promise<SessionUser> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new UnauthorizedError();
  }

   const dbUser = await UserService.getUserById(session.user.id);
   if (!dbUser) {
     throw new UnauthorizedError('User not found');
   }

  markUserOnline(session.user.id).catch((err) => console.error(err));

  return session.user as SessionUser;
}
