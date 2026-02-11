'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { formatDateTimeRu } from '../../../shared/lib/date/format-date-time-ru';
import type { ProjectListItemDto } from '../../../shared/types/DTO/project';
import { SortHeader } from '../../user/model/user-columns';
import ProjectEditDropdownMenu from '../ui/project-edit-dropdown-menu';

export const projectColumns: ColumnDef<ProjectListItemDto>[] = [
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
  // {
  //   accessorKey: 'workspace',
  //   header: ({ column }) => <SortHeader column={column} title="Workspace" />,
  //   cell: ({ row }) => row.original.workspace.name,
  //   enableSorting: true,
  //   sortingFn: (rowA, rowB) => {
  //     const nameA = rowA.original.workspace.name;
  //     const nameB = rowB.original.workspace.name;
  //     return nameA.localeCompare(nameB);
  //   },
  // },
  {
    accessorKey: 'sprintsCount',
    header: ({ column }) => <SortHeader column={column} title="Sprints" />,
    cell: ({ row }) => (row.original.Sprint ? row.original.Sprint.length : 0),
    enableSorting: true,
    sortingFn: (rowA, rowB) =>
      rowA.original.Sprint!.length - rowB.original.Sprint!.length,
  },
  {
    accessorKey: 'tasksCount',
    header: ({ column }) => <SortHeader column={column} title="Tasks" />,
    cell: ({ row }) => {
      return (
        <div className="w-20">
          <span className="text-green-500">{row.original.tasksDone}</span> /{' '}
          <span>{row.original.tasksTotal}</span>
        </div>
      );
    },
    enableSorting: true,
    sortingFn: (rowA, rowB) =>
      rowA.original.tasksTotal! - rowB.original.tasksDone!,
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
  {
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const project = row.original;

      return <ProjectEditDropdownMenu project={project} />;
    },
  },
];
