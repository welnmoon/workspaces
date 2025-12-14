import { parseErrorResponse } from '@/helpers/parse-error-response';
import { apiRoutes } from '@/lib/routes/api-routes';
import { UserActivity } from '@/types/prisma/DTO/projects';
import { useQuery } from '@tanstack/react-query';

export const useUserActivity = (
  wId: number,
  pId: number,
  from?: string,
  to?: string
) => {
  return useQuery({
    queryKey: ['tasks', wId, pId, from, to],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      const url = `${apiRoutes.getUserActivity(wId, pId)}?${params.toString()}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw await parseErrorResponse(res);
      }
      const data = await res.json();

      return data.data as UserActivity;
    },
  });
};
