import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import CaseCard from './case-card';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

const Kanban = ({
  className = '',
  info,
}: {
  className?: string;
  info?: string;
}) => {
  return (
    <div className={cn(' border-b border-r border-zinc-100', className)}>
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
                <Info className="h-4 w-4 absolute bottom-2 left-2 text-muted-foreground cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent side="top">{info}</TooltipContent>
            </Tooltip>
          )}
          <div className="h-[130%] bg-blue-200 w-10 group-hover:rotate-3 z-0 absolute right-8 -top-10 transition-transform duration-300 ease-out group-hover:-translate-x-10 flex items-center justify-center">
            <span className="text-md font-semibold text-blue-800 whitespace-nowrap -rotate-90">
              В процессе
            </span>
          </div>
          <div className="h-[130%] bg-green-200 w-10 group-hover:rotate-3 z-0 absolute -right-2 -top-10 transition-transform duration-300 ease-out group-hover:-translate-x-10" />
          <div className="h-[130%] bg-yellow-200 w-10 group-hover:rotate-3 z-0 absolute right-18 -top-10 transition-transform duration-300 ease-out group-hover:-translate-x-10" />
          <div className="h-[130%] bg-red-200 w-10 group-hover:rotate-3 z-0 absolute -right-12 -top-10 transition-transform duration-300 ease-out group-hover:-translate-x-10" />
        </CaseCard>
      </TooltipProvider>
    </div>
  );
};

export default Kanban;
