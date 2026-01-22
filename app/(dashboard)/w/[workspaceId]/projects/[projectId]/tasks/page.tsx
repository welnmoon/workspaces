import TasksPageComponent from '@/components/entities/tasks/tasks-page';
import ErrorComponent from '@/components/error';
import { requireUser } from '@/guards/require-user';
import { AppError } from '@/lib/errors';
import { clientRoutes } from '@/lib/routes/client-routes';
import { ProjectService } from '@/lib/services/project';
import { TaskService } from '@/lib/services/tasks';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workspaces',
  description: "Manage your team's work in one space",
  icons: {
    icon: '/icons/metadata/w.png',
  },
};

const TasksPage = async ({
  params,
}: {
  params: Promise<{ workspaceId: string; projectId: string }>;
}) => {
  try {
    await requireUser();
    const projectId = parseInt((await params).projectId);
    const workspaceId = parseInt((await params).workspaceId);
    if (Number.isNaN(projectId) || Number.isNaN(workspaceId)) {
      redirect(clientRoutes.workspacesPage());
    }
    if (!projectId) {
      redirect(clientRoutes.projectPage(workspaceId, projectId));
    }
    const projectExists = await ProjectService.isProjectInWorkspace(
      projectId,
      workspaceId
    );
    if (!projectExists) {
      throw new AppError(404, 'PROJECT_NOT_FOUND', 'Проект не найден');
    }
    const tasks = await TaskService.getAllWithAssignees(projectId);
    return <TasksPageComponent tasks={tasks} />;
  } catch (e) {
    if (e instanceof AppError) {
      return <ErrorComponent message={e.message} title={String(e.status)} />;
    }

    return <ErrorComponent message="Неизвестная ошибка" title="ERROR" />;
  }
};

export default TasksPage;
