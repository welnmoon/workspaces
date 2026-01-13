import { Ellipsis } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../shared/ui/dropdown-menu';
import type { WorkspaceDTO } from '../../../types/DTO/workspace';
import { useNavigate } from 'react-router-dom';

const WorkspaceEditDropdownMenu = ({ workspace }: { workspace: WorkspaceDTO }) => {
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
      onClick: () => {},
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
    </DropdownMenu>
  );
};

export default WorkspaceEditDropdownMenu;
