'use client';

import { Project, Task, TaskStatus } from '@prisma/client';
import { Heading } from '../ui/heading';
import Divider from '../divider';
import Description from '../ui/desc';
import TaskCard from '../tasks/task-card';
import CreateTaskDialog from '../dialogs/create-task-dialog';
import { cardContainer } from '@/styles/styles';
import { clientRoutes } from '@/lib/routes/client-routes';
import { Breadcrumbs } from '../bread-crumbs';
import { TaskStats } from '@/types/service/task-stats';
import ProjectTasksFilterByStatusSelect from './project-tasks-filter-by-status-select';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import EmptyState from '../empty-state';
import { MessageInfo } from '../message';

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
  const [selectedStatus, setSelectedStatus] = useState<
    TaskStatus | null | 'ALL'
  >();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  if (!project) return null;

  const handleFilterByStatus = (status: string) => {
    setSelectedStatus(status as TaskStatus);
  };

  useEffect(() => {
    if (selectedStatus !== 'ALL') {
      const filtered = selectedStatus
        ? tasks.filter((t) => t.status === selectedStatus)
        : tasks;
      setFilteredTasks(filtered);
      return;
    }
    setFilteredTasks(tasks);
  }, [selectedStatus, tasks]);

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

      <div className="flex gap-2">
        <Button
          onClick={() => setSelectedStatus(null)}
          variant={'outline'}
          className="w-fit"
        >
          Сброс
        </Button>
        <ProjectTasksFilterByStatusSelect
          className="flex-1"
          status={selectedStatus}
          setStatus={handleFilterByStatus}
        />
      </div>
      {filteredTasks && filteredTasks.length > 0 && selectedStatus && (
        <MessageInfo
          text={`Найдено ${filteredTasks.length} задач`}
        ></MessageInfo>
      )}
      {filteredTasks.length === 0 && selectedStatus && (
        <EmptyState title={`Нет задач со статусом ${selectedStatus}`} />
      )}
      <section role="list" className={cardContainer}>
        {filteredTasks.map((t) => (
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
