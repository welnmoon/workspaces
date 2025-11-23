'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Dispatch, SetStateAction } from 'react';
import EditMemberForm from '../forms/member/edit-member-form';
import { RoleWithoutOwnerDTO } from '@/types/prisma/DTO/role';

const EditMemberDialog = ({
  memberRole,
  memberId,
  open,
  setOpen,
}: {
  memberRole: RoleWithoutOwnerDTO;
  memberId: number;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-left text-xl font-semibold">
            Редактировать участника
          </DialogTitle>
          <DialogDescription>
            Обновите роль участника в рабочем пространстве.
          </DialogDescription>
        </DialogHeader>

        <EditMemberForm
          setOpen={setOpen}
          memberId={memberId}
          memberRole={memberRole}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditMemberDialog;
