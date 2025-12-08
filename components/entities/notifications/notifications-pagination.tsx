'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const NotificationsPagination = ({
  pagesCount,
  currentPage,
}: {
  pagesCount: number;
  currentPage: number;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

//   if (pagesCount <= 1) return null; 

  const pages = Array.from({ length: pagesCount }, (_, i) => i + 1);

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    return `${pathname}?${params.toString()}`;
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > pagesCount || page === currentPage) return;
    router.push(createPageUrl(page));
  };

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < pagesCount;

  return (
    <Pagination>
      <PaginationContent>
        {/* PREV */}
        <PaginationItem>
          <PaginationPrevious
            href={hasPrev ? createPageUrl(currentPage - 1) : undefined}
            onClick={(e) => {
              e.preventDefault();
              if (hasPrev) goToPage(currentPage - 1);
            }}
          />
        </PaginationItem>

        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={createPageUrl(page)}
              isActive={page === currentPage}
              onClick={(e) => {
                e.preventDefault();
                goToPage(page);
              }}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={hasNext ? createPageUrl(currentPage + 1) : undefined}
            onClick={(e) => {
              e.preventDefault();
              if (hasNext) goToPage(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default NotificationsPagination;
