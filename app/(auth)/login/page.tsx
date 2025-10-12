import LoginForm from '@/components/forms/login/login-from';
import { signIn } from 'next-auth/react';

// sign in - это вход
const LoginPage = () => {
  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
