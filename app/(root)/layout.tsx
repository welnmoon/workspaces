import Container from '@/components/container';
import Header from '@/components/layout/header/header';
import Footer from '@/components/root/main/footer';
import { authOptions } from '@/lib/auth';
import type { Metadata } from 'next';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';

export const metadata: Metadata = {
  title: 'Workspaces',
  description: "Manage your team's work in one space",
  icons: {
    icon: '/icons/metadata/w.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = (await getServerSession(authOptions)) as Session | null;

  return (
    <Container>
      <Header session={session} />
      {children}
      <Footer />
    </Container>
  );
}
