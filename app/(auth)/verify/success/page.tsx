                              
'use client';

import LinkButton from '@/ui/button/link-button';
import { useSearchParams } from 'next/navigation';

export default function VerifySuccessPage() {
  const params = useSearchParams();
  const email = params.get('email');                               

  return (
    <main className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Email {email} подтверждён ✅</h1>
      <p className="mb-6">Теперь вы можете войти в свой аккаунт.</p>

      <LinkButton href="/login" text="Войти" />
    </main>
  );
}
