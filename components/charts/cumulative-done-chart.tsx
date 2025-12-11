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

export default function CumulativeDoneChart({
  workspaceId,
  projectId,
}: {
  workspaceId: number;
  projectId: number;
}) {
  // const { from, to } = useMemo(() => {
  //   const toDate = new Date();
  //   const fromDate = new Date();
  //   fromDate.setMonth(fromDate.getMonth() - 1);

  //   return {
  //     from: fromDate.toISOString(),
  //     to: toDate.toISOString(),
  //   };
  // }, []);
  const from = '2025-11-11T07%3A03%3A32.672Z';
  const to = '2025-12-11T07%3A03%3A34.111Z';
  console.info('[CumulativeDoneChart] params', {
    workspaceId,
    projectId,
    from,
    to,
  });

  const {
    data: tasks,
    isError,
    isLoading,
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
  console.debug('[CumulativeDoneChart] tasks result', {
    length: tasksList.length,
    tasks: tasksList,
    isError,
  });

  return (
    <ChartsCard title="Выполненные задачи" desc="" className="relative">
      {tasksList.length === 0 && 'Нет данных'}
      {isError && 'Произошла ошибка'}
      <LineChart
        desc="ddwdwdwdwddddddddddddddddddd"
        style={{
          maxWidth: '700px',
          maxHeight: '70vh',
          aspectRatio: 1.618,
        }}
        className="min-w-100 w-full"
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
        {/* <ReferenceLine x="Page C" stroke="red" label="Max PV PAGE" />
        <ReferenceLine y={9800} label="Max" stroke="red" /> */}
        <Line type="monotone" dataKey="count" stroke="#8884d8" />
        {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
      </LineChart>
      {isLoading && <Spinner className="absolute top-1/2 left-1/2" />}
      {isLoading}
    </ChartsCard>
  );
}
