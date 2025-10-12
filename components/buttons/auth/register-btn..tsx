import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';

const RegisterButton = () => {
  return (
    <Button onClick={() => signIn('google', { callbackUrl: '/' })}>
      Регистрация
    </Button>
  );
};

export default RegisterButton;
