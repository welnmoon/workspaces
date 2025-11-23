import LoginForm from '@/components/forms/login/login-form';
import { authOptions } from '@/lib/auth';
import { clientRoutes } from '@/lib/routes/client-routes';
import { UserService } from '@/lib/services/user';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

// sign in - это вход
const LoginPage = async () => {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    const existingUser = await UserService.getUserById(session.user.id);
    if (existingUser) {
    redirect(clientRoutes.workspacesPage());
    }
  }
  return <LoginForm />;
};

export default LoginPage;
