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

export const TasksPageTaskCard = ({ task }: { task: TaskFullDTO }) => {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader>
        <CardTitle className="text-base font-semibold">{task.title}</CardTitle>
        {task.description && (
          <CardDescription className="line-clamp-2">
            {task.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex flex-wrap gap-2">
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
  );
};
