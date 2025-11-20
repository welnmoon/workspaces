'use client';
import WorkspaceSelect from '@/components/ui/select/workspace-select';
import { useEffect, useState } from 'react';
import { WorkspaceListDTO } from '@/types/prisma/DTO/workspaces';
import ProjectSelect from '@/components/ui/select/project-select';
import { useProjects } from '@/hooks/project/use-projects';
import { usePathname } from 'next/navigation';
import TaskSelect from '@/components/ui/select/task-select';
import { TaskListDTO } from '@/types/prisma/DTO/tasks';
import { fetchTasks } from '@/lib/fetch-fns/fetch-tasks';
import toast from 'react-hot-toast';
import { WorkspaceLogo } from '@/components/ui/workspace-logo';
import { useTasks } from '@/hooks/tasks/use-tasks';
import { useWorkspaces } from '@/hooks/workspace/use-workspaces';

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
    isError: pError,
    error: pErrorObj,
  } = useProjects(selectedWorkspaceId);

  const {
    data: tasks = [],
    isLoading: tLoading,
    isError: tError,
    error: tErrorObj,
  } = useTasks(selectedProjectId, selectedWorkspaceId);

  // const {
  //   data: workspaces = [],
  //   isLoading: wLoading,
  //   isError: wError,
  //   error: wErrorObj,
  // } = useWorkspaces();

  // Fetch projects
  // useEffect(() => {
  //   if (!selectedWorkspaceId) {
  //     setProjects([]);
  //     return;
  //   }

  //   setPLoading(true);

  //   fetchProjects(Number(selectedWorkspaceId))
  //     .then(setProjects)
  //     .catch(() => {})
  //     .finally(() => setPLoading(false));
  // }, [selectedWorkspaceId]);

  // Fetch tasks
  // useEffect(() => {
  //   if (!selectedProjectId) {
  //     // setTasks([]);
  //     setSelectedTaskId(null); // Сбрасываем выбранный проект
  //     return;
  //   }

  //   if (selectedWorkspaceId) {
  //     // setTaskLoading(true);
  //     setSelectedTaskId(null);
  //     fetchTasks({
  //       workspaceId: selectedWorkspaceId,
  //       projectId: selectedProjectId,
  //     })
  //       .then(setTasks)
  //       .catch(() => {
  //         toast.error('Не удалось загрузить задачи');
  //       })
  //       .finally(() => setTaskLoading(false));
  //   }
  // }, [selectedProjectId, selectedWorkspaceId]);

  // Routing --------------------------------
  const pathname = usePathname();
  useEffect(() => {
    const workspaceMatch = pathname.match(/\/w\/([^/]+)/);
    const projectMatch = pathname.match(/\/projects\/([^/]+)/);

    const workspaceIdFromPath = Number(workspaceMatch?.[1]) ?? null;
    const projectIdFromPath = Number(projectMatch?.[1]) ?? null;

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
      className="hidden md:block md:w-60 lg:w-62 xl:w-64 bg-zinc-50 border-r h-screen px-4 py-4 mr-4
    sticky top-0"
    >
      <div className="mb-6">
        <WorkspaceLogo />
      </div>
      <div className="flex flex-col gap-2">
        <WorkspaceSelect
          label="Workspace"
          workspaces={workspaces}
          onChange={handleWorkspaceChange}
          value={String(selectedWorkspaceId)}
          placeholder="Workspace"
        />

        {selectedWorkspaceId && (
          <ProjectSelect
            label="Project"
            onChange={handleProjectChange}
            value={String(selectedProjectId)}
            projects={projects}
            loading={pLoading}
            placeholder={'Проект'}
            workspaceId={String(selectedWorkspaceId)}
          />
        )}

        {selectedWorkspaceId && selectedProjectId && (
          <TaskSelect
            label="Task"
            onChange={(value) => setSelectedTaskId(Number(value))}
            placeholder="Задача"
            projectId={String(selectedProjectId)}
            tasks={tasks}
            workspaceId={String(selectedWorkspaceId)}
            value={String(selectedTaskId)}
            loading={tLoading}
          />
        )}
      </div>
    </aside>
  );
};

export default DashboardSidebarStatic;
