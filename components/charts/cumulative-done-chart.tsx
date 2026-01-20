'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
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
                        
                                        
                                        
                                        
                                        
                                        
                                        
                                         
                                        
                                         
                                        
                                         
                                         
                                         
                                         
                                         
                                         
                                         
                                         
                                         
                                         
                                         
                                         
                                         
                                         
                                         
                                         
                                         
                                         
                                         
                                         
                                         
       
  const cumulativeTasks = useMemo(() => {
    const list = tasks ?? [];
    let prev = 0;
    const res: CumulativeTasks[] = [];

    for (let i = 0; i < list.length; i++) {
      if (!list[i].date) continue;
      const total = list[i].count + prev;
      res.push({ total, date: list[i].date });
      prev = total;
    }

    return res.sort(
      (a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime()
    );
  }, [tasks]);

  return (
    <ChartsCard
      title="Кумулятивный прогресс задач"
      desc=""
      className="relative "
      dateRange={dateRange}
      onSelectHandler={onDateSelectHandler}
      info="Накопительный итог завершённых задач за выбранный период"
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
