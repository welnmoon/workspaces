import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import MainBtn from '../buttons/main-btn';
import CreateProjectForm from '../forms/project/create-project-form';

const CreateProjectDialog = ({ workspaceId }: { workspaceId: string }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <MainBtn text="Создать проект" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Вы создаете проект</DialogTitle>
        </DialogHeader>
        <CreateProjectForm workspaceId={Number(workspaceId)} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
