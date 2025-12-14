'use client';

import { useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import ChartsCard from './charts-card';
import { DateRange } from 'react-day-picker';
import { useTasksByStatus } from '@/hooks/analytics/project/use-tasks-by-status';
import { usePathname } from 'next/navigation';
import { getIdsFromPathname } from '@/helpers/get-ids-from-path';
import { Spinner } from '../ui/spinner';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';

const data = [
  { name: 'Group A', value: 400, fill: '#0088FE' },
  { name: 'Group B', value: 300, fill: '#00C49F' },
  { name: 'Group C', value: 300, fill: '#FFBB28' },
  { name: 'Group D', value: 200, fill: '#FF8042' },
  { name: 'Group D', value: 200, fill: '#FBe342' },
  { name: 'Group D', value: 200, fill: '#F0d022' },
];

// #endregion
export default function TasksByStatusPieChart({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean;
}) {
  const pathname = usePathname();
  const { projectId, workspaceId } = getIdsFromPathname(pathname);
  const { data, isLoading, isError, isFetching } = useTasksByStatus(
    workspaceId!,
    projectId!
  );

  const getPercent = (stat: number) => {
    const total = data?.tasksCount ?? 0;

    return Math.round((stat / total) * 100);
  };

  const tasksStats = [
    // {
    //   name: 'Всего задач',
    //   value: data?.tasksCount ?? 0,
    //   fill: '#64748B', // нейтральный серо-синий
    // },
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
      {isLoading ? (
        <Skeleton className="w-100 h-100" />
      ) : (
        <ChartsCard noCalendar className="" title="Задачи по статусам">
          <Button>В проекте</Button> {/*добавить выборку конкретного спринта*/}
          <div className="flex flex-row gap-4 relative">
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
              height={200}
              width={200}
            />
            {isFetching ||
              (isLoading && <Spinner className="absolute left-1/2 top-1/2" />)}
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
      )}
    </>
  );
}
