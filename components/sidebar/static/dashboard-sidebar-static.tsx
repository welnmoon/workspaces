'use client';
import WorkspaceSelect from '@/components/ui/select/workspace-select';
import WorknestLogotype from '../../ui/worknest-logotype';
import { useEffect, useState } from 'react';
import {
  WorkspaceListDTO,
  WorkspaceSelectDTO,
} from '@/types/prisma/DTO/workspaces';
import ProjectSelect from '@/components/ui/select/project-select';
import { ProjectListDTO } from '@/types/prisma/DTO/projects';
import { ProjectServices } from '@/lib/services/project';
import { fetchProjects } from '@/lib/fetch-fns/fetch-projects';
import { apiRoutes } from '@/lib/routes/api-routes';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import TaskSelect from '@/components/ui/select/task-select';
import { TaskListDTO } from '@/types/prisma/DTO/tasks';
import { fetchTasks } from '@/lib/fetch-fns/fetch-tasks';

// Этот компонент показывается только на больших экранах
const DashboardSidebarStatic = ({
  workspaces,
}: {
  workspaces: WorkspaceListDTO[];
}) => {
  // Selected --------------------------------
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(
    null
  );
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Data --------------------------------
  const [projects, setProjects] = useState<ProjectListDTO[]>([]);
  const [tasks, setTasks] = useState<TaskListDTO[]>([]);

  // Loading --------------------------------
  const [pLoading, setPLoading] = useState(false);
  const [taskLoading, setTaskLoading] = useState(false);

  // Fetch projects
  useEffect(() => {
    if (!selectedWorkspaceId) {
      setProjects([]);
      setSelectedProjectId(null); // Сбрасываем выбранный проект
      return;
    }

    setPLoading(true);
    setSelectedProjectId(null); // Сбрасываем выбранный проект при смене workspace

    fetchProjects(Number(selectedWorkspaceId))
      .then(setProjects)
      .catch(() => {})
      .finally(() => setPLoading(false));
  }, [selectedWorkspaceId]);

  // Fetch tasks
  useEffect(() => {
    if (!selectedProjectId) {
      setTasks([]);
      setSelectedTaskId(null); // Сбрасываем выбранный проект
      return;
    }

    setTaskLoading(true);
    setSelectedTaskId(null);
    fetchTasks({
      workspaceId: Number(selectedWorkspaceId),
      projectId: Number(selectedProjectId),
    })
      .then(setTasks)
      .catch(() => {})
      .finally(() => setTaskLoading(false));
  }, [selectedProjectId]);

  const pathname = usePathname();
  useEffect(() => {
    // ожидаем роут типа /w/123/...
    const m = pathname.match(/\/w\/([^/]+)/);
    const idFromPath = m?.[1] ?? null;
    if (idFromPath) setSelectedWorkspaceId(idFromPath);
  }, [pathname]);

  return (
    <aside className="hidden md:block md:w-60 lg:w-62 xl:w-64 bg-zinc-50 border-r h-screen px-4 py-4 mr-4">
      <WorknestLogotype />
      <div className="">
        <WorkspaceSelect
          workspaces={workspaces}
          onChange={setSelectedWorkspaceId}
          value={selectedWorkspaceId}
          placeholder="Workspace"
        />

        {selectedWorkspaceId && (
          <ProjectSelect
            onChange={setSelectedProjectId}
            value={selectedProjectId}
            projects={projects}
            loading={pLoading}
            placeholder={'Проект'}
            workspaceId={selectedWorkspaceId}
          />
        )}

        {selectedWorkspaceId && selectedProjectId && (
          <TaskSelect
            placeholder="Задача"
            projectId={selectedProjectId}
            tasks={tasks}
            workspaceId={selectedWorkspaceId}
          />
        )}
      </div>
    </aside>
  );
};

export default DashboardSidebarStatic;
