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
import { useWorkspaceDelete } from '../model/use-w-delete';

const WorkspaceDeleteDialog = ({
  wId,
  onClose,
  open,
}: {
  wId: number;
  onClose: () => void;
  open: boolean;
}) => {
  const { onSubmit } = useWorkspaceDelete({ id: wId });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Workspace #{wId}</DialogTitle>
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

export default WorkspaceDeleteDialog;
