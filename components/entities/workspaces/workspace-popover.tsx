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

type WorkspacePopoverProps = {
  workspaceId: number;
  workspaceName: string;
  workspaceDescription?: string | null;
};

const WorkspacePopover = ({
  workspaceId,
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
        <BuyTariffButton
          workspaceName={workspaceName}
          workspaceId={workspaceId}
        />
        <DownloadReportButton />
      </PopoverContent>
    </Popover>
  );
};

export default WorkspacePopover;
