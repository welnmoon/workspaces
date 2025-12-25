import { ProviderId } from '@/lib/providers';
import { apiRoutes } from '@/lib/routes/api-routes';
export const disconnect = async (provider: ProviderId) => {
  const res = await fetch(apiRoutes.deleteUserAccount(provider), {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) throw new Error('Failed to disconnect');

  return res;
};
