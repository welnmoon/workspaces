'use client';

import CreateProjectDialog from '@/components/dialogs/create-project-dialog';
import ProjectCard from '@/components/entities/projects/project-card';
import { cardContainer } from '@/styles/styles';
import { Heading } from '@/components/ui/heading';
import { Role } from '@prisma/client';
import { ProjectFullDTO } from '@/types/prisma/DTO/projects';
import { useProjects } from '@/hooks/project/use-projects';

export type WProjectsSectionProps = {
  userRole: Role;
  workspaceId: number;
  workspace: any;
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
    isLoading,
    isError,
    error,
  } = useProjects(workspaceId, projects);
  return (
    <section>
      <div className="flex justify-between">
        <Heading>Projects</Heading>
        {userRole === Role.ADMIN ||
          (userRole === Role.OWNER && (
            <CreateProjectDialog workspaceId={workspaceId} />
          ))}
      </div>
      <section className={cardContainer}>
        {projects.map((p) => (
          <ProjectCard
            title={p.name}
            description={p.description || ''}
            projectId={p.id}
            workspaceId={workspace.id}
            key={p.id}
            // tasksTotal={tasksTotal}
            // tasksDone={tasksDone}
            // tasksInProgress={tasksInProgress}
            // tasksToDoCount={tasksToDoCount}
            // tasksOverdue={tasksOverdue}
          />
        ))}
        {projects.length === 0 && (
          <div className="w-full py-8 text-center text-muted-foreground">
            No projects found
          </div>
        )}
      </section>
    </section>
  );
};

export default WProjectsSection;
