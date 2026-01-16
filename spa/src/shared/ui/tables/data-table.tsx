// components/data-table.tsx
'use client';

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../table';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';
import { Spinner } from '../spinner';
import { useState } from 'react';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../pagination';

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  isError?: boolean;
  error: FetchBaseQueryError | SerializedError | undefined;
  pageSize?: number;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  isError,
  error,
  pageSize = 5,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize },
    },
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  if (isError)
    return <div className="text-red-500">Error {JSON.stringify(error)}</div>;

  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();
  const canPrev = table.getCanPreviousPage();
  const canNext = table.getCanNextPage();

  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <Table style={{ marginBottom: '20px' }}>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow className="h-10 " key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell className="min-w-10 " key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={!canPrev}
              className={!canPrev ? 'pointer-events-none opacity-50' : ''}
              onClick={(e) => {
                e.preventDefault();
                if (!canPrev) return;
                table.previousPage();
              }}
            />
          </PaginationItem>

          {Array.from({ length: pageCount }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                isActive={i === pageIndex}
                onClick={(e) => {
                  e.preventDefault();
                  table.setPageIndex(i);
                }}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={!canNext}
              className={!canNext ? 'pointer-events-none opacity-50' : ''}
              onClick={(e) => {
                e.preventDefault();
                if (!canNext) return;
                table.nextPage();
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
