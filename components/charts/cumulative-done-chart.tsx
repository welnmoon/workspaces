'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ChartsCard from './charts-card';
import { useProjectsDoneTasks } from '@/hooks/analytics/project/use-projects-done-tasks';
import { Spinner } from '../ui/spinner';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { MessageError } from '../message';
import { DateRange } from 'react-day-picker';
import { isValidDate } from '@/helpers/time/is-valid-date';

export type CumulativeTasks = {
  total: number;
  date: string | null;
};

export default function CumulativeDoneChart({
  workspaceId,
  projectId,
  defaultFrom,
  defaultTo,
}: {
  workspaceId: number;
  projectId: number;
  defaultFrom: string;
  defaultTo: string;
}) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(defaultFrom),
    to: new Date(defaultTo),
  });
  const onDateSelectHandler = (dateRange: DateRange | undefined) => {
    setDateRange(dateRange);
  };

  const from =
    isValidDate(dateRange?.from) && dateRange && dateRange.from
      ? dateRange.from.toISOString()
      : defaultFrom;
  const to =
    isValidDate(dateRange?.to) && dateRange && dateRange.to
      ? dateRange.to.toISOString()
      : defaultTo;

  const {
    data: tasks,
    isError,
    isFetching,
  } = useProjectsDoneTasks(workspaceId, projectId, from, to);
  // const tasksList = [
  //   { date: '2025-11-11', count: 2 },
  //   { date: '2025-11-12', count: 5 },
  //   { date: '2025-11-13', count: 3 },
  //   { date: '2025-11-14', count: 7 },
  //   { date: '2025-11-15', count: 4 },
  //   { date: '2025-11-16', count: 6 },
  //   { date: '2025-11-17', count: 10 },
  //   { date: '2025-11-18', count: 8 },
  //   { date: '2025-11-19', count: 12 },
  //   { date: '2025-11-20', count: 9 },
  //   { date: '2025-11-21', count: 15 },
  //   { date: '2025-11-22', count: 11 },
  //   { date: '2025-11-23', count: 17 },
  //   { date: '2025-11-24', count: 14 },
  //   { date: '2025-11-25', count: 20 },
  //   { date: '2025-11-26', count: 18 },
  //   { date: '2025-11-27', count: 22 },
  //   { date: '2025-11-28', count: 19 },
  //   { date: '2025-11-29', count: 25 },
  //   { date: '2025-11-30', count: 21 },
  //   { date: '2025-12-01', count: 30 },
  //   { date: '2025-12-02', count: 27 },
  //   { date: '2025-12-03', count: 33 },
  //   { date: '2025-12-04', count: 31 },
  //   { date: '2025-12-05', count: 35 },
  //   { date: '2025-12-06', count: 38 },
  //   { date: '2025-12-07', count: 40 },
  //   { date: '2025-12-08', count: 36 },
  //   { date: '2025-12-09', count: 42 },
  //   { date: '2025-12-10', count: 45 },
  //   { date: '2025-12-11', count: 47 },
  // ];
  const tasksList = tasks || [];
  const cumulativeTasks = useMemo(() => {
    let prev = 0;
    let res: CumulativeTasks[] = [];

    for (let i = 0; i < tasksList.length; i++) {
      if (!tasksList[i].date) continue;
      const total = tasksList[i].count + prev;
      res.push({ total, date: tasksList[i].date });
      prev = total;
    }

    return res.sort(
      (a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime()
    );
  }, [tasksList]);

  return (
    <ChartsCard
      title="Кумулятивный прогресс задач"
      desc=""
      className="relative "
      dateRange={dateRange}
      onSelectHandler={onDateSelectHandler}
    >
      {isError && 'Произошла ошибка'}
      <div className="overflow-x-auto">
        <LineChart
          desc="ddwdwdwdwddddddddddddddddddd"
          style={{
            maxWidth: '700px',
            maxHeight: '70vh',
            aspectRatio: 1.618,
          }}
          className={cn(`min-w-100 w-full`, isFetching && 'opacity-35')}
          responsive
          data={cumulativeTasks}
          margin={{
            top: 20,
            right: 0,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            name="Задачи"
            dataKey="total"
            stroke="#10b981"
          />
          {/* <ReferenceLine x="Page C" stroke="red" label="Max PV PAGE" />
        <ReferenceLine y={9800} label="Max" stroke="red" /> */}
        </LineChart>
      </div>

      {isFetching && <Spinner className="absolute top-1/2 left-1/2" />}
      {isError && (
        <MessageError
          text="Произошла ошибка"
          className="absolute top-1/2 left-1/2"
        />
      )}
    </ChartsCard>
  );
}
