'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import MainBtn from '../buttons/main-btn';
import CreateProjectForm from '../forms/project/create-project-form';
import { useState } from 'react';

const CreateProjectDialog = ({ workspaceId }: { workspaceId: number }) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <MainBtn text="Создать проект" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Вы создаете проект</DialogTitle>
        </DialogHeader>
        <CreateProjectForm
          setOpenModal={setOpen}
          workspaceId={Number(workspaceId)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
