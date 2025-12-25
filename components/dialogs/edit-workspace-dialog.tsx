'use client';

import { useState } from 'react';

import EditWorkspaceForm from '@/components/forms/workspace/edit-workspace-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { EditWorkspaceAction } from '@/features/workspaces/edit-workspace/edit-workspace.action';

type EditWorkspaceDialogProps = {
  workspaceId: number;
  name: string;
  description?: string | null;
};

const EditWorkspaceDialog = ({
  workspaceId,
  name,
  description,
}: EditWorkspaceDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <EditWorkspaceAction />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Редактировать рабочее пространство</DialogTitle>
        </DialogHeader>
        <EditWorkspaceForm
          workspaceId={workspaceId}
          defaultValues={{ name, description }}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditWorkspaceDialog;
