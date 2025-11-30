import { apiRoutes } from '@/lib/routes/api-routes';
import { NotificationFullDTO } from '@/types/prisma/DTO/notification';
import { useQuery } from '@tanstack/react-query';

export const useNotifications = (userId: string) => {
  return useQuery({
    queryKey: ['notifications', userId],
    initialData: [],
    queryFn: async () => {
      const res = await fetch(apiRoutes.getNotifications(userId), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to fetch notifications');
      const data = await res.json();
      return data.data as NotificationFullDTO[];
    },
  });
};
