'use client';
import WorkspaceSelect from '@/components/ui/select/workspace-select';
import WorknestLogotype from '../../ui/worknest-logotype';
import { useEffect, useState } from 'react';
import { WorkspaceListDTO } from '@/types/prisma/DTO/workspaces';
import ProjectSelect from '@/components/ui/select/project-select';
import { ProjectListDTO } from '@/types/prisma/DTO/projects';
import { fetchProjects } from '@/lib/fetch-fns/fetch-projects';
import { usePathname } from 'next/navigation';
import TaskSelect from '@/components/ui/select/task-select';
import { TaskListDTO } from '@/types/prisma/DTO/tasks';
import { fetchTasks } from '@/lib/fetch-fns/fetch-tasks';
import toast from 'react-hot-toast';

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
      return;
    }

    setPLoading(true);

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

    if (selectedWorkspaceId) {
      setTaskLoading(true);
      setSelectedTaskId(null);
      fetchTasks({
        workspaceId: selectedWorkspaceId,
        projectId: selectedProjectId,
      })
        .then(setTasks)
        .catch(() => {
          toast.error('Не удалось загрузить задачи');
        })
        .finally(() => setTaskLoading(false));
    }
  }, [selectedProjectId, selectedWorkspaceId]);

  // Routing --------------------------------
  const pathname = usePathname();
  useEffect(() => {
    // ожидаем роуты вида /w/123 или /w/123/projects/456
    const workspaceMatch = pathname.match(/\/w\/([^/]+)/);
    const projectMatch = pathname.match(/\/projects\/([^/]+)/);
    const workspaceIdFromPath = workspaceMatch?.[1] ?? null;
    const projectIdFromPath = projectMatch?.[1] ?? null;

    if (workspaceIdFromPath && workspaceIdFromPath !== selectedWorkspaceId) {
      setSelectedWorkspaceId(workspaceIdFromPath);
    }

    // projectId может отсутствовать на странице списка проектов
    if (projectIdFromPath !== selectedProjectId) {
      setSelectedProjectId(projectIdFromPath);
    }
  }, [pathname]);

  // Handlers --------------------------------
  const handleWorkspaceChange = (value: string) => {
    setSelectedWorkspaceId(value);
    setSelectedProjectId(null);
    setSelectedTaskId(null);
    setProjects([]);
    setTasks([]);
  };

  const handleProjectChange = (value: string) => {
    setSelectedProjectId(value);
    setSelectedTaskId(null);
  };

  return (
    <aside className="hidden md:block md:w-60 lg:w-62 xl:w-64 bg-zinc-50 border-r h-screen px-4 py-4 mr-4">
      <div className="mb-6">
        <WorknestLogotype />
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
  );
};

export default DashboardSidebarStatic;
