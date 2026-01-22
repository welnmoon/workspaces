import FAQPage from '@/components/root/main/faq/faq-page';
import { Breadcrumbs } from '@/components/bread-crumbs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workspaces',
  description: "Manage your team's work in one space",
  icons: {
    icon: '/icons/metadata/w.png',
  },
};

export default function FAQRoute() {
  return (
    <main className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'FAQ' }]} />
      <FAQPage />
    </main>
  );
}
