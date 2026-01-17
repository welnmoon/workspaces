import { Ellipsis } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../shared/ui/dropdown-menu';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SprintDeleteDialog from '../../../features/sprint-delete/ui/sprint-delete-dialog';
import type { SprintDTO } from '../../../shared/types/DTO/sprint';

const SprintEditDropdownMenu = ({ sprint }: { sprint: SprintDTO }) => {
  const [deletingSprintId, setDeletingSprintId] = useState<number | null>(null);
  const navigate = useNavigate();
  const dropdownItems = [
    {
      title: 'Edit',
      onClick: (sprintId: number) => {
        navigate(`/sprints/${sprintId}`);
      },
    },
    {
      title: 'Remove',
      onClick: (sprintId: number) => setDeletingSprintId(sprintId),
    },
  ];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Ellipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          style={{ padding: '10px' }}
          className="w-40 h-full p-3 card"
        >
          {dropdownItems.map((item) => (
            <DropdownMenuItem
              key={item.title}
              style={{ padding: '2px 6px' }}
              className="px-2 py-1"
              onClick={() => item.onClick(sprint.id)}
            >
              {item.title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {deletingSprintId && (
        <SprintDeleteDialog
          open={Boolean(deletingSprintId)}
          onClose={() => setDeletingSprintId(null)}
          sprintId={deletingSprintId}
        />
      )}
    </>
  );
};

export default SprintEditDropdownMenu;
