'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
const RootProviders = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) => {
  return (
    <I18nextProvider i18n={i18n}>
      <SessionProvider session={session}>
        <Toaster />
        {children}
      </SessionProvider>
    </I18nextProvider>
  );
};

export default RootProviders;
