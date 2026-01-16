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
import { useProjectDelete } from '../model/use-project-delete';

const ProjectDeleteDialog = ({
  projectId,
  onClose,
  open,
}: {
  projectId: number;
  onClose: () => void;
  open: boolean;
}) => {
  const { onSubmit } = useProjectDelete({ id: projectId });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Project #{projectId}</DialogTitle>
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

export default ProjectDeleteDialog;
