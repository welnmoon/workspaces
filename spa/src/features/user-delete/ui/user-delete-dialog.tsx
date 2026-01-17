import { Button } from '../../../shared/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../shared/ui/dialog';
import { useUserDelete } from '../model/user-user-delete';

const UserDeleteDialog = ({
  userId,
  onClose,
  open,
}: {
  userId: string;
  onClose: () => void;
  open: boolean;
}) => {
  const { onSubmit } = useUserDelete({ id: userId });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{userId}</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => {
              onSubmit();
              onClose();
            }}
          >
            Remove
          </Button>
          <DialogClose variant="outline" onClick={onClose}>
            Close
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDeleteDialog;
