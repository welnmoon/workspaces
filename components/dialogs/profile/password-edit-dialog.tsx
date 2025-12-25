import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import EditPasswordForm from '@/components/forms/profile/edit-password-form';

const PasswordEditDialog = ({
  setEditPassword,
  open,
}: {
  setEditPassword: Dispatch<SetStateAction<boolean>>;
  open: boolean;
}) => {
  return (
    <Dialog open={open} onOpenChange={setEditPassword}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setEditPassword(true)}
          variant="outline"
          size="sm"
        >
          Сменить пароль
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Сменить пароль</DialogTitle>
        </DialogHeader>
        <EditPasswordForm setModalOpen={setEditPassword} />
      </DialogContent>
    </Dialog>
  );
};

export default PasswordEditDialog;
