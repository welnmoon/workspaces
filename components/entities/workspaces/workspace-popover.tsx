import InviteUserDialog from '@/components/dialogs/invite-user-dialog';
import EditWorkspaceDialog from '@/components/dialogs/edit-workspace-dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { IoMenu } from 'react-icons/io5';
import BuyTariffButton from '@/components/buttons/tariff-buy';
import DownloadReportButton from '@/components/buttons/download-report-btn';
import WorkspaceNotifyButton from './workspace-notify-button';

type WorkspacePopoverProps = {
  workspaceId: number;
  userId: string;
  workspaceName: string;
  workspaceDescription?: string | null;
  tasksDone: number;
};

const WorkspacePopover = ({
  workspaceId,
  userId,
  tasksDone,
  workspaceName,
  workspaceDescription,
}: WorkspacePopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <IoMenu className="text-xl text-gray-800" />
      </PopoverTrigger>
      <PopoverContent className="w-full py-2 px-1 flex flex-col items-start">
        <InviteUserDialog workspaceId={workspaceId} />
        <EditWorkspaceDialog
          workspaceId={workspaceId}
          name={workspaceName}
          description={workspaceDescription}
        />
        <WorkspaceNotifyButton workspaceId={workspaceId} userId={userId} />
        <BuyTariffButton />
        <DownloadReportButton tasksDone={tasksDone} />
      </PopoverContent>
    </Popover>
  );
};

export default WorkspacePopover;
