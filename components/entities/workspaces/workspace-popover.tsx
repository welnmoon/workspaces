import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { BuyTariffAction } from '@/features/billing/buy-tariff/buy-tariff.action';
import { DownloadReportAction } from '@/features/reports/download-report/download-report.action';
import EditWorkspaceDialog from '@/components/dialogs/edit-workspace-dialog';
import InviteUserDialog from '@/components/dialogs/invite-user-dialog';
import { IoMenu } from 'react-icons/io5';
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
        <BuyTariffAction />
        <DownloadReportAction tasksDone={tasksDone} />
      </PopoverContent>
    </Popover>
  );
};

export default WorkspacePopover;
