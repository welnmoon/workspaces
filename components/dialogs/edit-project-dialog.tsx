'use client';

import EditProjectButton from '@/components/buttons/edit-project-btn';
import EditProjectForm from '@/components/forms/project/edit-project-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Heading } from '@/components/ui/heading';
import { useState } from 'react';

type EditProjectDialogProps = {
  workspaceId: number;
  projectId: number;
  name: string;
  description?: string | null;
};

const EditProjectDialog = ({
  workspaceId,
  projectId,
  name,
  description,
}: EditProjectDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <EditProjectButton />
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-left text-xl font-semibold">
            Редактировать проект
          </DialogTitle>
          <DialogDescription>
            Обновите название или описание, чтобы команда видела актуальную
            информацию.
          </DialogDescription>
        </DialogHeader>
        <EditProjectForm
          workspaceId={workspaceId}
          projectId={projectId}
          defaultValues={{ name, description }}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectDialog;
