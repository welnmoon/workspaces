import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import MainBtn from '../buttons/main-btn';
import CreateWorkspaceForm from '../forms/w/create-w-form';

const CreateWorkspaceDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <MainBtn text="Создать воркспейс" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Вы создаете вокрспейс</DialogTitle>
        </DialogHeader>
        <CreateWorkspaceForm />
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspaceDialog;
