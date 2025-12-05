import { TaskStatusDTO } from '@/const/tasks-status';

const getTaskStatusColor = ({ taskStatus }: { taskStatus: TaskStatusDTO }) => {
  switch (taskStatus) {
    case 'TODO':
      return 'bg-rose-100 text-rose-700 border border-rose-200';
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-700 border border-blue-200';
    case 'DONE':
      return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    case 'BLOCKED':
      return 'bg-slate-100 text-slate-700 border border-slate-200';
    default:
      return 'bg-slate-100 text-slate-700 border border-slate-200';
  }
};

export default getTaskStatusColor;
