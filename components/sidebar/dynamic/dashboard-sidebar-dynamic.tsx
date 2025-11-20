'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

import WorkspaceSelect from '@/components/ui/select/workspace-select';
import { useEffect, useState } from 'react';
import { WorkspaceListDTO } from '@/types/prisma/DTO/workspaces';
import ProjectSelect from '@/components/ui/select/project-select';
import { ProjectListDTO } from '@/types/prisma/DTO/projects';
import { usePathname } from 'next/navigation';
import TaskSelect from '@/components/ui/select/task-select';
import { TaskListDTO } from '@/types/prisma/DTO/tasks';
import { fetchTasks } from '@/lib/fetch-fns/fetch-tasks';
import toast from 'react-hot-toast';
import { WorkspaceLogo } from '@/components/ui/workspace-logo';
import { useProjects } from '@/hooks/project/use-projects';
import { useTasks } from '@/hooks/tasks/use-tasks';

// Этот компонент показывается только на больших экранах
const DashboardSidebarDynamic = ({
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

  const {
    data: projects = [],
    isLoading: pLoading,
    isError: pError,
    error: pErrorObj,
  } = useProjects(Number(selectedWorkspaceId));
  
  const {
    data: tasks = [],
    isLoading: taskLoading,
    isError: tError,
    error: tErrorObj,
  } = useTasks(
    selectedProjectId ? Number(selectedProjectId) : null,
    selectedWorkspaceId ? Number(selectedWorkspaceId) : null
  );
  // Data --------------------------------
  // const [projects, setProjects] = useState<ProjectListDTO[]>([]);
  // const [tasks, setTasks] = useState<TaskListDTO[]>([]);

  // // Loading --------------------------------
  // const [pLoading, setPLoading] = useState(false);
  // const [taskLoading, setTaskLoading] = useState(false);

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
  //     setTasks([]);
  //     setSelectedTaskId(null); // Сбрасываем выбранный проект
  //     return;
  //   }

  //   if (selectedWorkspaceId) {
  //     setTaskLoading(true);
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

    const workspaceIdFromPath = workspaceMatch?.[1] ?? null;
    const projectIdFromPath = projectMatch?.[1] ?? null;

    // Всегда синхронизируем стейт
    setSelectedWorkspaceId(workspaceIdFromPath);
    setSelectedProjectId(projectIdFromPath);
  }, [pathname]);

  // Handlers --------------------------------
  const handleWorkspaceChange = (value: string) => {
    setSelectedWorkspaceId(value);
    setSelectedProjectId(null);
    setSelectedTaskId(null);
    // setProjects([]);
    // setTasks([]);
  };

  const handleProjectChange = (value: string) => {
    setSelectedProjectId(value);
    setSelectedTaskId(null);
  };

  return (
    <>
      <Sidebar>
        <aside
          className="block w-80 md:w-75 lg:w-62 xl:w-64 bg-zinc-50 border-r h-screen px-4 py-4 mr-4
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
              value={selectedWorkspaceId}
              placeholder="Workspace"
            />

            {selectedWorkspaceId && (
              <ProjectSelect
                label="Project"
                onChange={handleProjectChange}
                value={selectedProjectId}
                projects={projects}
                loading={pLoading}
                placeholder={'Проект'}
                workspaceId={selectedWorkspaceId}
              />
            )}

            {selectedWorkspaceId && selectedProjectId && (
              <TaskSelect
                label="Task"
                onChange={setSelectedTaskId}
                placeholder="Задача"
                projectId={selectedProjectId}
                tasks={tasks}
                workspaceId={selectedWorkspaceId}
                value={selectedTaskId}
                loading={taskLoading}
              />
            )}
          </div>
        </aside>
      </Sidebar>
      <SidebarRail side="left" railWidth={48} peekPx={12} openGapPx={8} />
    </>
  );
};

export default DashboardSidebarDynamic;
