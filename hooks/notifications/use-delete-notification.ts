import { AppError } from '@/lib/errors';
import { apiRoutes } from '@/lib/routes/api-routes';
import { NotificationFullDTO } from '@/types/prisma/DTO/notification';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useHiddenNotification = (userId: string) => {
  const qr = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(apiRoutes.hiddenNotification(userId, id), {
        method: 'DELETE',
      });

      if (!res.ok)
        throw new AppError(
          500,
          'CANT_DELETE',
          'Не удалось удалить notification'
        );

      return id;
    },
    onMutate: async (id: number) => {
      await qr.cancelQueries({ queryKey: ['notifications', userId] });

      const previousData = qr.getQueryData<NotificationFullDTO[]>([
        'notifications',
        userId,
      ]);

      qr.setQueryData<NotificationFullDTO[]>(
        ['notifications', userId],
        (old) => old?.filter((n) => n.id !== id) || old
      );

                            
      return { previousData };
    },
    onError: (error, _id, context) => {
      if (context?.previousData) {
        qr.setQueryData(['notifications', userId], context.previousData);
      }
    },
    onSettled: () =>
      qr.invalidateQueries({ queryKey: ['notifications', userId] }),
  });
};
