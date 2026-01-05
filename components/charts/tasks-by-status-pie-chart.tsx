'use client';

import { PieChart } from '@mui/x-charts/PieChart';
import ChartsCard from './charts-card';
import { useTasksByStatus } from '@/hooks/analytics/project/use-tasks-by-status';
import { usePathname } from 'next/navigation';
import { getIdsFromPathname } from '@/helpers/get-ids-from-path';
import { Spinner } from '../ui/spinner';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

// #endregion
export default function TasksByStatusPieChart() {
  const pathname = usePathname();
  const { projectId, workspaceId } = getIdsFromPathname(pathname);
  const { data, isLoading, isFetching } = useTasksByStatus(
    workspaceId!,
    projectId!
  );

  const getPercent = (stat: number) => {
    const total = data?.tasksCount ?? 0;

    return Math.round((stat / total) * 100);
  };

  const tasksStats = [
    {
      name: 'Выполнено',
      value: getPercent(data?.tasksDoneCount ?? 0),
      fill: '#22C55E', // зелёный — успех
    },
    {
      name: 'В работе',
      value: getPercent(data?.tasksInProgressCount ?? 0),
      fill: '#3B82F6', // синий — процесс
    },
    {
      name: 'В очереди',
      value: getPercent(data?.tasksToDoCount ?? 0),
      fill: '#F59E0B', // оранжевый — ожидание
    },
    {
      name: 'Заблокировано',
      value: getPercent(data?.tasksBlockedCount ?? 0),
      fill: '#A855F7', // фиолетовый — нестандартное состояние
    },
    {
      name: 'Просрочено',
      value: getPercent(data?.tasksOverdueCount ?? 0),
      fill: '#EF4444', // красный — проблема
    },
  ];

  return (
    <>
      <ChartsCard
        noCalendar
        className="pb-2"
        title="Задачи по статусам"
        info="Распределение задач по статусам в текущем проекте"
      >
        <Badge variant={'warning'} className="mb-4">
          Пока что только по проекту, скоро добавлю по спринтам
        </Badge>
        <div className="flex items-center flex-col xl:flex-row gap-4">
          <div className="relative overflow-x-auto">
            <PieChart
              series={[
                {
                  data: tasksStats,
                  highlightScope: { fade: 'global', highlight: 'item' },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: 'gray',
                  },
                  valueFormatter: (item: { value: number }) => `${item.value}%`,
                },
              ]}
              className={cn(
                '',
                (isLoading || isFetching) && 'opacity-50 pointer-events-none'
              )}
              height={200}
              width={200}
            />
            {(isFetching || isLoading) && (
              <Spinner className="absolute left-1/2 top-1/2" />
            )}
          </div>

          <section>
            {tasksStats.map((s) => (
              <p key={s.name} className="flex gap-2">
                <span
                  className={cn(
                    'rounded-full w-5 h-5 inline-block',
                    s.value === 0 && 'opacity-50'
                  )}
                  style={{ backgroundColor: s.fill }}
                />{' '}
                {s.name}
              </p>
            ))}
          </section>
        </div>
      </ChartsCard>
    </>
  );
}
