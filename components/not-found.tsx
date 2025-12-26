'use client';
import { usePathname, useRouter } from 'next/navigation';
import { Heading } from './ui/heading';

import LinkButton from '@/ui/button/link-button';
import { GoBackButton } from '@/ui/navigation/go-back-button';

const NotFound = ({ text }: { text?: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const displayText = text ?? pathname ?? '';

  return (
    <main className="flex flex-col gap-4 min-h-dvh justify-center items-center px-4 text-center">
      <div className="flex flex-col justify-center items-center gap-2">
        <Heading className="text-7xl text-primary-500">404</Heading>
        <div className="text-lg text-muted-foreground">
          Страница{' '}
          <span className="font-semibold text-foreground break-all">
            {displayText || 'не найдена'}
          </span>{' '}
          недоступна.
        </div>
      </div>

      <div className="flex gap-2 flex-wrap justify-center items-center">
        <GoBackButton router={router} />
        <LinkButton href="/" text="На главную" />
      </div>
    </main>
  );
};

export default NotFound;
