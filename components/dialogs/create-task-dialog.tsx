'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import CreateTaskForm from '../forms/task/create-task-form';
import { useState } from 'react';
import { MembershipSelectUserDTO } from '@/types/prisma/DTO/memberships';
import { PlusCircle } from 'lucide-react';
import MainButton from '@/ui/button/main-button';
import Image from 'next/image';

const CreateTaskDialog = ({
  workspaceId,
  projectId,
  members,
}: {
  workspaceId: number;
  projectId: number;
  members: MembershipSelectUserDTO[];
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <MainButton
        
          text="Создать задачу"
          icon={<PlusCircle className="text-white" size={20} />}
        />
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] sm:max-w-2xl">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-left text-xl font-semibold">
            Новая задача
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Разбейте проект на конкретные шаги, обозначьте сроки и уточните
            детали — команда увидит задачу сразу после сохранения.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <div className="flex-1">
            <CreateTaskForm
              projectId={Number(projectId)}
              workspaceId={Number(workspaceId)}
              onSuccess={() => setOpen(false)}
              members={members}
            />
          </div>
          <div className="hidden w-52 shrink-0 items-center justify-center rounded-xl bg-muted/50 p-4 md:flex">
            <Image
              src="/images/workspaces/checking-notes.png"
              alt="Иллюстрация задачи"
              width={500}
              height={500}
              className="h-auto max-h-48 w-full object-contain"
              sizes="208px"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
