'use client';
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
import { FaRegSquare, FaRegCheckSquare } from 'react-icons/fa';
import { Dispatch, SetStateAction, useState } from 'react';

import { SprintWithTasksWithAssigneesDTO } from '@/types/prisma/DTO/sprint';
import TasksSprintAccordion from './tasks-sprint-accordion';
import ProjectSprints from './project-sprints';
import ProjectBacklogs from './project-backlogs';

type StatusFilter = TaskStatusDTO | 'ALL';

type ProjectTabsListProps = {
  sprints: SprintWithTasksWithAssigneesDTO[];
  listTasks: TaskWithAssigneeDTO[];
  backlogTasks: TaskWithAssigneeDTO[];
  hasAnyFilter: boolean;
  hasStatusFilter: boolean;
  hasDateFilter: boolean;
  status: StatusFilter;
  onStatusChange: (
    taskId: number,
    status: TaskStatusDTO
  ) => void | Promise<void>;
  isStatusPending?: boolean;
  selectedIds: Set<number>;
  setSelectedIds: Dispatch<SetStateAction<Set<number>>>;
  isDeleteTasksPending: boolean;
};

const ProjectTabsList = ({
  sprints,
  listTasks,
  backlogTasks,
  hasAnyFilter,
  hasStatusFilter,
  hasDateFilter,
  status,
  onStatusChange,
  isStatusPending,
  selectedIds,
  setSelectedIds,
  isDeleteTasksPending,
}: ProjectTabsListProps) => {
  const toggle = (id: number) => {
    setSelectedIds((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };

  const isSelected = (id: number) => selectedIds.has(id);

  return (
    <section className="space-y-3">
      {hasAnyFilter && listTasks.length > 0 && (
        <MessageInfo text={`Найдено ${listTasks.length} задач`} />
      )}
      {sprints.length}
      <ProjectSprints sprints={sprints} />
      <ProjectBacklogs backlogs={backlogTasks} />

      {/* {hasAnyFilter && listTasks.length === 0 && (
        <EmptyState
          title={
            hasStatusFilter && hasDateFilter
              ? `Нет задач со статусом ${status} в выбранном диапазоне`
              : hasStatusFilter
                ? `Нет задач со статусом ${status}`
                : `Нет задач в выбранном диапазоне`
          }
        />
      )} */}
    </section>
  );
};

export default ProjectTabsList;
