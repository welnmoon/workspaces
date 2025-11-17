// components/task-card.tsx

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TaskFullDTO } from '@/types/prisma/DTO/tasks';
import { STATUS_COLUMNS } from '@/const/tasks-status';
import { TaskStatus } from '@prisma/client';
import { cn } from '@/lib/utils';

export const TasksPageTaskCard = ({ task }: { task: TaskFullDTO }) => {
  const statusStripeClass = cn(
    'absolute inset-y-0 left-0 w-1 rounded-l-md',
    status === TaskStatus.DONE
      ? 'bg-emerald-500'
      : status === TaskStatus.IN_PROGRESS
        ? 'bg-blue-500'
        : 'bg-slate-300'
  );
  return (
    <div className="relative">
      <Card className="hover:shadow-md transition-shadow cursor-pointer rounded-l-md px-4 py-2">
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

        <CardContent className="flex flex-wrap gap-2 p-0">
          <span className={statusStripeClass} />
          {task.status && (
            <Badge variant="outline">
              {STATUS_COLUMNS.find((s) => s.id === task.status)?.title ??
                task.status}
            </Badge>
          )}

          {/* {task?.map((label) => (
          <Badge key={label} variant="outline">
            {label}
          </Badge>
        ))} */}
        </CardContent>
      </Card>
    </div>
  );
};
