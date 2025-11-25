'use client';
import DeleteMemberButton from '@/components/buttons/delete-member-btn';
import EditButton from '@/components/buttons/edit-project-btn';
import EditMemberDialog from '@/components/dialogs/edit-member-dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
          <EditButton onClick={() => setOpenDialog(true)} />
          <DeleteMemberButton memberId={memberId} />
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
