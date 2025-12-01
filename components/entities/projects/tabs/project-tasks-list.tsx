import EmptyState from '@/components/empty-state';
import { MessageInfo } from '@/components/message';
import { TASK_PRIORITY_LABELS } from '@/const/priority';
import { STATUS_COLUMNS } from '@/const/tasks-status';
import type { TaskStatusDTO } from '@/const/tasks-status';
import type { TaskWithAssigneeDTO } from '@/types/prisma/DTO/tasks';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import getTaskStatusColor from '@/helpers/get-status-color';
import { Badge } from '@/components/ui/badge';

type StatusFilter = TaskStatusDTO | 'ALL';

type ProjectTabsListProps = {
  listTasks: TaskWithAssigneeDTO[];
  hasAnyFilter: boolean;
  hasStatusFilter: boolean;
  hasDateFilter: boolean;
  status: StatusFilter;
  onStatusChange: (
    taskId: number,
    status: TaskStatusDTO
  ) => void | Promise<void>;
  isStatusPending?: boolean;
};

const ProjectTabsList = ({
  listTasks,
  hasAnyFilter,
  hasStatusFilter,
  hasDateFilter,
  status,
  onStatusChange,
  isStatusPending,
}: ProjectTabsListProps) => {
  return (
    <section className="space-y-3">
      {hasAnyFilter && listTasks.length > 0 && (
        <MessageInfo text={`Найдено ${listTasks.length} задач`} />
      )}

      {hasAnyFilter && listTasks.length === 0 && (
        <EmptyState
          title={
            hasStatusFilter && hasDateFilter
              ? `Нет задач со статусом ${status} в выбранном диапазоне`
              : hasStatusFilter
                ? `Нет задач со статусом ${status}`
                : `Нет задач в выбранном диапазоне`
          }
        />
      )}

      {listTasks.length > 0 && (
        <Table>
          <TableHeader className="bg-zinc-50">
            <TableRow className="text-left text-xs font-semibold text-muted-foreground">
              <TableHead className="px-4 py-3">Название</TableHead>
              <TableHead className="px-4 py-3">Статус</TableHead>
              <TableHead className="px-4 py-3">Приоритет</TableHead>
              <TableHead className="px-4 py-3">Исполнитель</TableHead>
              <TableHead className="px-4 py-3">Дедлайн</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-sm">
            {listTasks.map((t) => {
              const statusTitle =
                STATUS_COLUMNS.find((s) => s.id === t.status)?.title ??
                t.status;
              const statusId = (STATUS_COLUMNS.find((s) => s.id === t.status)
                ?.id ?? t.status) as TaskStatusDTO;
              const priorityLabel = TASK_PRIORITY_LABELS[t.priority];
              const due = t.dueDate && new Date(t.dueDate).toLocaleDateString();

              const assigneeName = t.assignee
                ? `${t.assignee.firstName || ''} ${t.assignee.lastName || ''}`.trim() ||
                  t.assignee.email
                : 'Не назначен';

              return (
                <TableRow key={t.id} className="transition hover:bg-zinc-50">
                  <TableCell className="px-4 py-3 font-medium text-foreground">
                    {t.title}
                  </TableCell>
                  <TableCell className={cn('px-4 py-3 text-muted-foreground')}>
                    <Select
                      value={statusId}
                      // disabled={isStatusPending}
                      onValueChange={(value) =>
                        onStatusChange(t.id, value as TaskStatusDTO)
                      }
                    >
                      <SelectTrigger className="h-8 w-40 justify-between px-2">
                        <Badge
                          className={cn(
                            getTaskStatusColor({ taskStatus: statusId }),
                            'text-white font-medium'
                          )}
                        >
                          {statusTitle}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent className="w-44">
                        {STATUS_COLUMNS.map((statusOption) => (
                          <SelectItem
                            key={statusOption.id}
                            value={statusOption.id}
                            className="flex items-center gap-2"
                          >
                            <Badge
                              className={cn(
                                getTaskStatusColor({
                                  taskStatus: statusOption.id,
                                }),
                                'text-white font-medium'
                              )}
                            >
                              {statusOption.title}
                            </Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">
                    {priorityLabel}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">
                    {assigneeName}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">
                    {due || '—'}
                  </TableCell>
                </TableRow>
              );
            })}

            {listTasks.length === 0 && !hasAnyFilter && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-4 py-6 text-center text-sm text-muted-foreground"
                >
                  Задач пока нет
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </section>
  );
};

export default ProjectTabsList;
