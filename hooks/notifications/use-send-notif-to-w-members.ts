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

      if (!res.ok) {
        const isJson = res.headers
          .get('content-type')
          ?.includes('application/json');
        const payload = isJson ? await res.json().catch(() => null) : null;
        const message =
          payload?.message ||
          (isJson ? 'Не получилось отправить уведомление' : await res.text());
        const code =
          payload?.code || 'SEND_NOTIFICATION_TO_WORKSPACE_MEMBERS_ERROR';

        throw new AppError(res.status || 500, code, message);
      }

      return await res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications', userId] });
    },
  });
};
