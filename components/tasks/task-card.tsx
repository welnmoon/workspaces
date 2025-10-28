import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Heading } from '../ui/heading';
import Link from 'next/link';
import { clientRoutes } from '@/lib/routes/client-routes';
import { TaskStatus } from '@prisma/client';
import { cn } from '@/lib/utils';
import { taskIsExpired } from '@/lib/task/isExpired';

interface TaskCardProps {
  title: string;
  description: string;
  status: string;
  dueDate: string;
  projectId: number;
  workspaceId: number;
  taskId: number;
  role: string | undefined;
}

export default function TaskCard({
  title,
  description,
  status,
  dueDate,
  projectId,
  workspaceId,
  taskId,
  role,
}: TaskCardProps) {
  const dueDateFormatted = dueDate
    ? new Date(dueDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const expired = taskIsExpired(new Date(dueDate));
  return (
    <Card
      role={role}
      className="transition-all duration-200 hover:shadow-lg hover:-translate-y-[2px]"
    >
      <CardHeader className="pb-2">
        <CardTitle>
          <Heading level={2} className="text-lg font-semibold">
            <Link
              href={clientRoutes.taskPage(workspaceId, projectId, taskId)}
              className="underline-anim"
            >
              {title}
            </Link>
          </Heading>
        </CardTitle>
        {description && (
          <CardDescription className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex items-center justify-between pt-0 text-sm">
        <div>
          <span className="font-medium">Статус: </span>
          <span
            className={`${
              status === TaskStatus.DONE
                ? 'text-green-600'
                : status === TaskStatus.IN_PROGRESS
                  ? 'text-blue-600'
                  : 'text-gray-500'
            }`}
          >
            {status}
          </span>
        </div>
        <div className="text-right">
          <span className="font-medium">Срок: </span>
          <span>
            {dueDate ? (
              <span
                className={cn(
                  { 'text-red-600': expired },
                  'flex flex-col gap-1'
                )}
              >
                {dueDateFormatted}
                {expired ? (
                  <span className="text-foreground-muted">
                    Срок {new Date().getDate() - new Date(dueDate).getDate()}{' '}
                    дня назад
                  </span>
                ) : (
                  ''
                )}
              </span>
            ) : (
              'Нет срока'
            )}
          </span>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-2 text-xs text-muted-foreground flex justify-between">
        <span>ID: {taskId}</span>
        <span>Проект #{projectId}</span>
      </CardFooter>
    </Card>
  );
}
