import { Project, Task } from '@prisma/client';
import { Heading } from '../ui/heading';
import Divider from '../divider';
import Description from '../ui/desc';
import TaskCard from '../tasks/task-card';
import CreateTaskDialog from '../dialogs/create-task-dialog';
import { cardContainer } from '@/styles/styles';
import { clientRoutes } from '@/lib/routes/client-routes';
import { Breadcrumbs } from '../bread-crumbs';
import { TaskStats } from '@/types/service/task-stats';

const ProjectComponent = ({
  project,
  workspaceId,
  tasks,
  workspaceName,
  taskStats,
}: {
  project: Project;
  workspaceId: number;
  tasks: Task[];
  workspaceName: string | null;
  taskStats: TaskStats;
}) => {
  if (!project) return null;

  return (
    <article>
      <Heading>
        <Breadcrumbs
          items={[
            {
              label: `Workspace ${workspaceName}`,
              href: clientRoutes.workspacePage(workspaceId),
            },
            {
              label: `Project ${project.name}`,
              href: clientRoutes.projectPage(project.id, workspaceId),
            },
          ]}
        />
      </Heading>
      <Description text={project.description || 'No description'} />
      <Divider />
      <div className="flex justify-between">
        <Heading>Tasks</Heading>
        <CreateTaskDialog projectId={project.id} workspaceId={workspaceId} />
      </div>
      {taskStats && (
        <div className="flex gap-4 my-4">
          <div>Всего: {taskStats.tasksCount}</div>
          <div>📝 TODO: {taskStats.tasksToDoCount}</div>
          <div>🚧 В работе: {taskStats.tasksInProgressCount}</div>
          <div>✅ Готово: {taskStats.tasksDoneCount}</div>
          <div>⛔ Заблокировано: {taskStats.tasksBlockedCount}</div>
          <div>📅 Просрочено: {taskStats.tasksOverdueCount}</div>
        </div>
      )}

      <section role="list" className={cardContainer}>
        {tasks.map((t) => (
          <TaskCard
            role="listitem"
            description={t.description || ''}
            dueDate={t.dueDate ? t.dueDate.toISOString() : ''}
            key={t.id}
            projectId={t.projectId}
            workspaceId={Number(workspaceId)}
            status={t.status}
            title={t.title}
            taskId={t.id}
          />
        ))}
      </section>
    </article>
  );
};

export default ProjectComponent;
