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
import { Spinner } from '../ui/spinner';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { MessageError } from '../message';
import { DateRange } from 'react-day-picker';
import { isValidDate } from '@/helpers/time/is-valid-date';
import { useCreatedVsCompletedTasks } from '@/hooks/analytics/project/use-completed-vs-created-tasks';

export type CumulativeTasks = {
  total: number;
  date: string | null;
};

export default function CompletedVsCreatedTasks({
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
  } = useCreatedVsCompletedTasks(workspaceId, projectId, from, to);

  const tasksList =
    tasks?.points?.map((p) => ({
      ...p,
      date: p.date,
      created: p.created,
      completed: p.completed,
    })) || [];

  return (
    <ChartsCard
      title="Здоровье проекта"
      desc=""
      className="relative"
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
          data={tasksList}
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
            name="Созданные"
            dataKey="created"
            stroke="#f43f5e"
          />
          <Line
            type="monotone"
            name="Выполненные"
            dataKey="completed"
            stroke="#1e3a8a"
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
