import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TASK_PRIORITY_LABELS } from '@/const/priority';
import { TaskPriorityDTO } from '@/types/prisma/DTO/tasks';

const TaskSelectPriority = ({
  taskId,
  priority,
  onChangePriority,
}: {
  taskId: number;
  priority: TaskPriorityDTO;
  onChangePriority: (taskId: number, priority: TaskPriorityDTO) => void;
}) => {
  return (
    <Select
      onValueChange={(key) => onChangePriority(taskId, key as TaskPriorityDTO)}
      value={priority || 'loading'}
    >
      <SelectTrigger className="w-20 px-2 py-1">
        <SelectValue placeholder="Приоритет" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(TASK_PRIORITY_LABELS).map(([key, value]) => (
          <SelectItem key={key} value={key}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TaskSelectPriority;
