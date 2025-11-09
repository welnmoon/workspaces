import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

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
    // server actions / route handlers поймают и вернут 401 по месту
    throw new UnauthorizedError();
  }
  return session.user as SessionUser;
}
