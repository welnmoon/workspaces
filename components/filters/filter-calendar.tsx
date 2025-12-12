import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import { CalendarComponent } from '../ui/calendar';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Calendar1 } from 'lucide-react';
import { isValidDate } from '@/helpers/time/is-valid-date';

const FilterCalendar = ({
  dateRange,
  onSelectHandler,
  className,
}: {
  dateRange: DateRange | undefined;
  onSelectHandler: (dateRange: DateRange | undefined) => void;
  className?: string;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('shadow-none px-2 py-0', className)}
        >
          {dateRange?.from && dateRange?.to ? (
            `${isValidDate(dateRange.from) && format(dateRange.from, 'dd.MM.yyyy')} – ${isValidDate(dateRange.to) && format(dateRange.to, 'dd.MM.yyyy')}`
          ) : (
            <span className="flex gap-2 items-center">
              <Calendar1 /> Выберите диапазон
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto min-w-[500px] p-0" align="start">
        <CalendarComponent
          className="min-w-[500px] "
          mode="range"
          selected={dateRange}
          onSelect={onSelectHandler}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
};

export default FilterCalendar;
