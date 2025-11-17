import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format } from 'date-fns';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Calendar1 } from 'lucide-react';
import { Heading } from '../ui/heading';

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
    <div className="flex flex-col gap-2">
      <Heading level={3}>Дата от и до</Heading>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn('', className)}>
            {dateRange?.from && dateRange?.to ? (
              `${format(dateRange.from, 'dd.MM.yyyy')} – ${format(dateRange.to, 'dd.MM.yyyy')}`
            ) : (
              <span className="flex gap-2 items-center">
                <Calendar1 /> Выберите диапазон
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto min-w-[500px] p-0" align="start">
          <Calendar
            className="min-w-[500px] "
            mode="range"
            selected={dateRange}
            onSelect={onSelectHandler}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FilterCalendar;
