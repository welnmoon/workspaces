'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

import { Toaster } from 'react-hot-toast';
const RootProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <I18nextProvider i18n={i18n}>
      <Toaster />
      {children}
    </I18nextProvider>
  );
};

export default RootProviders;
