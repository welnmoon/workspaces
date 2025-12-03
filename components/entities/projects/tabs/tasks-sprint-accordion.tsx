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
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getIdsFromPathname } from '@/helpers/get-ids-from-path';
import { useCreateTask } from '@/hooks/tasks/use-create-task';
import { useChangeTaskAssignee } from '@/hooks/tasks/use-change-assignee';
import { useMembers } from '@/hooks/members/use-members';
import { MembershipSelectUserDTO } from '@/types/prisma/DTO/memberships';
import toast from 'react-hot-toast';
import BacklogTaskActions from './backlog-task-actions';
import { CreateTaskRowForm } from '@/components/forms/task/create-task-row-form';
import { CreateTaskFormValues } from '@/schemas/tasks/create-task-form-schemas';
import { useSprintTasks } from '@/hooks/tasks/use-sprints-tasks';
import { useQueryClient } from '@tanstack/react-query';
import { clientRoutes } from '@/lib/routes/client-routes';
import { FaRegCheckSquare, FaRegSquare } from 'react-icons/fa';

const TasksSprintAccordion = ({
  sprint,
  selectedIds,
  setSelectedIds,
  isDeleteTasksPending,
}: {
  sprint: SprintWithTasksWithAssigneesDTO;
  selectedIds?: Set<number>;
  setSelectedIds?: Dispatch<SetStateAction<Set<number>>>;
  isDeleteTasksPending?: boolean;
}) => {
  const [hoverId, setHoverId] = useState<number>();
  
  const pathname = usePathname();
  const router = useRouter();
  const { projectId, workspaceId } = getIdsFromPathname(pathname);
  const withSelection = useMemo(
    () => selectedIds !== undefined && setSelectedIds !== undefined,
    [selectedIds, setSelectedIds]
  );

  const qc = useQueryClient();
  const sprintQueryKey = ['sprintTasks', sprint.id, projectId, workspaceId];

  const { mutate: onCreateTask, isPending: isCreateTaskPending } =
    useCreateTask(workspaceId!, projectId!);

  const { data: members } = useMembers(workspaceId!, projectId!);
  const { data: sprintTasks = [] } = useSprintTasks(
    workspaceId!,
    projectId!,
    sprint.id,
    sprint.tasks
  );
  const { mutate: onChangeAssignee, isPending: onChangeAssigneePending } =
    useChangeTaskAssignee(workspaceId!, projectId!, sprintQueryKey);

  if (!workspaceId || !projectId) {
    router.push(clientRoutes.workspacesPage());
    return;
  }
  // handlers

  const onChangeAssigneeHandler = (
    taskId: number,
    assigneeId: string | null,
    assignee?: MembershipSelectUserDTO['user']
  ) => {
    onChangeAssignee({ taskId, assigneeId, assignee }, { onSuccess: () => {} });
  };

  const handleCreateTask = (payload: CreateTaskFormValues) =>
    onCreateTask(
      { ...payload, sprintId: sprint.id },
      {
        onSuccess: () => {
          toast.success('Задача успешно создана');
          qc.invalidateQueries({ queryKey: sprintQueryKey });
        },
        onError: () => {
          toast.error('Не удалось создать задачу');
        },
      }
    );
  const toggle = (id: number) => {
    if (!withSelection || !setSelectedIds) return;
    setSelectedIds((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };

  const isSelected = (id: number) => (selectedIds ? selectedIds.has(id) : false);
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue={`Бэклог`}
    >
      <AccordionItem value={`backlog`}>
        <AccordionTrigger className="flex items-center justify-between">
          <span className="font-semibold">{sprint.name}</span>
          <span className="text-xs text-muted-foreground">
            {sprintTasks.length} задач
          </span>
        </AccordionTrigger>

        <AccordionContent className="flex flex-col gap-3 text-sm">
          {sprintTasks.length === 0 ? (
            <div className="text-muted-foreground text-sm">
              В спринте пока нет задач
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              <Table>
                <TableHeader className="bg-zinc-50">
                  <TableRow className="text-left text-xs font-semibold text-muted-foreground">
                    {withSelection && <TableHead className="w-10 px-4 py-3" />}
                    <TableHead className="px-4 py-3">Название</TableHead>
                    <TableHead className="px-4 py-3">Статус</TableHead>
                    <TableHead className="px-4 py-3">Приоритет</TableHead>
                    <TableHead className="px-4 py-3">Исполнитель</TableHead>
                    <TableHead className="px-4 py-3"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-sm">
                  {sprintTasks.map((t) => {
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
                        className={cn(
                          'transition hover:bg-zinc-50',
                          isSelected(t.id) && 'bg-neutral-50'
                        )}
                      >
                        {withSelection && (
                          <TableCell className="w-10">
                            {isSelected(t.id) ? (
                              <FaRegCheckSquare
                                size={18}
                                className={cn(
                                  isDeleteTasksPending && 'text-muted-foreground'
                                )}
                                onClick={() => toggle(t.id)}
                              />
                            ) : (
                              <FaRegSquare
                                size={18}
                                className={cn(
                                  isDeleteTasksPending && 'text-muted-foreground'
                                )}
                                onClick={() => toggle(t.id)}
                              />
                            )}
                          </TableCell>
                        )}
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

export default TasksSprintAccordion;
