import { fetchProfile } from '@/lib/fetch-fns/fetch-profile';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useEditProfile(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: unknown) => {
      const res = await fetchProfile({ userId, method: 'PUT', body: payload });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    },
  });
}
