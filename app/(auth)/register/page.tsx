'use client';

import RegisterForm from '@/components/forms/register/register-form';
import { signIn } from 'next-auth/react';

// sign up - это регистрация

const RegisterPage = () => {
  return (
    <div>
      <RegisterForm />
      <button onClick={() => signIn('google', { callbackUrl: '/' })}>
        Sign in
      </button>
    </div>
  );
};

export default RegisterPage;
