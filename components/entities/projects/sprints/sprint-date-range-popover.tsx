import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { formatDateTimeRange } from '@/helpers/format-date';
import { Calendar } from 'lucide-react';
import { CalendarComponent } from '@/components/ui/calendar';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

const SprintDateRangePopover = ({
  initialStartDate,
  initialEndDate,
  handleChangeDates,
  isPending,
  closePopover,
}: {
  initialStartDate: Date | undefined | null;
  initialEndDate: Date | undefined | null;
  handleChangeDates: (payload: { startDate: string; endDate: string }) => void;
  isPending: boolean;
  closePopover: boolean;
}) => {
  const [range, setRange] = useState<DateRange | undefined>({
    from: initialStartDate ? new Date(initialStartDate) : undefined,
    to: initialEndDate ? new Date(initialEndDate) : undefined,
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setRange({
      from: initialStartDate ? new Date(initialStartDate) : undefined,
      to: initialEndDate ? new Date(initialEndDate) : undefined,
    });
  }, [initialStartDate, initialEndDate]);

  useEffect(() => {
    if (closePopover) {
      setOpen(false);
    }
  }, [closePopover]);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <button
          onClick={() => setOpen((prev) => !prev)}
          type="button"
          className="inline-flex gap-2 h-8 max-w-50 px-2 min-w-fit items-center justify-center rounded hover:bg-muted"
          tabIndex={-1}
        >
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-zinc-500">
            {range && (range.from || range.to)
              ? formatDateTimeRange(range.from, range.to, 'ru-RU', 'спринта', 'UTC')
              : 'Дата спринта не выбрана'}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[520px]">
        <CalendarComponent
          lang="ru"
          mode="range"
          selected={range}
          onSelect={setRange}
          numberOfMonths={2}
          className="w-[500px]"
        />
        <Button
          disabled={!range?.from || !range?.to || isPending}
          onClick={() =>
            range?.from && range?.to &&
            handleChangeDates({
              startDate: range.from.toISOString(),
              endDate: range.to.toISOString(),
            })
          }
        >
          {isPending ? <Spinner /> : 'Применить'}
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default SprintDateRangePopover;
