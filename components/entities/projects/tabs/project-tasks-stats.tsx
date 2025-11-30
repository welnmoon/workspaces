import { Heading } from '@/components/ui/heading';
import ProjectTasksAllStats from '../project-tasks-stats';
import ProjectMemberTasksAllStats from '../project-member-tasks-stats';
import { TaskStats } from '@/types/service/task-stats';

const ProjectTasksStats = ({
  allTaskStats,
  memberTaskStats,
}: {
  allTaskStats: TaskStats;
  memberTaskStats: TaskStats;
}) => {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2 text-sm">
        {/* <Heading level={3}>Статистика</Heading>
        {allTaskStats && <ProjectTasksAllStats allTaskStats={allTaskStats} />}
        {memberTaskStats && (
          <ProjectMemberTasksAllStats memberTaskStats={memberTaskStats} />
        )} */}
        ЭТО ЧТО ЗА КОМПОНЕНТ
      </div>
    </div>
  );
};

export default ProjectTasksStats;
