import CreateInvitationButton from '@/components/buttons/create-invitation';
import EditWorkspaceButton from '@/components/buttons/edit-workspace';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { IoMenu } from 'react-icons/io5';

const WorkspacePopover = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <IoMenu className="w-25 text-gray-800" />
      </PopoverTrigger>
      <PopoverContent className="w-full flex flex-col items-start">
        <CreateInvitationButton />
        <EditWorkspaceButton />
      </PopoverContent>
    </Popover>
  );
};

export default WorkspacePopover;
