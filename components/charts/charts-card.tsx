import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Heading } from '../ui/heading';
import FilterCalendar from '../filters/filter-calendar';
import { DateRange } from 'react-day-picker';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Info } from 'lucide-react';

const ChartsCard = ({
  children,
  title,
  desc,
  className,
  dateRange,
  onSelectHandler,
  noCalendar,
  info,
}: {
  children: React.ReactNode;
  title?: string;
  desc?: string;
  className?: string;
  dateRange?: DateRange | undefined;
  onSelectHandler?: (dateRange: DateRange | undefined) => void;
  noCalendar?: boolean;
  info?: string;
}) => {
  const handleSelect = onSelectHandler || (() => {});
  return (
    <Card className={cn('min-w-content shadow-none', className)}>
      <CardHeader>
        <CardTitle className="flex pb-2 flex-col gap-2">
          <Heading level={3} className="flex items-center gap-2">
            {title}
            {info && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>{info}</TooltipContent>
              </Tooltip>
            )}
          </Heading>
          {!noCalendar && (
            <FilterCalendar
              dateRange={dateRange}
              onSelectHandler={handleSelect}
            />
          )}
        </CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default ChartsCard;
