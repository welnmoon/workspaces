'use client';

import { Suspense } from 'react';
import CreateProjectDialog from '@/components/dialogs/create-project-dialog';
import ProjectCard from '@/components/entities/projects/project-card';
import { cardContainer } from '@/styles/styles';
import { Heading } from '@/components/ui/heading';
import { Role } from '@prisma/client';
import { ProjectFullDTO } from '@/types/prisma/DTO/projects';
import { useProjects } from '@/hooks/project/use-projects';
import EmptyState from '@/components/empty-state';
import { WorkspaceDTO } from '@/types/prisma/DTO/workspaces';

// Skeleton component (можешь заменить на свой)
function ProjectSkeleton() {
  return (
    <div className="animate-pulse space-y-3 p-4 rounded-md border bg-zinc-100">
      <div className="h-5 w-1/3 bg-zinc-300 rounded" />
      <div className="h-3 w-2/3 bg-zinc-300 rounded" />
    </div>
  );
}

function ProjectsList({
  workspaceId,
  workspace,
  projects,

}: {
  workspaceId: number;
  workspace: WorkspaceDTO;
  projects: ProjectFullDTO[];
}) {
  const { data: optimisticProjects, isLoading } = useProjects(
    workspaceId,
    projects
  );

  if (optimisticProjects.length === 0) {
    return (
      <EmptyState
        title="Пока пусто"
        subtitle="Создайте свой первый проект"
        className="w-full"
      />
    );
  }

  return (
    <>
      {optimisticProjects.map((p) => (
        <ProjectCard
          key={p.id}
          title={p.name}
          description={p.description || ''}
          projectId={p.id}
          workspaceId={workspace.id}
        />
      ))}
    </>
  );
}

export default function WProjectsSection({
  userRole,
  workspaceId,
  workspace,
  projects,
  isLoading,
}: {
  userRole: Role;
  workspaceId: number;
  workspace: WorkspaceDTO;
  projects: ProjectFullDTO[];
  isLoading: boolean;
}) {
  return (
    <section>
      <div className="flex justify-between">
        <Heading>Проекты</Heading>
        {(userRole === Role.ADMIN || userRole === Role.OWNER) && (
          <CreateProjectDialog workspaceId={workspaceId} />
        )}
      </div>

      <section className={cardContainer}>
        {isLoading && (
          <>
            <ProjectSkeleton />
            <ProjectSkeleton />
            <ProjectSkeleton />
          </>
        )}
        {!isLoading && (
          <ProjectsList
            workspaceId={workspaceId}
            workspace={workspace}
            projects={projects}
          />
        )}
      </section>
    </section>
  );
}
