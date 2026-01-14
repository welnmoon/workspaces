'use client';

import type { ColumnDef } from '@tanstack/react-table';

import type { WorkspaceFullDTO } from '../../types/DTO/workspace';
import { formatDateTimeRu } from '../../shared/lib/date/format-date-time-ru';
import WorkspaceEditDropdownMenu from './ui/workspace-edit-dropdown-menu';
import { SortHeader } from '../users/user-columns';

export const workspaceColumns: ColumnDef<WorkspaceFullDTO>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => row.getValue('id'),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <SortHeader column={column} title="Name" />,
    cell: ({ row }) => row.getValue('name'),
  },

  {
    accessorKey: 'projectsCount',
    header: ({ column }) => <SortHeader column={column} title="Projects" />,
    cell: ({ row }) => (
      <span className="lowercase ">{row.original.projects.length}</span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'tasksCount',
    header: ({ column }) => <SortHeader column={column} title="Tasks" />,
    cell: ({ row }) => {
      const doneTasks = row.original.projects.reduce(
        (sum, p) => sum + p.tasks.filter((t) => t.status === 'DONE').length,
        0
      );
      const allTasks = row.original.projects.reduce(
        (sum, p) => sum + p.tasks.length,
        0
      );
      return (
        <div className="w-20">
          <span className="text-green-500">{doneTasks}</span> /{' '}
          <span>{allTasks}</span>
        </div>
      );
    },
    sortingFn: (rowA, rowB, columnId) => {
      const tasksA = rowA.original.projects.reduce(
        (sum, p) => sum + p.tasks.length,
        0
      );
      const tasksB = rowB.original.projects.reduce(
        (sum, p) => sum + p.tasks.length,
        0
      );
      return tasksA - tasksB;
    },
  },
  {
    accessorKey: 'avatarUrl',
    header: 'avatarUrl ',
    cell: ({ row }) => (
      <span className="capitalize">{row.getValue('avatarUrl')}</span>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const w = row.original;

      return <WorkspaceEditDropdownMenu workspace={w} />;
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <SortHeader column={column} title="Created At" isDate />
    ),
    enableSorting: true,
    cell: ({ row }) => (
      <span className="capitalize">
        {formatDateTimeRu(row.getValue('createdAt'))}
      </span>
    ),
    sortingFn: (rowA, rowB, columnId) => {
      const dateA = new Date(rowA.getValue(columnId));
      const dateB = new Date(rowB.getValue(columnId));
      return dateA.getTime() - dateB.getTime();
    },
  },
];
