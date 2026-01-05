import { TariffKey } from '@/const/tariffs';
import { parseErrorResponse } from '@/helpers/parse-error-response';
import { apiRoutes } from '@/lib/routes/api-routes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useStripePayment = () => {
  return useMutation({
    mutationFn: async ({ tariff }: { tariff: TariffKey }) => {
      const res = await fetch(apiRoutes.stripeCheckout(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tariff }),
      });

      if (!res.ok) {
        throw await parseErrorResponse(res);
      }

      const data = (await res.json()) as { url: string };
      return data.url;
    },
    onSuccess: (url) => {
      window.location.href = url;
    },
    onError: (err) => {
      toast.error(`Ошибка при создании сессии оплаты: ${err?.message}`);
    },
  });
};
