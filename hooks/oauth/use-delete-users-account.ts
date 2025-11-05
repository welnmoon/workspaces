'use client';

import { disconnect } from '@/lib/fetch-fns/oauth/disconnect';
import { AccountFullDTO } from '@/types/prisma/DTO/account';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export const useDeleteUsersAccount = () => {
  const { data } = useSession();
  const userId = data?.user.id;
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (account: AccountFullDTO) => {
      const res = await disconnect(account.provider);
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
              : data?.error || text || 'Failed to delete account';
          throw new Error(message);
        } catch {
          throw new Error(text || 'Failed to delete account');
        }
      }
      return undefined;
    },
    onError: () => {
      toast.error('Не удалось отвязать аккаунт');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile', userId] });
    },
  });
};
