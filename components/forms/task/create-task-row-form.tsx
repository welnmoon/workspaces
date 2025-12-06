import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar, User2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { FormProvider, useForm } from 'react-hook-form';
import {
  createTaskFormSchema,
  CreateTaskFormValues,
} from '@/schemas/tasks/create-task-form-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../form-input';
import LoaderComponent from '@/components/ui/loader';
import { useChangeSprintDates } from '@/hooks/tasks/sprint/use-change-sprint-dates';
import SprintDateRangePopover from '@/components/entities/projects/sprints/sprint-date-range-popover';
import toast from 'react-hot-toast';

type QuickCreateBacklogTaskRowProps = {
  onCreate: (payload: CreateTaskFormValues) => Promise<void> | void;
  isLoading?: boolean;
  startDate?: Date | null;
  endDate?: Date | null;

  workspaceId?: number;
  projectId?: number;
  sprintId?: number;
};

export const CreateTaskRowForm = ({
  onCreate,
  isLoading,

  startDate,
  endDate,

  workspaceId,
  projectId,
  sprintId,
}: QuickCreateBacklogTaskRowProps) => {
  // const [isFocused, setIsFocused] = useState(false);
  const form = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: undefined,
      assigneeId: undefined,
      priority: 'LOW',
    },
  });

  const handleSubmit = async (values: CreateTaskFormValues) => {
    onCreate(form.getValues());
    form.reset();
  };

  // ---------------------Dates-------------------------//
  const {
    mutate: changeSprintDates,
    isPending: isChangeSprintDatesPending,
    isSuccess: isChangeSprintDatesSuccess,
    isError: isChangeSprintDatesError,
  } = useChangeSprintDates(workspaceId!, projectId!, sprintId!);
  const closePopover = isChangeSprintDatesSuccess || isChangeSprintDatesError;

  const handleChangeDates = (payload: {
    startDate: string;
    endDate: string;
  }) => {
    changeSprintDates(payload, {
      onSuccess: () => {
        toast.success('Даты успешно изменены');
      },
      onError: (e) => {
        toast.error(e.message);
      },
    });
  };

  return (
    <FormProvider {...form}>
      <form
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            form.handleSubmit(handleSubmit)();
          }
        }}
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn(
          'flex items-center gap-2 px-2 py-1.5 text-sm',
          'bg-background w-full'
          // isFocused && 'ring-1 ring-primary/40 bg-primary/5'
        )}
      >
        <Checkbox disabled />
        <FormInput
          name="title"
          placeholder="Напиши имя задачи"
          containerClassName="flex-1"
          className="h-8 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        {/* {workspaceId && projectId && sprintId && ( */}
        <SprintDateRangePopover
          initialStartDate={startDate}
          initialEndDate={endDate}
          handleChangeDates={handleChangeDates}
          isPending={isChangeSprintDatesPending}
          closePopover={closePopover}
        />
        {/* )} */}

        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted"
          tabIndex={-1}
        >
          <User2 className="h-4 w-4 text-muted-foreground" />
        </button>

        <Button type="submit" size="sm" disabled={isLoading} className="h-8">
          {isLoading ? <LoaderComponent /> : 'Создать ↵'}
        </Button>
      </form>
    </FormProvider>
  );
};
