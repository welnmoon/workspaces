'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { formatDateTimeRu } from '../../../shared/lib/date/format-date-time-ru';
import type { SprintDTO } from '../../../shared/types/DTO/sprint';
import { SortHeader } from '../../user/model/user-columns';
import SprintEditDropdownMenu from '../ui/sprint-edit-dropdown-menu';

const getDateSortValue = (value: unknown) => {
  if (!value) return null;

  const date = new Date(String(value));
  const time = date.getTime();
  return Number.isNaN(time) ? null : time;
};

export const sprintColumns: ColumnDef<SprintDTO>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => row.getValue('id'),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <SortHeader column={column} title="Name" />,
    cell: ({ row }) => row.getValue('name'),
    enableSorting: true,
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
    accessorKey: 'tasksCount',
    header: ({ column }) => <SortHeader column={column} title="Tasks" />,
    cell: ({ row }) => {
      const doneTasks = row.original.tasks.filter(
        (task) => task.status === 'DONE'
      ).length;
      const allTasks = row.original.tasks.length;
      return (
        <div className="w-20">
          <span className="text-green-500">{doneTasks}</span> /{' '}
          <span>{allTasks}</span>
        </div>
      );
    },
    enableSorting: true,
    sortingFn: (rowA, rowB) =>
      rowA.original.tasks.length - rowB.original.tasks.length,
  },
  {
    accessorKey: 'startDate',
    header: ({ column }) => (
      <SortHeader column={column} title="Start Date" isDate />
    ),
    enableSorting: true,
    cell: ({ row }) => (
      <span className="capitalize">
        {formatDateTimeRu(row.getValue('startDate'))}
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
    accessorKey: 'endDate',
    header: ({ column }) => (
      <SortHeader column={column} title="End Date" isDate />
    ),
    enableSorting: true,
    cell: ({ row }) => (
      <span className="capitalize">
        {formatDateTimeRu(row.getValue('endDate'))}
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
      const sprint = row.original;

      return <SprintEditDropdownMenu sprint={sprint} />;
    },
  },
];
