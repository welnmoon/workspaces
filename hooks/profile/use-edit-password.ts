import { apiRoutes } from '@/lib/routes/api-routes';
import { useMutation } from '@tanstack/react-query';
import { PasswordChangeSchemaDTO } from '@/schemas/auth/passwrod-change-schema';

export function useEditPassword() {
  return useMutation({
    mutationFn: async (payload: PasswordChangeSchemaDTO) => {
      const res = await fetch(apiRoutes.changeUserPassword(), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.status === 204) {
        return;
      }

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        try {
          const data = JSON.parse(text);
          const message =
            typeof data?.message === 'string'
              ? data.message
              : data?.error || text || 'Failed to update password';
          throw new Error(message);
        } catch {
          throw new Error(text || 'Failed to update password');
        }
      }

      return undefined;
    },
  });
}
