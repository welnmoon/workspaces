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
}: {
  children: React.ReactNode;
  title: string;
  desc: string;
  className?: string;
  dateRange: DateRange | undefined;
  onSelectHandler: (dateRange: DateRange | undefined) => void;
}) => {
  return (
    <Card className={cn('min-w-content shadow-none', className)}>
      <CardHeader>
        <CardTitle className="flex flex-col gap-2">
          <Heading level={3}>{title}</Heading>
          <div>
            <FilterCalendar
              dateRange={dateRange}
              onSelectHandler={onSelectHandler}
            />
            {/* {dateRange?.from && dateRange?.to && (
              <Badge variant={'outline'}>
                {dateRange.from.toDateString()} → {dateRange.to.toDateString()}
              </Badge>
            )} */}
          </div>
        </CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default ChartsCard;
