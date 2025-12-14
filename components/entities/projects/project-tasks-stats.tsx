'use client';

import CompletedVsCreatedTasks from '@/components/charts/created-vs-done-tasks-chart';
import CumulativeDoneChart from '@/components/charts/cumulative-done-chart';
import DailyDoneChart from '@/components/charts/daily-done-chart';
import TasksByStatusPieChart from '@/components/charts/tasks-by-status-pie-chart';
import UserActivityBarChart from '@/components/charts/user-activity-bar-chart';
import { TaskStats } from '@/types/service/task-stats';

const ProjectTasksAllStats = ({
  allTaskStats,
  memberTaskStats,
  workspaceId,
  projectId,
}: {
  allTaskStats: TaskStats;
  memberTaskStats: TaskStats;
  workspaceId: number;
  projectId: number;
}) => {
  const defaultFrom = new Date(
    new Date().getTime() - 7 * 24 * 60 * 60 * 1000
  ).toISOString(); // 7 days
  const defaultTo = new Date().toISOString();
  return (
    // <section className="flex gap-4 flex-col xl:flex-row flex-wrap">
    <section className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
      <CumulativeDoneChart
        workspaceId={workspaceId}
        projectId={projectId}
        defaultFrom={defaultFrom}
        defaultTo={defaultTo}
      />
      <DailyDoneChart
        workspaceId={workspaceId}
        projectId={projectId}
        defaultFrom={defaultFrom}
        defaultTo={defaultTo}
      />
      <CompletedVsCreatedTasks
        workspaceId={workspaceId}
        projectId={projectId}
        defaultFrom={defaultFrom}
        defaultTo={defaultTo}
      />
      <TasksByStatusPieChart isAnimationActive />
      <UserActivityBarChart
        workspaceId={workspaceId}
        projectId={projectId}
        defaultFrom={defaultFrom}
        defaultTo={defaultTo}
      />

      {/* Для всех */}
      {/* <div className="flex flex-wrap gap-4 my-4 text-sm items-center">
        <Badge variant="outline">Для всех</Badge>

        <span className="flex items-center gap-2">
          <FaListUl /> Всего: {allTaskStats.tasksCount}
        </span>

        <span className="flex items-center gap-2 text-blue-600">
          <FaRegClock /> TODO: {allTaskStats.tasksToDoCount}
        </span>

        <span className="flex items-center gap-2 text-yellow-600">
          <FaPlay /> В работе: {allTaskStats.tasksInProgressCount}
        </span>

        <span className="flex items-center gap-2 text-green-600">
          <FaCheckCircle /> Готово: {allTaskStats.tasksDoneCount}
        </span>

        <span className="flex items-center gap-2 text-red-600">
          <FaBan /> Заблокировано: {allTaskStats.tasksBlockedCount}
        </span>

        <span className="flex items-center gap-2 text-rose-600">
          <FaExclamationTriangle /> Просрочено: {allTaskStats.tasksOverdueCount}
        </span>
      </div> */}

      {/* Для пользователя */}
      {/* <div className="flex flex-wrap gap-4 my-4 text-sm items-center">
        <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">
          Для вас
        </Badge>

        <span className="flex items-center gap-2">
          <FaListUl /> Всего: {memberTaskStats.tasksCount}
        </span>

        <span className="flex items-center gap-2 text-blue-600">
          <FaRegClock /> TODO: {memberTaskStats.tasksToDoCount}
        </span>

        <span className="flex items-center gap-2 text-yellow-600">
          <FaPlay /> В работе: {memberTaskStats.tasksInProgressCount}
        </span>

        <span className="flex items-center gap-2 text-green-600">
          <FaCheckCircle /> Готово: {memberTaskStats.tasksDoneCount}
        </span>

        <span className="flex items-center gap-2 text-red-600">
          <FaBan /> Заблокировано: {memberTaskStats.tasksBlockedCount}
        </span>

        <span className="flex items-center gap-2 text-rose-600">
          <FaExclamationTriangle /> Просрочено:{' '}
          {memberTaskStats.tasksOverdueCount}
        </span>
      </div> */}
    </section>
  );
};

export default ProjectTasksAllStats;
