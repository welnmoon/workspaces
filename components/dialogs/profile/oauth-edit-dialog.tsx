'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { LinkIcon } from 'lucide-react';
import { AccountFullDTO } from '@/types/prisma/DTO/account';
import { disconnect } from '@/lib/fetch-fns/oauth/disconnect';
import toast from 'react-hot-toast';
import { useDeleteUsersAccount } from '@/hooks/oauth/use-delete-users-account';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';

const OAuthEditDialog = ({
  countOfAccounts,
  hasPassword,
  setEditOAuth,
  open,
  account,
}: {
  setEditOAuth: Dispatch<SetStateAction<boolean>>;
  countOfAccounts: number;
  open: boolean;
  account: AccountFullDTO;
  hasPassword: boolean;
}) => {
  const { mutate, isPending } = useDeleteUsersAccount();
  const router = useRouter();
  const handleProviderDelete = async () => {
    try {
      mutate(account, {
        onSuccess: () => {
          setEditOAuth(false);
          router.refresh();
          toast.success('Аккаунт успешно отвязан');
        },
      });
    } catch (e) {}
  };
  return (
    <Dialog open={open} onOpenChange={setEditOAuth}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setEditOAuth(true)}
          variant="ghost"
          size="sm"
          className="gap-2"
        >
          <LinkIcon className="h-4 w-4" /> Управлять
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Управление аккаунтами</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">{account.provider}</div>
        <Button
          disabled={!hasPassword && countOfAccounts === 1}
          onClick={() => handleProviderDelete()}
        >
          {isPending ? <Spinner /> : 'Отвязать'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default OAuthEditDialog;
