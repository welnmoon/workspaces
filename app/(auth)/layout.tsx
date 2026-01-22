import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workspaces',
  description: "Manage your team's work in one space",
  icons: {
    icon: '/icons/metadata/w.png',
  },
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
