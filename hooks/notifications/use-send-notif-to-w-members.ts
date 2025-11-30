import { AppError } from '@/lib/errors';
import { apiRoutes } from '@/lib/routes/api-routes';
import { SendNotificationToWMembersSchema } from '@/schemas/notification/send-notification-to-w-members-schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useSendNotificationToWMembers = (
  userId: string,
  workspaceId: number
) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, body }: SendNotificationToWMembersSchema) => {
      const res = await fetch(
        apiRoutes.sendNotificationsToWMembers(workspaceId),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: title, body: body }),
        }
      );

      if (!res.ok)
        throw new AppError(
          500,
          'SEND_NOTIFICATION_ERROR',
          'Failed to send notification'
        );

      return await res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications', userId] });
    },
  });
};
