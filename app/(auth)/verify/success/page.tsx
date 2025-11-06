// app/verify/success/page.tsx
'use client';

import LinkButton from '@/components/buttons/link-btn';
import LoginForm from '@/components/forms/login/login-form';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export default function VerifySuccessPage() {
  const params = useSearchParams();
  const email = params.get('email'); // если передашь email в query

  return (
    <main className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Email подтверждён ✅</h1>
      <p className="mb-6">Теперь вы можете войти в свой аккаунт.</p>

      <LinkButton href="/login" text="Войти" />
    </main>
  );
}
