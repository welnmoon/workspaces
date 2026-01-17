'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { formatDateTimeRu } from '../../../shared/lib/date/format-date-time-ru';
import type { TaskAssigneeDTO, TaskDTO } from '../../../shared/types/DTO/task';
import { SortHeader } from '../../user/model/user-columns';
import TaskEditDropdownMenu from '../ui/task-edit-dropdown-menu';

const getAssigneeLabel = (assignee: TaskAssigneeDTO | null) => {
  if (!assignee) return 'Unassigned';

  const fullName = [assignee.firstName, assignee.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();

  if (fullName) return fullName;
  return assignee.email ?? 'Unassigned';
};

const getDateSortValue = (value: unknown) => {
  if (!value) return null;

  const date = new Date(String(value));
  const time = date.getTime();
  return Number.isNaN(time) ? null : time;
};

export const taskColumns: ColumnDef<TaskDTO>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => row.getValue('id'),
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <SortHeader column={column} title="Title" />,
    cell: ({ row }) => row.getValue('title'),
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <SortHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <span className="uppercase">{row.getValue('status')}</span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => <SortHeader column={column} title="Priority" />,
    cell: ({ row }) => (
      <span className="uppercase">{row.getValue('priority')}</span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'assignee',
    header: ({ column }) => <SortHeader column={column} title="Assignee" />,
    cell: ({ row }) => <span>{getAssigneeLabel(row.original.assignee)}</span>,
    enableSorting: true,
    sortingFn: (rowA, rowB) =>
      getAssigneeLabel(rowA.original.assignee).localeCompare(
        getAssigneeLabel(rowB.original.assignee)
      ),
  },
  {
    accessorKey: 'project',
    header: ({ column }) => <SortHeader column={column} title="Project" />,
    cell: ({ row }) => row.original.project.name,
    enableSorting: true,
    sortingFn: (rowA, rowB) =>
      rowA.original.project.name.localeCompare(rowB.original.project.name),
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => (
      <SortHeader column={column} title="Due Date" isDate />
    ),
    enableSorting: true,
    cell: ({ row }) => (
      <span className="capitalize">
        {formatDateTimeRu(row.getValue('dueDate'))}
      </span>
    ),
    sortingFn: (rowA, rowB, columnId) => {
      const timeA = getDateSortValue(rowA.getValue(columnId));
      const timeB = getDateSortValue(rowB.getValue(columnId));

      if (timeA === null && timeB === null) return 0;
      if (timeA === null) return 1;
      if (timeB === null) return -1;
      return timeA - timeB;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const task = row.original;

      return <TaskEditDropdownMenu task={task} />;
    },
  },
];
