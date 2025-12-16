import { BarChart } from '@mui/x-charts/BarChart';
import ChartsCard from './charts-card';
import { useUserActivity } from '@/hooks/analytics/project/use-user-activity';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { Spinner } from '../ui/spinner';
import { cn } from '@/lib/utils';
import { isValidDate } from '@/helpers/time/is-valid-date';

const UserActivityBarChart = ({
  workspaceId,
  projectId,
  defaultFrom,
  defaultTo,
}: {
  workspaceId: number;
  projectId: number;
  defaultFrom: string;
  defaultTo: string;
}) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(defaultFrom),
    to: new Date(defaultTo),
  });

  const from =
    isValidDate(dateRange?.from) && dateRange && dateRange.from
      ? dateRange.from.toISOString()
      : defaultFrom;
  const to =
    isValidDate(dateRange?.to) && dateRange && dateRange.to
      ? dateRange.to.toISOString()
      : defaultTo;

  const { data, isFetching, isLoading, isError } = useUserActivity(
    workspaceId,
    projectId,
    from,
    to
  );
  const xAxis = data?.points.map((p) => p.user) ?? [];
  const series = [
    {
      label: 'Назначено',
      data: data?.points.map((p) => p.assigned) ?? [],
    },
    {
      label: 'Завершено',
      data: data?.points.map((p) => p.completed) ?? [],
    },
  ];
  return (
    <ChartsCard
      dateRange={dateRange}
      onSelectHandler={setDateRange}
      title="Активность участников"
      className="relative"
      info="Сравнивает, сколько задач назначено и завершено каждым участником"
    >
      <div className="overflow-x-auto">
        <BarChart
          xAxis={[{ data: xAxis, scaleType: 'band' }]}
          series={series}
          height={300}
          className={cn(
            '',
            (isFetching || isLoading) && 'opacity-50 no-pointer-events'
          )}
        />
      </div>
      {(isFetching || isLoading) && (
        <Spinner className="absolute left-1/2 top-1/2 z-10" />
      )}
    </ChartsCard>
  );
};

export default UserActivityBarChart;
