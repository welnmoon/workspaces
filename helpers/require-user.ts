import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export type SessionUser = {
  id: string;
  email?: string | null;
  name?: string | null;
};

export async function requireUser(): Promise<SessionUser> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    // server actions / route handlers поймают и вернут 401 по месту
    throw new Error('Unauthorized');
  }
  return session.user as SessionUser;
}
