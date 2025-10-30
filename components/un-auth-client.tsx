'use client';
import Link from 'next/link';

export default function UnauthorizedClient({
  message = 'Требуется вход',
}: {
  message?: string;
}) {
  return (
    <div className="p-6 text-center">
      <p className="mb-4 text-muted-foreground">{message}</p>
      <Link className="btn" href="/api/auth/signin">
        Войти
      </Link>
    </div>
  );
}
