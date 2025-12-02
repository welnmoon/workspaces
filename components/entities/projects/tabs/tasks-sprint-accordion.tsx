import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TASK_PRIORITY_LABELS } from '@/const/priority';
import { STATUS_COLUMNS, TaskStatusDTO } from '@/const/tasks-status';
import getTaskStatusColor from '@/helpers/get-status-color';
import type { SprintWithTasksWithAssigneesDTO } from '@/types/prisma/DTO/sprint';
import { cn } from '@/lib/utils';

const TasksSprintAccordion = ({
  sprint,
}: {
  sprint: SprintWithTasksWithAssigneesDTO;
}) => {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue={`sprint-${sprint.id}`}
    >
      <AccordionItem value={`sprint-${sprint.id}`}>
        <AccordionTrigger className="flex items-center justify-between">
          <span className="font-semibold">{sprint.name}</span>
          <span className="text-xs text-muted-foreground">
            {sprint.tasks.length} задач
          </span>
        </AccordionTrigger>

        <AccordionContent className="flex flex-col gap-3 text-sm">
          {sprint.tasks.length === 0 ? (
            <div className="text-muted-foreground text-sm">
              В спринте пока нет задач
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
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
                  {sprint.tasks.map((t) => {
                    const statusTitle =
                      STATUS_COLUMNS.find((s) => s.id === t.status)?.title ??
                      t.status;
                    const priorityLabel = TASK_PRIORITY_LABELS[t.priority];
                    const due =
                      t.dueDate && new Date(t.dueDate).toLocaleDateString();
                    const assigneeName = t.assignee
                      ? `${t.assignee.firstName || ''} ${t.assignee.lastName || ''}`.trim() ||
                        t.assignee.email
                      : 'Не назначен';

                    return (
                      <TableRow key={t.id} className="transition hover:bg-zinc-50">
                        <TableCell className="px-4 py-3 font-medium text-foreground">
                          {t.title}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-muted-foreground">
                          <Badge
                            className={cn(
                              getTaskStatusColor({
                                taskStatus: t.status as TaskStatusDTO,
                              }),
                              'text-white font-medium'
                            )}
                          >
                            {statusTitle}
                          </Badge>
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
                </TableBody>
              </Table>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default TasksSprintAccordion;
