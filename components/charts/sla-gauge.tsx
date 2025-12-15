import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import ChartsCard from './charts-card';
import { useSLATasks } from '@/hooks/analytics/project/use-sla-tasks';
import { Spinner } from '../ui/spinner';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';

const SLAGauge = ({
  workspaceId,
  projectId,
}: {
  workspaceId: number;
  projectId: number;
}) => {
  const { data, isLoading, isFetching } = useSLATasks(workspaceId, projectId);
  const settings = {
    width: 200,
    height: 200,
    value: data?.SLA ? Number(data.SLA) : 0,
  };
  return (
    <ChartsCard
      desc="Процент задач, завершённых в срок"
      title="SLA"
      noCalendar
      info="Показывает долю задач с дедлайном, закрытых в срок"
    >
      <div
        className={cn('relative', (isFetching || isLoading) && 'opacity-30')}
      >
        <Gauge
          {...settings}
          cornerRadius="50%"
          sx={(theme) => ({
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 40,
            },
            [`& .${gaugeClasses.valueArc}`]: {
              fill: '#4BB543',
            },
            [`& .${gaugeClasses.referenceArc}`]: {
              fill: '#f4f4f5',
            },
          })}
        />
        {isLoading ||
          (isFetching && <Spinner className="absolute top-1/2 left-1/2" />)}
      </div>
      <div className="flex gap-2 flex-wrap">
        <Badge className="text-[16px]" variant={'outline'}>
          SLA = Завершено в срок <span className="text-red-500 mx-2">/</span>{' '}
          Всего задач с дедлайном
        </Badge>
        <Badge className="text-[16px]" variant={'success'}>
          {isLoading || isFetching ? (
            <Spinner className="mr-2" />
          ) : (
            data?.completedTasksInDeadlineCount
          )}{' '}
          задач из{' '}
          {isLoading || isFetching ? (
            <Spinner className="ml-2" />
          ) : (
            data?.totalTasksCount
          )}
        </Badge>
      </div>
    </ChartsCard>
  );
};

export default SLAGauge;
