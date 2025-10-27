'use client';
import { useRouter } from 'next/navigation';
import { Heading } from './ui/heading';

import LinkButton from './buttons/link-btn';
import GoBackButton from './buttons/go-back-btn';

const NotFound = ({ text }: { text: string }) => {
  const router = useRouter();
  return (
    <main className="flex flex-col gap-4 h-screen justify-center items-center">
      <div className="flex flex-col ">
        <Heading className="text-7xl text-primary-500">404</Heading>
        <div>{text} not found</div>
      </div>

      <div className="flex gap-2">
        <GoBackButton router={router} />
        <LinkButton href="/" text={`На главную`} />
      </div>
    </main>
  );
};

export default NotFound;
