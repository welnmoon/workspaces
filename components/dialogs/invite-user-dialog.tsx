'use client';

import { useState } from 'react';

import InviteUserForm from '@/components/forms/invite/invite-user-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CreateInvitationAction } from '@/features/invitations/create-invitation/create-invitation.action';

type InviteUserDialogProps = {
  workspaceId: number;
};

const InviteUserDialog = ({ workspaceId }: InviteUserDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CreateInvitationAction />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Пригласить участника</DialogTitle>
        </DialogHeader>
        <InviteUserForm
          workspaceId={workspaceId}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default InviteUserDialog;
