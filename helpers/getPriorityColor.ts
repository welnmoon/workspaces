import { TaskPriorityDTO } from '@/types/prisma/DTO/tasks';

const getPriorityColor = ({ priority }: { priority: TaskPriorityDTO }) => {
  switch (priority) {
    case 'URGENT':
      return 'bg-rose-100 text-rose-700 border border-rose-200';
    case 'HIGH':
      return 'bg-orange-100 text-orange-700 border border-orange-200';
    case 'MEDIUM':
      return 'bg-blue-100 text-blue-700 border border-blue-200';
    case 'LOW':
    default:
      return 'bg-slate-100 text-slate-700 border border-slate-200';
  }
};

export default getPriorityColor;
