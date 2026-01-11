'use client';

import type { ColumnDef } from '@tanstack/react-table';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../shared/ui/dropdown-menu';
import type { WorkspaceDTO } from '../../types/DTO/workspace';

export const workspaceColumns: ColumnDef<WorkspaceDTO>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => row.getValue('id'),
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => row.getValue('name'),
  },

  {
    accessorKey: 'projectsCount',
    header: 'Projects',
    cell: ({ row }) => (
      <span className="lowercase ">{row.original.projects.length}</span>
    ),
  },
  {
    accessorKey: 'tasksCount',
    header: 'Tasks',
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

      return (
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent
            style={{ padding: '10px' }}
            className="w-40 h-full p-3"
          >
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              style={{ padding: '2px 6px' }}
              className="px-2 py-1"
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
