import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TASK_PRIORITY_LABELS } from '@/const/priority';
import getPriorityColor from '@/helpers/getPriorityColor';
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
      onValueChange={(key) => {
        const next = key as TaskPriorityDTO;
        if (next !== priority) onChangePriority(taskId, next);
      }}
      value={priority ?? 'LOW'}
    >
      <SelectTrigger className="w-30 text-xs">
        <SelectValue placeholder="Приоритет" />
      </SelectTrigger>
      <SelectContent className="text-xs">
        {Object.entries(TASK_PRIORITY_LABELS).map(([key, value]) => (
          <SelectItem key={key} value={key}>
            <Badge className={getPriorityColor({ priority: key as TaskPriorityDTO })}>
              {value}
            </Badge>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TaskSelectPriority;
