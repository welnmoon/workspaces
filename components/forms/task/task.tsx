'use client';

import { cn } from '@/lib/utils';
import { taskIsExpired } from '@/helpers/task/isExpired';
import Desc from '@/components/ui/desc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Task, User } from '@prisma/client';
import GoBackBtn from '@/components/buttons/go-back-btn';
import { useRouter } from 'next/navigation';
import { Heading } from '@/components/ui/heading';
import Link from 'next/link';
import { clientRoutes } from '@/lib/routes/client-routes';

const TaskComponent = ({
  task,
  projectName,
  projectId,
  workspaceId,
  workspaceName,
  assignee,
}: {
  task: Task;
  projectName: string;
  projectId: number;
  workspaceId: number;
  workspaceName: string;
  assignee: User | null;
}) => {
  const router = useRouter();
  const dueDateFormatted = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('ru', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Не указан';

  const createdAtFormatted = new Date(task.createdAt).toLocaleDateString('ru', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const expired = task.dueDate ? taskIsExpired(new Date(task.dueDate)) : false;
  const deadline = task.dueDate
    ? Math.ceil(
        (new Date(task.dueDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <main className="space-y-6">
      <Heading>
        <Link
          href={clientRoutes.workspacePage(workspaceId)}
          className="underline-anim"
        >
          <span className="text-foreground-muted">
            Workspace {workspaceName}
          </span>
        </Link>{' '}
        {'>'}{' '}
        <Link
          href={clientRoutes.projectPage(workspaceId, projectId)}
          className="underline-anim"
        >
          <span className="text-foreground-muted">Project {projectName}</span>
        </Link>{' '}
        {'>'} Task {task.title}
      </Heading>
      <div className="flex items-center justify-between">
        <GoBackBtn router={router} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{task.title}</h1>
              <p className="text-sm text-muted-foreground">
                Задача #{task.id} • Проект: {projectName}
              </p>
            </div>
            <div className="text-right">
              <span
                className={cn('px-3 py-1 rounded-full text-sm font-medium', {
                  'bg-green-100 text-green-700': task.status === 'DONE',
                  'bg-blue-100 text-blue-700': task.status === 'IN_PROGRESS',
                  'bg-gray-100 text-gray-700': task.status === 'TODO',
                })}
              >
                {task.status === 'DONE' && 'Выполнено'}
                {task.status === 'IN_PROGRESS' && 'В работе'}
                {task.status === 'TODO' && 'К выполнению'}
              </span>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {task.description && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Описание</h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <Desc
              text={
                ''
                // <span className={cn({ 'text-red-600': expired })}>
                //   {dueDateFormatted}
                //   {deadline !== null && deadline < 0 && (
                //     <span className="block text-sm text-red-600">
                //       Просрочено на {Math.abs(deadline)} дн.
                //     </span>
                //   )}
                //   {deadline !== null && deadline > 0 && (
                //     <span className="block text-sm text-gray-600">
                //       Осталось {deadline} дн.
                //     </span>
                //   )}
                // </span>
              }
            />
            <span>
              {createdAtFormatted} • ${assignee?.firstName || 'Не назначено'}
            </span>
            <span>{assignee?.firstName || 'Не назначено'}</span>
            {/* <span
                  className={cn({
                    'text-red-600': task.priority === 'HIGH',
                    'text-yellow-600': task.priority === 'MEDIUM',
                    'text-blue-600': task.priority === 'LOW',
                  })}
                >
                  {task.priority === 'HIGH' && 'Высокий'}
                  {task.priority === 'MEDIUM' && 'Средний'}
                  {task.priority === 'LOW' && 'Низкий'}
                </span> // TODO: priority field
            */}
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default TaskComponent;
