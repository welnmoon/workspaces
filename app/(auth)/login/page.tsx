import BaseLink from '@/components/base-link';
import LoginForm from '@/components/forms/login/login-form';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

// sign in - это вход
const LoginPage = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect('/profile');
  }
  return <LoginForm />;
};

export default LoginPage;
