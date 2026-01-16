import { Ellipsis } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../shared/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import WorkspaceDeleteDialog from '../../../features/workspace-delete/ui/w-delete-dialog';
import type { WorkspaceDTO } from '../../../shared/types/DTO/workspace';

const WorkspaceEditDropdownMenu = ({
  workspace,
}: {
  workspace: WorkspaceDTO;
}) => {
  const [deletingWorkspaceId, setDeletingWorkspaceId] = useState<number | null>(
    null
  );
  const navigate = useNavigate();
  const dropdownItems = [
    {
      title: 'Edit',
      onClick: (workspaceId: number) => {
        navigate(`/workspaces/${workspaceId}`);
      },
    },
    {
      title: 'Remove',
      onClick: (id: number) => {
        setDeletingWorkspaceId(id);
      },
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="dropdown-menu-trigger">
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="card dropdown-menu-card">
        {dropdownItems.map((item) => (
          <DropdownMenuItem
            key={item.title}
            className="dropdown-menu-item"
            onClick={() => item.onClick(workspace.id)}
          >
            {item.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>

      {deletingWorkspaceId && (
        <WorkspaceDeleteDialog
          wId={deletingWorkspaceId}
          open={Boolean(deletingWorkspaceId)}
          onClose={() => setDeletingWorkspaceId(null)}
        />
      )}
    </DropdownMenu>
  );
};

export default WorkspaceEditDropdownMenu;
