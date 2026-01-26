'use client';

import { PieChart } from '@mui/x-charts/PieChart';
import ChartsCard from './charts-card';
import { useTasksByStatus } from '@/hooks/analytics/project/use-tasks-by-status';
import { usePathname } from 'next/navigation';
import { getIdsFromPathname } from '@/helpers/get-ids-from-path';
import { Spinner } from '../ui/spinner';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

             
export default function TasksByStatusPieChart() {
  const pathname = usePathname();
  const { projectId, workspaceId } = getIdsFromPathname(pathname);
  const { data, isLoading, isFetching } = useTasksByStatus(
    workspaceId!,
    projectId!
  );
  const totalTasks = data?.tasksCount ?? 0;
  const hasData = totalTasks > 0;

  const getPercent = (stat: number) => {
    if (totalTasks <= 0) return 0;

    return Math.round((stat / totalTasks) * 100);
  };

  const tasksStats = [
    {
      name: 'Выполнено',
      value: getPercent(data?.tasksDoneCount ?? 0),
      fill: '#22C55E',                   
    },
    {
      name: 'В работе',
      value: getPercent(data?.tasksInProgressCount ?? 0),
      fill: '#3B82F6',                   
    },
    {
      name: 'В очереди',
      value: getPercent(data?.tasksToDoCount ?? 0),
      fill: '#F59E0B',                        
    },
    {
      name: 'Заблокировано',
      value: getPercent(data?.tasksBlockedCount ?? 0),
      fill: '#A855F7',                                        
    },
    {
      name: 'Просрочено',
      value: getPercent(data?.tasksOverdueCount ?? 0),
      fill: '#EF4444',                      
    },
  ];

  return (
    <>
      <ChartsCard
        noCalendar
        className="relative h-[520px] pb-2"
        title="Задачи по статусам"
        info="Распределение задач по статусам в текущем проекте"
      >
        <Badge variant={'warning'} className="mb-4">
          Данные доступны только по проекту. Аналитика по спринтам будет добавлена позже
        </Badge>
        <div className="flex items-center flex-col xl:flex-row gap-4">
          <div className="relative overflow-x-auto">
            {hasData && (
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
                    valueFormatter: (item: { value: number }) =>
                      `${item.value}%`,
                  },
                ]}
                className={cn(
                  '',
                  (isLoading || isFetching) && 'opacity-50 pointer-events-none'
                )}
                height={200}
                width={200}
              />
            )}
            {!hasData && !isLoading && !isFetching && (
              <div className="p-4 text-center text-gray-500">
                Нет данных для отображения
              </div>
            )}
          </div>

          {hasData && (
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
          )}
        </div>
        {(isFetching || isLoading) && (
          <Spinner className="absolute left-1/2 top-1/2 z-10" />
        )}
      </ChartsCard>
    </>
  );
}
