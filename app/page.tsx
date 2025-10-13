import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <h1 className="text-2xl">{session?.user.name}</h1>
      <p className="text-2xl"> Manrope</p>
    </div>
  );
}
