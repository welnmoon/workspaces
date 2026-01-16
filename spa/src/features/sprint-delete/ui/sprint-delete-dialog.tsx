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
import { useSprintDelete } from '../model/use-sprint-delete';

const SprintDeleteDialog = ({
  sprintId,
  onClose,
  open,
}: {
  sprintId: number;
  onClose: () => void;
  open: boolean;
}) => {
  const { onSubmit } = useSprintDelete({ id: sprintId });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sprint #{sprintId}</DialogTitle>
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

export default SprintDeleteDialog;
