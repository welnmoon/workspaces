import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import MainBtn from '../buttons/main-btn';
import CreateTaskForm from '../forms/task/create-task-form';

const CreateTaskDialog = ({
  workspaceId,
  projectId,
}: {
  workspaceId: number;
  projectId: number;
}) => {
  return (
    <Dialog>
      <DialogTrigger>
        <MainBtn text="Создать задачу" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Вы создаете задачу</DialogTitle>
        </DialogHeader>
        <CreateTaskForm
          projectId={Number(projectId)}
          workspaceId={Number(workspaceId)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
