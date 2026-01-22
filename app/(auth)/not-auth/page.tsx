import LinkButton from '@/ui/button/link-button';
import { Heading } from '@/components/ui/heading';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workspaces',
  description: "Manage your team's work in one space",
  icons: {
    icon: '/icons/metadata/w.png',
  },
};

const NotAuthPage = () => {
  return (
    <>
      <Heading level={1}>Вас нет в системе</Heading>
      <LinkButton href="/register" text="Зарегистрироваться" />
    </>
  );
};

export default NotAuthPage;
