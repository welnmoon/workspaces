import { apiRoutes } from '@/lib/routes/api-routes';
import { useQuery } from '@tanstack/react-query';

export const useProfile = (userId: string) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const response = await fetch(apiRoutes.getUser(userId));
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
