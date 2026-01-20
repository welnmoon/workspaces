import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TaskWithAssigneeDTO } from '@/types/prisma/DTO/tasks';
import { STATUS_COLUMNS } from '@/const/tasks-status';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import getFullName from '@/helpers/profile.ts/get-full-name';
import { ru } from 'date-fns/locale';

export const TasksPageTaskCard = ({ task }: { task: TaskWithAssigneeDTO }) => {
  const statusStripeClass = cn(
    'absolute inset-y-0 left-0 w-1 rounded-l-md',
    task.status === 'DONE'
      ? 'bg-emerald-500'
      : task.status === 'IN_PROGRESS'
        ? 'bg-blue-500'
        : task.status === 'BLOCKED'
          ? 'bg-red-500'
          : 'bg-slate-300'
  );

  const formatDate = (d?: Date | string | null) =>
    d ? format(new Date(d), 'dd MMM yyyy', { locale: ru }) : '—';

                                   
                                                             
                                 
                                                   
                                   
                                                              
                                       
                                                             
                                                             
       

  return (
    <div className="relative">
      <span className={statusStripeClass} />

      <Card className="hover:shadow-md transition-shadow cursor-pointer rounded-l-md px-4 py-3">
        <CardHeader className="p-0 mb-2">
          <CardTitle className="text-base font-semibold">
            {task.title}
          </CardTitle>

          {task.description && (
            <CardDescription className="line-clamp-2">
              {task.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="flex flex-wrap gap-2 p-0 h-fit">
          <div className="flex items-center gap-2">
            {task.status && (
              <Badge variant="outline" className="w-fit h-fit">
                {STATUS_COLUMNS.find((s) => s.id === task.status)?.title ??
                  task.status}
              </Badge>
            )}
          </div>

          <div className="text-sm flex-1 text-muted-foreground ">
            <strong>Исполнитель:</strong>{' '}
            {task.assignee
              ? getFullName({
                  firstName: task.assignee?.firstName,
                  lastName: task.assignee?.lastName,
                })
              : 'Не назначен'}
          </div>

          <div className="flex flex-col text-sm text-muted-foreground gap-1">
            <div>
              <strong>Создано:</strong> {formatDate(task.createdAt)}
            </div>

            <div>
              <strong>Дедлайн:</strong> {formatDate(task.dueDate)}
            </div>

            {task.status === 'DONE' && (
              <div className="text-emerald-600">
                <strong>Завершено:</strong> {formatDate(task.updatedAt)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
