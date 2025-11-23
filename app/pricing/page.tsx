'use client';

import { Button } from '@/components/ui/button';
import { payWithCloudPayments, tariffs } from '@/lib/payments/cloudpayments';
import { clientRoutes } from '@/lib/routes/client-routes';
import { TariffDTO } from '@/types/prisma/DTO/payment';
import { useSession } from 'next-auth/react';

export default function PricingPage() {
  const email = useSession().data?.user.email;

  const tariffKeys = Object.keys(tariffs) as TariffDTO[];

  return (
    <section className="py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Выберите тариф</h2>

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

                <ul className="space-y-2 mb-8 text-gray-700">
                  {t.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-green-600">✔</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() =>
                    payWithCloudPayments(key, email, {
                      onComplete(success) {
                        if (success) {
                          window.location.href = clientRoutes.workspacesPage();
                        }
                      },
                    })
                  }
                  className="mt-auto w-full text-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 transition"
                >
                  Выбрать
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
