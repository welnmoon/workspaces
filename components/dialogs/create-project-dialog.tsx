'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import CreateProjectForm from '../forms/project/create-project-form';
import { useState } from 'react';
import MainButton from '@/ui/button/main-button';

const CreateProjectDialog = ({ workspaceId }: { workspaceId: number }) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <MainButton text="Создать проект" />
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] sm:max-w-2xl">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-left text-xl font-semibold">
            Создать проект
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Опишите главную цель и базовые детали проекта, чтобы команда сразу
            понимала задачу.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <div className="flex-1">
            <CreateProjectForm
              setOpenModal={setOpen}
              workspaceId={Number(workspaceId)}
            />
          </div>
          <div className="hidden w-52 shrink-0 items-center justify-center rounded-xl bg-muted/50 p-4 md:flex">
            <img
              src="/images/workspaces/projecting.png"
              alt="Иллюстрация проекта"
              className="h-auto max-h-48 w-full object-contain"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
