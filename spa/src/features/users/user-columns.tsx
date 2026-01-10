'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { UserDTO } from '../../types/DTO/user';

export const userColumns: ColumnDef<UserDTO>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => row.getValue('id'),
  },
  {
    accessorKey: 'firstName',
    header: 'First name',
    cell: ({ row }) => row.getValue('firstName'),
  },
  {
    accessorKey: 'lastName',
    header: 'Last name',
    cell: ({ row }) => row.getValue('lastName'),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <span className="lowercase">{row.getValue('email')}</span>
    ),
  },
  {
    accessorKey: 'wasOnline',
    header: 'Was online',
    cell: ({ row }) => (
      <span className="capitalize">{row.getValue('wasOnline')}</span>
    ),
  },
];
