import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TASK_PRIORITY_ARRAY, TASK_PRIORITY_LABELS } from '@/const/priority';
import { cn } from '@/lib/utils';
import { CreateTaskFormValues } from '@/schemas/tasks/create-task-form-schemas';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

const PRIORITY_BADGE_STYLES: Record<string, string> = {
  URGENT: 'bg-red-100 text-red-700 border-red-200',
  HIGH: 'bg-orange-100 text-orange-700 border-orange-200',
  MEDIUM: 'bg-amber-100 text-amber-700 border-amber-200',
  LOW: 'bg-slate-100 text-slate-700 border-slate-200',
};

type SelectPriorityProps = {
  control: Control<CreateTaskFormValues>;
  name: 'priority';
  className?: string;
  label?: string;
  required?: boolean;
};

const SelectPriority = ({
  control,
  name,
  className,
  label = 'Приоритет',
  required,
}: SelectPriorityProps) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <Label className={cn('text-sm font-medium', className)}>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            value={field.value ?? 'LOW'}
            defaultValue={field.value ?? 'LOW'}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите приоритет" />
            </SelectTrigger>
            <SelectContent className="min-w-[220px]">
              {TASK_PRIORITY_ARRAY.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        'px-2 py-0.5 text-xs font-medium',
                        PRIORITY_BADGE_STYLES[priority] ?? ''
                      )}
                    >
                      {TASK_PRIORITY_LABELS[priority]}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
};

export default SelectPriority;
