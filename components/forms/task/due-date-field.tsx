import { Controller } from 'react-hook-form';

interface DueDateFieldProps {
  control: any;
  name: string;
  label?: string;
}

export function DueDateField({
  control,
  name,
  label = 'Срок задачи',
}: DueDateFieldProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">{label}</label>
          <input
            type="date"
            value={field.value ?? ''}
            onChange={(e) => field.onChange(e.target.value)}
            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
      )}
    />
  );
}
