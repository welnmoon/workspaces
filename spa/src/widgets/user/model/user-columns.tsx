'use client';

import type { Column, ColumnDef } from '@tanstack/react-table';
import { formatDateTimeRu } from '../../../shared/lib/date/format-date-time-ru';
import UserEditDropdownMenu from '../ui/user-edit-dropdown-menu';
import type { UserDTO } from '../../../shared/types/DTO/user';

type SortHeaderProps<TData> = {
  column: Column<TData, unknown>;
  title: string;
  isDate?: boolean;
};

export const SortHeader = <TData,>({
  column,
  title,
}: SortHeaderProps<TData>) => {
  const dir = column.getIsSorted();

  return (
    <button
      type="button"
      className="inline-flex items-center gap-0.5"
      onClick={column.getToggleSortingHandler()}
    >
      {title}
      <span aria-hidden>
        {dir === 'asc' ? '↑' : dir === 'desc' ? '↓' : '↕'}
      </span>
    </button>
  );
};

export const userColumns: ColumnDef<UserDTO>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => row.getValue('id'),
  },
  {
    accessorKey: 'firstName',
    header: ({ column }) => <SortHeader column={column} title="First name" />,
    cell: ({ row }) => row.getValue('firstName'),
    enableSorting: true,
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => <SortHeader column={column} title="Last name" />,
    cell: ({ row }) => row.getValue('lastName'),
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <SortHeader column={column} title="Email" />,
    cell: ({ row }) => (
      <span className="lowercase">{row.getValue('email')}</span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'wasOnline',
    header: ({ column }) => (
      <SortHeader isDate column={column} title="Was online" />
    ),
    cell: ({ row }) => (
      <span className="capitalize">
        {formatDateTimeRu(row.getValue('wasOnline'))}
      </span>
    ),
    enableSorting: true,
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
      const user = row.original;

      return <UserEditDropdownMenu user={user} />;
    },
  },
];
