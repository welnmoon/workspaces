import LoginForm from '@/components/forms/login/login-form';
import { authOptions } from '@/lib/auth';
import { Session } from 'next-auth';
import { UserService } from '@/lib/services/user';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { clientRoutes } from '@/lib/routes/client-routes';

// sign in - это вход
const LoginPage = async () => {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (session?.user?.id) {
    const existingUser = await UserService.getUserById(session.user.id);
    if (existingUser) {
      redirect(clientRoutes.workspacesPage());
    }
  }
  return <LoginForm />;
};

export default LoginPage;
