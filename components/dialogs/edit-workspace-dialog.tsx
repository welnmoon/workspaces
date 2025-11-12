'use client';

import EditWorkspaceButton from '@/components/buttons/edit-workspace';
import EditWorkspaceForm from '@/components/forms/workspace/edit-workspace-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';

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
        <EditWorkspaceButton />
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
