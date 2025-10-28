import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { notFound, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { taskIsExpired } from '@/lib/task/isExpired';
import Desc from '@/components/ui/desc';

const TaskPage = async ({
  params,
}: {
  params: { workspaceId: string; projectId: string; taskId: string };
}) => {
  const task = await prisma.task.findUnique({
    where: {
      id: Number(params.taskId),
      projectId: Number(params.projectId),
    },
    include: {
      project: true,
      assignee: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  if (!task) {
    return notFound();
  }

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
      <div className="flex items-center justify-between">
        {/* <GoBackBtn router={router} /> */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{task.title}</h1>
              <p className="text-sm text-muted-foreground">
                Задача #{task.id} • Проект: {task.project.name}
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
              {createdAtFormatted} • $
              {task.assignee?.firstName || 'Не назначено'}
            </span>
            <span>{task.assignee?.firstName || 'Не назначено'}</span>
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

export default TaskPage;
