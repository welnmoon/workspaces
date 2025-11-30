import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { TaskStatusDTO } from '@/const/tasks-status';
import { DateRange } from 'react-day-picker';
import { Filter, X } from 'lucide-react';
import ProjectTasksFilterByStatusSelect from './project-tasks-filter-by-status-select';
import FilterCalendar from './filter-calendar';

type TasksFilterPopoverProps = {
  status: TaskStatusDTO | 'ALL';
  setStatus: (status: TaskStatusDTO | 'ALL') => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  resetFilters: () => void;
  hasAnyFilter: boolean;
  className?: string;
};

const TasksFilterPopover = ({
  status,
  setStatus,
  dateRange,
  setDateRange,
  resetFilters,
  hasAnyFilter,
  className,
}: TasksFilterPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={hasAnyFilter ? 'secondary' : 'outline'}
          className={cn(
            'h-9 gap-2 text-sm shadow-sm',
            hasAnyFilter && 'border-primary/50 bg-primary/5 text-primary-700',
            className
          )}
        >
          <Filter className="h-4 w-4" />
          Фильтры
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[320px] sm:w-[420px] p-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-semibold">Настройки фильтра</div>
          {hasAnyFilter && (
            <Button variant="ghost" size="sm" className="h-8 px-2" onClick={resetFilters}>
              <X className="h-4 w-4" />
              <span className="sr-only">Сбросить</span>
            </Button>
          )}
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Статус задачи</p>
            <ProjectTasksFilterByStatusSelect
              className="w-full"
              status={status}
              setStatus={(s) => setStatus((s as TaskStatusDTO) ?? 'ALL')}
            />
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Дата</p>
            <FilterCalendar dateRange={dateRange} onSelectHandler={setDateRange} className="w-full" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={resetFilters}>
            Сбросить
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TasksFilterPopover;
