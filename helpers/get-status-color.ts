import { TaskStatusDTO } from '@/const/tasks-status';

const getTaskStatusColor = ({ taskStatus }: { taskStatus: TaskStatusDTO }) => {
  switch (taskStatus) {
    case 'TODO':
      return 'bg-red-500';
    case 'IN_PROGRESS':
      return 'bg-blue-500';
    case 'DONE':
      return 'bg-green-500';
    case 'BLOCKED':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
};

export default getTaskStatusColor;
