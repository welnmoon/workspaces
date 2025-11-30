import { AppError } from '@/lib/errors';
import { apiRoutes } from '@/lib/routes/api-routes';
import { NotificationFullDTO } from '@/types/prisma/DTO/notification';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useMarkReadNotification = (userId: string) => {
  const qr = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(apiRoutes.markReadNotification(userId, id), {
        method: 'PATCH',
      });

      if (!res.ok)
        throw new AppError(
          500,
          'MARK_READ_NOTIFICATION_ERROR',
          'Failed to mark notification as read'
        );

      return id;
    },
    // Optimistic UI
    onMutate: async (id: number) => {
      await qr.cancelQueries({ queryKey: ['notifications', userId] });

      const previousData = qr.getQueryData<NotificationFullDTO[]>([
        'notifications',
        userId,
      ]);

      qr.setQueryData<NotificationFullDTO[]>(
        ['notifications', userId],
        (old) =>
          old ? old.map((n) => (n.id === id ? { ...n, isRead: true } : n)) : old
      );

      // context for onError
      return { previousData };
    },
    onError: (_error, _id, context) => {
      if (context?.previousData) {
        qr.setQueryData(['notifications', userId], context.previousData);
      }
    },
    onSettled: () => {
      qr.invalidateQueries({ queryKey: ['notifications', userId] });
    },
  });
};
