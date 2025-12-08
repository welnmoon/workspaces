import { parseErrorResponse } from '@/helpers/parse-error-response';
import { apiRoutes } from '@/lib/routes/api-routes';
import { NotificationPages } from '@/types/notification-pages';
import { useQuery } from '@tanstack/react-query';

type Props = {
  limit: number;
  pageNumber: number;
};
export const useNotificationPages = (
  userId: string,
  { limit, pageNumber }: Props
) => {
  return useQuery({
    queryKey: ['notificationPages', userId],
    queryFn: async () => {
      const res = await fetch(apiRoutes.getNotificationPages(userId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit, pageNumber }),
      });
      if (!res.ok) throw await parseErrorResponse(res);
      const data = await res.json();
      return data.data as NotificationPages;
    },
  });
};
