'use client';

import CreateProjectDialog from '@/components/dialogs/create-project-dialog';
import ProjectCard from '@/components/entities/projects/project-card';
import { cardContainer } from '@/styles/styles';
import { Heading } from '@/components/ui/heading';
import type { ProjectFullDTO } from '@/types/prisma/DTO/projects';
import { useProjects } from '@/hooks/project/use-projects';
import type { WorkspaceDTO } from '@/types/prisma/DTO/workspaces';
import { FullRoleDTO, RolesEnum } from '@/types/prisma/DTO/role';

export type WProjectsSectionProps = {
  userRole: FullRoleDTO;
  workspaceId: number;
  workspace: WorkspaceDTO;
  projects: ProjectFullDTO[];
};

const WProjectsSection = ({
  userRole,
  workspaceId,
  workspace,
  projects,
}: WProjectsSectionProps) => {
  const {
    data: optimisticProjects,

  } = useProjects(workspaceId, projects);
  return (
    <section>
      <div className="flex justify-between">
        <Heading>Projects</Heading>
        {(userRole === RolesEnum.ADMIN || userRole === RolesEnum.OWNER) && (
          <CreateProjectDialog workspaceId={workspaceId} />
        )}
      </div>
      <section className={cardContainer}>
        {optimisticProjects?.map((p) => (
          <ProjectCard
            title={p.name}
            description={p.description || ''}
            projectId={p.id}
            workspaceId={workspace.id}
            key={p.id}
          />
        ))}
        {optimisticProjects?.length === 0 && (
          <div className="w-full py-8 text-center text-muted-foreground">
            No projects found
          </div>
        )}
      </section>
    </section>
  );
};

export default WProjectsSection;
