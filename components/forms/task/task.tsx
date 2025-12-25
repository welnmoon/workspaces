'use client';

import { cn } from '@/lib/utils';
import { taskIsExpired } from '@/helpers/task/isExpired';
import Desc from '@/components/ui/desc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Heading } from '@/components/ui/heading';
import Link from 'next/link';
import { clientRoutes } from '@/lib/routes/client-routes';
import { Breadcrumbs } from '@/components/bread-crumbs';
import { Badge } from '@/components/ui/badge';
import { TASK_PRIORITY_LABELS } from '@/const/priority';
import { TaskFullDTO, TaskPriorityDTO } from '@/types/prisma/DTO/tasks';
import { UserDTO } from '@/types/prisma/DTO/user';
import { GoBackButton } from '@/ui/navigation/go-back-button';

const TaskComponent = ({
  task,
  projectName,
  projectId,
  workspaceId,
  workspaceName,
  assignee,
}: {
  task: TaskFullDTO;
  projectName: string;
  projectId: number;
  workspaceId: number;
  workspaceName: string;
  assignee: UserDTO | null;
}) => {
  const router = useRouter();

  const dueDateFormatted = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('ru', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Не указана';

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

  const assigneeName =
    `${assignee?.firstName} ${assignee?.lastName}` || 'Не назначено';

  const statusLabel =
    task.status === 'DONE'
      ? 'Выполнено'
      : task.status === 'IN_PROGRESS'
        ? 'В работе'
        : 'К выполнению';

  const priority = task.priority as TaskPriorityDTO;
  const priorityLabel = TASK_PRIORITY_LABELS[priority];

  return (
    <main className="space-y-4">
      {/* Верх: хлебные крошки + кнопка назад */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <Breadcrumbs
            items={[
              {
                label: 'Workspaces',
                href: clientRoutes.workspacesPage(),
              },
              {
                label: workspaceName,
                href: clientRoutes.workspacePage(workspaceId),
              },
              {
                label: 'Projects',
                href: clientRoutes.projectsPage(workspaceId),
              },
              {
                label: projectName,
                href: clientRoutes.projectPage(workspaceId, projectId),
              },
              {
                label: `Task #${task.id}`,
                href: clientRoutes.taskPage(task.id, projectId, workspaceId),
              },
            ]}
          />
        </div>
        <GoBackButton router={router} />
      </div>

      {/* Заголовок задачи (как в Jira сверху) */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <Heading level={2}>{task.title}</Heading>
          <p className="text-sm text-muted-foreground">
            Задача #{task.id} • Проект{' '}
            <Link
              href={clientRoutes.projectPage(projectId, workspaceId)}
              className="underline underline-offset-2 hover:text-primary"
            >
              {projectName}
            </Link>
          </p>
        </div>
        <span
          className={cn('px-3 py-1 rounded-full text-sm font-medium border', {
            'bg-green-50 text-green-700 border-green-200':
              task.status === 'DONE',
            'bg-blue-50 text-blue-700 border-blue-200':
              task.status === 'IN_PROGRESS',
            'bg-gray-50 text-gray-700 border-gray-200': task.status === 'TODO',
          })}
        >
          {statusLabel}
        </span>
      </div>

      {/* Основной Jira-лайк layout: слева контент, справа детали */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Левая колонка */}
        <div className="flex-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Описание</CardTitle>
            </CardHeader>
            <CardContent>
              {task.description ? (
                <p className="text-sm text-gray-800 whitespace-pre-wrap">
                  {task.description}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Описание пока не добавлено.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Заглушка под "Активность" / комментарии как в Jira */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Активность</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Здесь позже можно вывести комментарии, историю изменений и т.п.
            </CardContent>
          </Card>
        </div>

        {/* Правая колонка — детали задачи (как панель справа в Jira) */}
        <aside className="w-full lg:w-80 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Детали</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Desc
                label="Статус"
                text={
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-full text-xs font-medium border',
                      {
                        'bg-green-50 text-green-700 border-green-200':
                          task.status === 'DONE',
                        'bg-blue-50 text-blue-700 border-blue-200':
                          task.status === 'IN_PROGRESS',
                        'bg-gray-50 text-gray-700 border-gray-200':
                          task.status === 'TODO',
                      }
                    )}
                  >
                    {statusLabel}
                  </span>
                }
              />
              <Desc
                label="Приоритет"
                text={
                  <Badge
                    variant="outline"
                    className={cn(
                      'px-2 py-0.5 text-xs font-medium',
                      task.priority === 'URGENT'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : task.priority === 'HIGH'
                          ? 'bg-orange-50 text-orange-700 border-orange-200'
                          : task.priority === 'MEDIUM'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                    )}
                  >
                    {priorityLabel}
                  </Badge>
                }
              />

              <Desc label="Исполнитель" text={<span>{assigneeName}</span>} />
              <Desc label="Email" text={<span>{assignee?.email}</span>} />

              <Desc label="Создана" text={<span>{createdAtFormatted}</span>} />

              <Desc
                label="Срок"
                text={
                  <span
                    className={cn({
                      'text-red-600': expired,
                      'text-gray-800': !expired && task.dueDate,
                      'text-muted-foreground': !task.dueDate,
                    })}
                  >
                    {dueDateFormatted}
                    {deadline !== null && (
                      <>
                        {deadline < 0 && (
                          <span className="block text-xs text-red-600">
                            Просрочено на {Math.abs(deadline)} дн.
                          </span>
                        )}
                        {deadline > 0 && (
                          <span className="block text-xs text-gray-600">
                            Осталось {deadline} дн.
                          </span>
                        )}
                        {deadline === 0 && (
                          <span className="block text-xs text-amber-600">
                            Срок сегодня
                          </span>
                        )}
                      </>
                    )}
                  </span>
                }
              />

              {/* Если добавишь поле приоритета — сюда его легко вставить */}
              <Desc label="Приоритет" text={<span>{task.priority}</span>} />

              <Desc
                label="Workspace"
                text={
                  <Link
                    href={clientRoutes.workspacePage(workspaceId)}
                    className="underline underline-offset-2 hover:text-primary"
                  >
                    {workspaceName}
                  </Link>
                }
              />

              <Desc
                label="Проект"
                text={
                  <Link
                    href={clientRoutes.projectPage(projectId, workspaceId)}
                    className="underline underline-offset-2 hover:text-primary"
                  >
                    {projectName}
                  </Link>
                }
              />
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
};

export default TaskComponent;
