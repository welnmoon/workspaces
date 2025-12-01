'use client';
import WorkspaceSelect from '@/components/ui/select/workspace-select';
import { useEffect, useState } from 'react';
import { WorkspaceListDTO } from '@/types/prisma/DTO/workspaces';
import ProjectSelect from '@/components/ui/select/project-select';
import { useProjects } from '@/hooks/project/use-projects';
import { usePathname } from 'next/navigation';
import TaskSelect from '@/components/ui/select/task-select';
import { WorkspaceLogo } from '@/components/ui/workspace-logo';
import { useTasks } from '@/hooks/tasks/use-tasks';
import Link from 'next/link';
import { NAV_LINKS } from '@/const/navigation';
import { RenderNavigation } from '../sidebar-nav';
import { getIdsFromPathname } from '@/helpers/get-ids-from-path';

// Этот компонент показывается только на больших экранах
const DashboardSidebarStatic = ({
  workspaces,
}: {
  workspaces: WorkspaceListDTO[];
}) => {
  // Selected --------------------------------
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number | null>(
    null
  );
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  // Data --------------------------------
  // const [projects, setProjects] = useState<ProjectListDTO[]>([]);
  // const [tasks, setTasks] = useState<TaskListDTO[]>([]);

  // Loading --------------------------------
  // const [pLoading, setPLoading] = useState(false);
  // const [taskLoading, setTaskLoading] = useState(false);

  // useQuery --------------------------------
  const {
    data: projects = [],
    isLoading: pLoading,
    // isError: pError,
    // error: pErrorObj,
  } = useProjects(selectedWorkspaceId || undefined);

  const {
    data: tasks = [],
    isLoading: tLoading,
    // isError: tError,
    // error: tErrorObj,
  } = useTasks(
    selectedProjectId || undefined,
    selectedWorkspaceId || undefined
  );

  // Routing --------------------------------
  const pathname = usePathname();
  useEffect(() => {
    const { projectId: projectIdFromPath, workspaceId: workspaceIdFromPath } =
      getIdsFromPathname(pathname);

    // Всегда синхронизируем стейт
    setSelectedWorkspaceId(workspaceIdFromPath);
    setSelectedProjectId(projectIdFromPath);
  }, [pathname]);

  // Handlers --------------------------------
  const handleWorkspaceChange = (value: string) => {
    setSelectedWorkspaceId(Number(value));
    setSelectedProjectId(null);
    setSelectedTaskId(null);
    // setProjects([]);
    // setTasks([]);
  };

  const handleProjectChange = (value: string) => {
    setSelectedProjectId(Number(value));
    setSelectedTaskId(null);
  };

  return (
    <aside
      className="hidden md:flex md:flex-col md:w-60 lg:w-62 xl:w-64 bg-zinc-50 border-r h-screen px-4 py-4 mr-4
    sticky top-0"
    >
      <div className="mb-6">
        <WorkspaceLogo />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <WorkspaceSelect
          label="Рабочее пространство"
          workspaces={workspaces}
          onChange={handleWorkspaceChange}
          value={
            selectedWorkspaceId !== null ? String(selectedWorkspaceId) : ''
          }
          placeholder="Выберите пространство"
        />

        {selectedWorkspaceId && (
          <ProjectSelect
            label="Проект"
            onChange={handleProjectChange}
            value={selectedProjectId !== null ? String(selectedProjectId) : ''}
            projects={projects}
            loading={pLoading}
            placeholder="Выберите проект"
            workspaceId={String(selectedWorkspaceId)}
          />
        )}

        {selectedWorkspaceId && selectedProjectId && (
          <TaskSelect
            label="Задача"
            onChange={(value) => setSelectedTaskId(Number(value))}
            placeholder="Выберите задачу"
            projectId={String(selectedProjectId)}
            tasks={tasks}
            workspaceId={selectedTaskId ? String(selectedWorkspaceId) : ''}
            value={String(selectedTaskId)}
            loading={tLoading}
          />
        )}
      </div>

      <div className="">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
          Навигация
        </h3>
        <RenderNavigation />
      </div>
    </aside>
  );
};

export default DashboardSidebarStatic;
