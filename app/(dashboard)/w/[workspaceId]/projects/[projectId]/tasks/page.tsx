import { TasksPageTaskCard } from '@/components/entities/tasks/tasks-page-task-card';
import ErrorComponent from '@/components/error';
import { requireUser } from '@/helpers/require-user';
import { AppError } from '@/lib/errors';
import { clientRoutes } from '@/lib/routes/client-routes';
import { ProjectService } from '@/lib/services/project';
import { TaskService } from '@/lib/services/tasks';
import { redirect } from 'next/navigation';

const TasksPage = async ({
  params,
}: {
  params: { workspaceId: string; projectId: string };
}) => {
  try {
    await requireUser();
    const projectId = parseInt(params.projectId);
    const workspaceId = parseInt(params.workspaceId);
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
    const tasks = await TaskService.getAll(projectId);
    return (
      <main>
        {tasks.map((t) => (
          <TasksPageTaskCard task={t} />
        ))}
      </main>
    );
  } catch (e) {
    if (e instanceof AppError) {
      return <ErrorComponent message={e.message} title={String(e.status)} />;
    }

    return <ErrorComponent message="Неизвестная ошибка" title="ERROR" />;
  }
};

export default TasksPage;
