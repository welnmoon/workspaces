import { apiRoutes } from '@/lib/routes/api-routes';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAcceptInvitation = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      workspaceId,
      invId,
    }: {
      workspaceId: number;
      invId: number;
    }) => {
      const res = await fetch(
        apiRoutes.acceptInvitationById(workspaceId, invId),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!res.ok) throw new Error('Failed to accept invitation');

      return undefined;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations', userId] });
    },
  });
};
