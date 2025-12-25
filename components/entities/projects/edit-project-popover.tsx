import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import EditProjectDialog from '@/components/dialogs/edit-project-dialog';
import { DeleteProjectAction } from '@/features/projects/delete-project/delete-project.action';
import { MoreVertical } from 'lucide-react';

type EditProjectPopoverProps = {
  projectId: number;
  workspaceId: number;
  projectName: string;
  projectDescription?: string | null;
};

const EditProjectPopover = ({
  projectId,
  workspaceId,
  projectName,
  projectDescription,
}: EditProjectPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Действия с проектом">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 py-2 px-1 flex flex-col items-start gap-1">
        <EditProjectDialog
          projectId={projectId}
          workspaceId={workspaceId}
          name={projectName}
          description={projectDescription}
        />
        <DeleteProjectAction
          projectId={projectId}
          workspaceId={workspaceId}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EditProjectPopover;
