import { Badge } from '@/components/ui/badge';
import { TaskStats } from '@/types/service/task-stats';
import {
  FaListUl,
  FaRegClock,
  FaPlay,
  FaCheckCircle,
  FaBan,
  FaExclamationTriangle,
} from 'react-icons/fa';
const ProjectMemberTasksAllStats = ({
  memberTaskStats,
}: {
  memberTaskStats: TaskStats;
}) => {
  return (
    <section>
      <div className="flex flex-wrap gap-4 my-4 text-sm items-center">
        <Badge variant={'outline'}>Для вас</Badge>
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
      </div>
    </section>
  );
};

export default ProjectMemberTasksAllStats;
