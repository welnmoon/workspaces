import { Ellipsis } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../shared/ui/dropdown-menu';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import TaskDeleteDialog from '../../../features/task-delete/ui/task-delete-dialog';
import type { TaskDTO } from '../../../shared/types/DTO/task';

const TaskEditDropdownMenu = ({ task }: { task: TaskDTO }) => {
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
  const navigate = useNavigate();
  const dropdownItems = [
    {
      title: 'Edit',
      onClick: (taskId: number) => {
        navigate(`/tasks/${taskId}`);
      },
    },
    {
      title: 'Remove',
      onClick: (taskId: number) => setDeletingTaskId(taskId),
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
              onClick={() => item.onClick(task.id)}
            >
              {item.title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {deletingTaskId && (
        <TaskDeleteDialog
          open={Boolean(deletingTaskId)}
          onClose={() => setDeletingTaskId(null)}
          taskId={deletingTaskId}
        />
      )}
    </>
  );
};

export default TaskEditDropdownMenu;
