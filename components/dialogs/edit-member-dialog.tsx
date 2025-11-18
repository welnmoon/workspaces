'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import EditButton from '../buttons/edit-project-btn';
import EditMemberForm from '../forms/member/edit-member-form';
import { Role } from '@prisma/client';
import { RoleWithoutOwnerDTO } from '@/types/prisma/DTO/role';

const EditMemberDialog = ({
  memberRole,
}: {
  memberRole: RoleWithoutOwnerDTO;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <EditButton />
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-left text-xl font-semibold">
            Редактировать участника
          </DialogTitle>
          <DialogDescription>
            Обновите роль участника в рабочем пространстве.
          </DialogDescription>
        </DialogHeader>

        <EditMemberForm memberRole={memberRole} />
      </DialogContent>
    </Dialog>
  );
};

export default EditMemberDialog;
