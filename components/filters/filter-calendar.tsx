import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format } from 'date-fns';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { DateRange } from 'react-day-picker';

const FilterCalendar = ({
  dateRange,
  onSelectHandler,
}: {
  dateRange: DateRange | undefined;
  onSelectHandler: (dateRange: DateRange | undefined) => void;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-auto justify-start text-left">
          {dateRange?.from && dateRange?.to
            ? `${format(dateRange.from, 'dd.MM.yyyy')} – ${format(dateRange.to, 'dd.MM.yyyy')}`
            : 'Выберите диапазон'}
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
  );
};

export default FilterCalendar;
