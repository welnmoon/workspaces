'use client';

import BaseLink from '@/components/base-link';
import RegisterForm from '@/components/forms/register/register-form';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

// sign up - это регистрация

const RegisterPage = () => {
  return (
    <div>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
