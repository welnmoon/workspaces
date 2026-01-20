import { apiRoutes } from '@/lib/routes/api-routes';
import { useQuery } from '@tanstack/react-query';
import { UserProfileDTO } from '@/types/prisma/DTO/user';

type ProfileResponse = {
  data?: UserProfileDTO | null;
};

export const useProfile = (userId: string) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const response = await fetch(apiRoutes.getUser(userId), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const json = (await response.json()) as ProfileResponse;
      if (!json.data) {
        throw new Error('Profile not found');
      }

      return json.data;
    },
    staleTime: 1000 * 60 * 5,             
  });
};
