import { RootStats } from '@/app/page';
import { apiRoutes } from '@/lib/routes/api-routes';
import { useQuery } from '@tanstack/react-query';

export const useRootStats = () => {
  return useQuery({
    queryKey: ['root-stats'],
    queryFn: async () => {
      const response = await fetch(apiRoutes.getRootStats(), {
        next: { revalidate: 300 },
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch root stats');
      }

      const data: { data: RootStats } = await response.json();

      return data.data;
    },
    staleTime: 300000,
  });
};
