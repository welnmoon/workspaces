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
import { useTaskDelete } from '../model/use-task-delete';

const TaskDeleteDialog = ({
  taskId,
  onClose,
  open,
}: {
  taskId: number;
  onClose: () => void;
  open: boolean;
}) => {
  const { onSubmit } = useTaskDelete({ id: taskId });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Task #{taskId}</DialogTitle>
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

export default TaskDeleteDialog;
