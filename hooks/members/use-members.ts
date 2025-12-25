import { AppError } from '@/lib/errors';
import { apiRoutes } from '@/lib/routes/api-routes';
import { MembershipSelectUserDTO } from '@/types/prisma/DTO/memberships';
import { useQuery } from '@tanstack/react-query';

export const useMembers = (workspaceId: number, projectId: number) => {
  return useQuery({
    queryKey: ['members', workspaceId, projectId],
    queryFn: async () => {
      const response = await fetch(
        apiRoutes.getMembers(workspaceId, projectId),
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const parsed = await response.text().then((t) => {
        try {
          return t ? JSON.parse(t) : null;
        } catch {
          return null;
        }
      });
      if (!response.ok) {
        const message =
          parsed?.message ||
          parsed?.error ||
          response.statusText ||
          'Failed to get members';
        const code = parsed?.code ?? 'GET_MEMBERS_ERROR';
        throw new AppError(500, code, message);
      }

      const data = (parsed as { data?: MembershipSelectUserDTO[] })?.data;
      return (Array.isArray(data) ? data : (parsed as MembershipSelectUserDTO[] | null)) ?? [];
    },
  });
};
