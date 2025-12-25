'use client';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import EditMemberDialog from '@/components/dialogs/edit-member-dialog';
import { DeleteMemberAction } from '@/features/members/delete-member/delete-member.action';
import { EditProjectAction } from '@/features/projects/edit-project/edit-project.action';
import { RoleWithoutOwnerDTO } from '@/types/prisma/DTO/role';
import { useState } from 'react';
import { IoMenu } from 'react-icons/io5';

const EditMemberPopover = ({
  memberRole,
  memberId,
}: {
  memberRole: RoleWithoutOwnerDTO;
  memberId: number;
}) => {
  const [openPopover, setOpenPopover] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <>
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger>
          <IoMenu className="text-xl text-gray-800" />
        </PopoverTrigger>
        <PopoverContent className="w-full py-2 px-1 flex flex-col items-start">
          <EditProjectAction onClick={() => setOpenDialog(true)} />
          <DeleteMemberAction memberId={memberId} />
        </PopoverContent>
      </Popover>
      <EditMemberDialog
        open={openDialog}
        setOpen={setOpenDialog}
        memberId={memberId}
        memberRole={memberRole}
      />
    </>
  );
};

export default EditMemberPopover;
