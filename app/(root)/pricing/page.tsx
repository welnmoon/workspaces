'use client';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { tariffs } from '@/const/tariffs';
import { useStripePayment } from '@/hooks/payment/use-stripe-payment';
import { clientRoutes } from '@/lib/routes/client-routes';
import { cn } from '@/lib/utils';
import { TariffDTO } from '@/types/prisma/DTO/payment';
import { Check } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

export default function PricingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const pathname = usePathname();

  // const searchParams = useSearchParams();
  // const wId = Number(searchParams.get('workspaceId'));
  // const wName = searchParams.get('workspaceName');

  const tariffKeys = Object.keys(tariffs) as TariffDTO[];

  const { mutate: payWithStripe, isPending: isStripePending } =
    useStripePayment();

  return (
    <section className="py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <Heading level={1} className="mb-8">
          Тарифы
        </Heading>
        {/* <Description text={`Простанрство: ${wName}, id: ${wId}`} /> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tariffKeys.map((key) => {
            const t = tariffs[key];

            return (
              <div
                key={key}
                className="rounded-xl border p-6 shadow-sm bg-white flex flex-col"
              >
                <h3 className="text-2xl font-semibold mb-2">{t.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{t.description}</p>

                <div className="mb-6">
                  {t.amount === 0 ? (
                    <p className="text-4xl font-bold">Бесплатно</p>
                  ) : (
                    <p className="text-4xl font-bold">
                      {t.amount.toLocaleString('ru-RU')}{' '}
                      <span className="text-xl font-medium">{t.currency}</span>
                    </p>
                  )}
                </div>

                <ul className="mt-2 list-inside list-none space-y-2">
                  {tariffs.FREE.features.map((f) => (
                    <li key={f.label}>
                      <f.icon className="w-4 h-4 mr-2 inline text-amber-600" />
                      {f.label}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => {
                    if (!userId) {
                      const returnTo = `${pathname}?tariff=${key}`;
                      router.push(clientRoutes.authLoginPage(returnTo));
                      return;
                    }
                    // payWithCloudPayments(key, email, userId, {
                    //   onComplete(success) {
                    //     if (success) {
                    //       window.location.href = clientRoutes.workspacesPage();
                    //     }
                    //   },
                    // });
                    payWithStripe({ tariff: key });
                  }}
                  disabled={t.amount === 0 || isStripePending}
                  className={cn(
                    'mt-auto w-full text-center text-white rounded-lg py-2 transition',
                    t.name === 'Free' && 'bg-zinc-700',
                    t.name !== 'Free' && 'bg-zinc-900 hover:bg-zinc/800'
                  )}
                >
                  {t.name === 'Free' ? (
                    <>
                      Выбрано <Check />
                    </>
                  ) : (
                    'Выбрать'
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
