'use client';
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
import type { TaskWithAssigneeDTO } from '@/types/prisma/DTO/tasks';
import { cn } from '@/lib/utils';
import { CreateTaskRowForm } from '@/components/forms/task/create-task-row-form';
import { useCreateTask } from '@/hooks/tasks/use-create-task';
import { usePathname } from 'next/navigation';
import { getIdsFromPathname } from '@/helpers/get-ids-from-path';
import toast from 'react-hot-toast';
import { useState } from 'react';
import BacklogTaskActions from './backlog-task-actions';
import { useMembers } from '@/hooks/members/use-members';
import { useChangeTaskAssignee } from '@/hooks/tasks/use-change-assignee';
import { MembershipSelectUserDTO } from '@/types/prisma/DTO/memberships';

type BacklogAccordionProps = {
  tasks: TaskWithAssigneeDTO[];
};

const BacklogAccordion = ({ tasks }: BacklogAccordionProps) => {
  const [hoverId, setHoverId] = useState<number>();
  const pathname = usePathname();
  const { projectId, workspaceId } = getIdsFromPathname(pathname);

  const { mutate: onCreateTask, isPending: isCreateTaskPending } =
    useCreateTask(workspaceId!, projectId!);

  const { data: members } = useMembers(workspaceId!, projectId!);
  const { mutate: onChangeAssignee, isPending: onChangeAssigneePending } =
    useChangeTaskAssignee(workspaceId!, projectId!);

  // handlers

  const onChangeAssigneeHandler = (
    taskId: number,
    assigneeId: string | null,
    assignee?: MembershipSelectUserDTO['user']
  ) => {
    onChangeAssignee({ taskId, assigneeId, assignee }, { onSuccess: () => {} });
  };

  const handleCreateTask = (payload: { title: string; description?: string }) =>
    onCreateTask(payload, {
      onSuccess: () => {
        toast.success('Задача успешно создана');
      },
      onError: () => {
        toast.error('Не удалось создать задачу');
      },
    });
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue={`Бэклог`}
    >
      <AccordionItem value={`backlog`}>
        <AccordionTrigger className="flex items-center justify-between">
          <span className="font-semibold">Бэклог</span>
          <span className="text-xs text-muted-foreground">
            {tasks.length} задач
          </span>
        </AccordionTrigger>

        <AccordionContent className="flex flex-col gap-3 text-sm">
          {tasks.length === 0 ? (
            <div className="text-muted-foreground text-sm">
              В бэклоге пока нет задач
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
                    <TableHead className="px-4 py-3"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-sm">
                  {tasks.map((t) => {
                    const statusTitle =
                      STATUS_COLUMNS.find((s) => s.id === t.status)?.title ??
                      t.status;
                    const priorityLabel = TASK_PRIORITY_LABELS[t.priority];
                    // const due =
                    //   t.dueDate && new Date(t.dueDate).toLocaleDateString();
                    const assigneeName = t.assignee
                      ? `${t.assignee.firstName || ''} ${t.assignee.lastName || ''}`.trim() ||
                        t.assignee.email
                      : 'Не назначен';

                    return (
                      <TableRow
                        onMouseEnter={() => setHoverId(t.id)}
                        key={t.id}
                        className="transition hover:bg-zinc-50"
                      >
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
                          {hoverId === t.id && (
                            <BacklogTaskActions
                              disabled={isCreateTaskPending}
                              onMove={() => {}}
                              onChangeStatus={() => {}}
                              onChangePriority={() => {}}
                              onChangeAssignee={onChangeAssigneeHandler}
                              onDelete={() => {}}
                              members={members}
                              taskId={t.id}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <CreateTaskRowForm
                onCreate={handleCreateTask}
                isLoading={isCreateTaskPending}
              />
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default BacklogAccordion;
