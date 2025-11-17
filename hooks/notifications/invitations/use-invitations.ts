import { apiRoutes } from '@/lib/routes/api-routes';
import {
  InvitationDTO,
  ReceivedInvitationDTO,
} from '@/types/prisma/DTO/invitations';
import { useQuery } from '@tanstack/react-query';

export const useInvitations = (userId: string) => {
  return useQuery({
    queryKey: ['invitations', userId],
    queryFn: async () => {
      const res = await fetch(apiRoutes.getReceivedInvitations(userId), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to fetch invitations');
      const data = await res.json();
      return data.data as ReceivedInvitationDTO[];
    },
    initialData: [],
  });
};
