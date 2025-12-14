import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Heading } from '../ui/heading';
import FilterCalendar from '../filters/filter-calendar';
import { DateRange } from 'react-day-picker';
import { Badge } from '../ui/badge';

const ChartsCard = ({
  children,
  title,
  desc,
  className,
  dateRange,
  onSelectHandler,
  noCalendar,
}: {
  children: React.ReactNode;
  title?: string;
  desc?: string;
  className?: string;
  dateRange?: DateRange | undefined;
  onSelectHandler?: (dateRange: DateRange | undefined) => void;
  noCalendar?: boolean;
}) => {
  const handleSelect = onSelectHandler || (() => {});
  return (
    <Card className={cn('min-w-content shadow-none', className)}>
      <CardHeader>
        <CardTitle className="flex pb-2 flex-col gap-2">
          <Heading level={3}>{title}</Heading>
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
