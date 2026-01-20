'use client';

import CompletedVsCreatedTasks from '@/components/charts/created-vs-done-tasks-chart';
import CumulativeDoneChart from '@/components/charts/cumulative-done-chart';
import DailyDoneChart from '@/components/charts/daily-done-chart';
import SLAGauge from '@/components/charts/sla-gauge';
import TasksByStatusPieChart from '@/components/charts/tasks-by-status-pie-chart';
import UserActivityBarChart from '@/components/charts/user-activity-bar-chart';
import { TaskStats } from '@/types/service/task-stats';

const ProjectTasksAllStats = ({
  allTaskStats: _allTaskStats,
  memberTaskStats: _memberTaskStats,
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
  ).toISOString();          
  const defaultTo = new Date().toISOString();
  return (
                                                                      
    <section className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
      <SLAGauge workspaceId={workspaceId} projectId={projectId} />
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
      <TasksByStatusPieChart />
      <UserActivityBarChart
        workspaceId={workspaceId}
        projectId={projectId}
        defaultFrom={defaultFrom}
        defaultTo={defaultTo}
      />

      
      

      
      
    </section>
  );
};

export default ProjectTasksAllStats;
