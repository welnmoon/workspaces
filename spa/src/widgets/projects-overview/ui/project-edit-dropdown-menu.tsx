import { Ellipsis } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../shared/ui/dropdown-menu';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ProjectDeleteDialog from '../../../features/project-delete/ui/project-delete-dialog';
import type { ProjectFullDTO } from '../../../shared/types/DTO/project';

const ProjectEditDropdownMenu = ({ project }: { project: ProjectFullDTO }) => {
  const [deletingProjectId, setDeletingProjectId] = useState<number | null>(
    null
  );
  const navigate = useNavigate();
  const dropdownItems = [
    {
      title: 'Edit',
      onClick: (projectId: number) => {
        navigate(`/projects/${projectId}`);
      },
    },
    {
      title: 'Remove',
      onClick: (projectId: number) => setDeletingProjectId(projectId),
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
              onClick={() => item.onClick(project.id)}
            >
              {item.title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {deletingProjectId && (
        <ProjectDeleteDialog
          open={Boolean(deletingProjectId)}
          onClose={() => setDeletingProjectId(null)}
          projectId={deletingProjectId}
        />
      )}
    </>
  );
};

export default ProjectEditDropdownMenu;
