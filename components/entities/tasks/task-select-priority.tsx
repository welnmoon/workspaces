import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TASK_PRIORITY_LABELS } from '@/const/priority';
import { TaskPriorityDTO } from '@/types/prisma/DTO/tasks';

import {
  ChevronUp,
  ChevronDown,
  AlertTriangle,
  Circle,
} from 'lucide-react';
import { JSX } from 'react';

export const priorityIcons: Record<TaskPriorityDTO, JSX.Element> = {
  // красный треугольник
  URGENT: <AlertTriangle className="h-4 w-4 text-red-600" />,
  // стрелка вверх
  HIGH: <ChevronUp className="h-4 w-4 text-orange-500" />,
  // синяя точка
  MEDIUM: <Circle className="h-4 w-4 text-blue-600" />,
  // стрелка вниз
  LOW: <ChevronDown className="h-4 w-4 text-green-600" />,
};

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
      <SelectTrigger className="w-30 text-xs bg-transparent shadow-none border-none">
        <SelectValue placeholder="Приоритет" />
      </SelectTrigger>
      <SelectContent className="text-xs ">
        {Object.entries(TASK_PRIORITY_LABELS).map(([key, value]) => (
          <SelectItem key={key} value={key}>
            <div className="flex items-center gap-2">
              {priorityIcons[key as TaskPriorityDTO]}

              <span className="text-gray-700">{value}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TaskSelectPriority;
