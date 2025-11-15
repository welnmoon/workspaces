import { TaskStats } from '@/types/service/task-stats';
import {
  FaListUl,
  FaRegClock,
  FaPlay,
  FaCheckCircle,
  FaBan,
  FaExclamationTriangle,
} from 'react-icons/fa';
const ProjectTasksStats = ({ taskStats }: { taskStats: TaskStats }) => {
  return (
    <div className="flex flex-wrap gap-4 my-4 text-sm items-center">
      <span className="flex items-center gap-2">
        <FaListUl /> Всего: {taskStats.tasksCount}
      </span>

      <span className="flex items-center gap-2 text-blue-600">
        <FaRegClock /> TODO: {taskStats.tasksToDoCount}
      </span>

      <span className="flex items-center gap-2 text-yellow-600">
        <FaPlay /> В работе: {taskStats.tasksInProgressCount}
      </span>

      <span className="flex items-center gap-2 text-green-600">
        <FaCheckCircle /> Готово: {taskStats.tasksDoneCount}
      </span>

      <span className="flex items-center gap-2 text-red-600">
        <FaBan /> Заблокировано: {taskStats.tasksBlockedCount}
      </span>

      <span className="flex items-center gap-2 text-rose-600">
        <FaExclamationTriangle /> Просрочено: {taskStats.tasksOverdueCount}
      </span>
    </div>
  );
};

export default ProjectTasksStats;
