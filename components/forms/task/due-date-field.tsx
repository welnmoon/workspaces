import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { CreateTaskFormValues } from '@/schemas/tasks/create-task-form-schemas';
import { Control, Controller } from 'react-hook-form';

interface DueDateFieldProps {
  control: Control<CreateTaskFormValues>;
  name: 'dueDate';

  label?: string;
  required?: string;
  className?: string;
}

export function DueDateField({
  control,
  name,
  label = 'Срок задачи',
  required,
  className,
}: DueDateFieldProps) {
  return (
    <>
      <Label>
        {label && (
          <Label className={cn('text-md font-medium mb-1', className)}>
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
        )}
      </Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div className="flex flex-col gap-1">
            <input
              type="date"
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value)}
              className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
        )}
      />
    </>
  );
}
