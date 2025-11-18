import EditMemberDialog from '@/components/dialogs/edit-member-dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RoleWithoutOwnerDTO } from '@/types/prisma/DTO/role';
import { Role } from '@prisma/client';
import { IoMenu } from 'react-icons/io5';

const EditMemberPopover = ({ memberRole }: { memberRole: RoleWithoutOwnerDTO }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <IoMenu className="text-xl text-gray-800" />
      </PopoverTrigger>
      <PopoverContent className="w-full py-2 px-1 flex flex-col items-start">
        <EditMemberDialog memberRole={memberRole}/>
      </PopoverContent>
    </Popover>
  );
};

export default EditMemberPopover;
