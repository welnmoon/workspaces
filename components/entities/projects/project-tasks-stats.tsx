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
const ProjectTasksAllStats = ({
  allTaskStats,
  memberTaskStats,
}: {
  allTaskStats: TaskStats;
  memberTaskStats: TaskStats;
}) => {
  return (
    <section>
      {/* Для всех */}
      <div className="flex flex-wrap gap-4 my-4 text-sm items-center">
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
      </div>

      {/* Для пользователя */}
      <div className="flex flex-wrap gap-4 my-4 text-sm items-center">
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
      </div>
    </section>
  );
};

export default ProjectTasksAllStats;
