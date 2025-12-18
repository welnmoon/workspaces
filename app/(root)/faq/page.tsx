import FAQPage from '@/components/root/main/faq/faq-page';
import { Breadcrumbs } from '@/components/bread-crumbs';

export default function FAQRoute() {
  return (
    <main className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'FAQ' }]} />
      <FAQPage />
    </main>
  );
}
