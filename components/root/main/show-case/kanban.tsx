'use client';

import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import CaseCard from './case-card';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import { useFullyInView } from '@/hooks/use-in-viewport-fully';

type KanbanProps = {
  className?: string;
  info?: string;
};

const Kanban = ({ className = '', info }: KanbanProps) => {
  const { ref, isFullyVisible } = useFullyInView<HTMLDivElement>();

  // Hover-анимации включаем ТОЛЬКО когда секция полностью в экране
  const hoverAnim = isFullyVisible
    ? 'transition-transform duration-300 ease-out group-hover:-translate-x-10 group-hover:rotate-3'
    : '';

  return (
    <section
      ref={ref}
      className={cn('border-b border-r border-zinc-100', className)}
    >
      <TooltipProvider>
        <CaseCard
          title="Kanban Board"
          titleHoverEffect
          containerClassName="relative min-h-[300px] h-full max-h-[400px] overflow-hidden"
          titleClassName="w-1/3 relative z-10"
        >
          {info && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 absolute bottom-2 left-2 text-muted-foreground cursor-pointer z-20" />
              </TooltipTrigger>
              <TooltipContent side="top">{info}</TooltipContent>
            </Tooltip>
          )}

          {/* Полоски */}
          <div className="absolute -top-10 right-0 h-full">
            {/* Blue */}
            <div
              className={cn(
                'h-[130%] bg-blue-200 w-10 absolute right-8 -top-10 z-0 flex items-center justify-center',
                hoverAnim
              )}
            >
              <span className="text-md font-semibold text-blue-800 whitespace-nowrap -rotate-90">
                В процессе
              </span>
            </div>

            {/* Green */}
            <div
              className={cn(
                'h-[130%] bg-green-200 w-10 absolute -right-2 -top-10 z-0',
                hoverAnim
              )}
            />

            {/* Yellow */}
            <div
              className={cn(
                'h-[130%] bg-yellow-200 w-10 absolute right-18 -top-10 z-0',
                hoverAnim
              )}
            />

            {/* Red */}
            <div
              className={cn(
                'h-[130%] bg-red-200 w-10 absolute -right-12 -top-10 z-0',
                hoverAnim
              )}
            />
          </div>
        </CaseCard>
      </TooltipProvider>
    </section>
  );
};

export default Kanban;
