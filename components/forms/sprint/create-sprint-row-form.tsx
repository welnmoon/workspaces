import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar, User2 } from 'lucide-react';
import { cn } from '@/lib/utils';
// import { Checkbox } from '@/components/ui/checkbox';
import { FaPenToSquare } from 'react-icons/fa6';

import { FormProvider, useForm } from 'react-hook-form';
import {
  createTaskFormSchema,
  CreateTaskFormValues,
} from '@/schemas/tasks/create-task-form-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../form-input';
import LoaderComponent from '@/components/ui/loader';
import {
  createSprintSchema,
  CreateSprintSchema,
} from '@/schemas/sprint/create-sprint-schema';

const CreateSprintRowForm = ({
  isFormShowing,
  sprintsCount,
  onCreateSprint,
  isPending,
}: {
  isFormShowing: boolean;
  sprintsCount: number | undefined;
  onCreateSprint: (payload: CreateSprintSchema) => void;
  isPending: boolean;
}) => {
  const [highlighted, setHighlighted] = useState(false);
  const nextSprint = sprintsCount ? sprintsCount + 1 : 1;
  const form = useForm<CreateSprintSchema>({
    resolver: zodResolver(createSprintSchema),
    defaultValues: {
      name: `Sprint ${nextSprint}`,
      goal: '',
      startDate: '',
      endDate: '',
    },
  });

  const handleSubmit = () => {
    onCreateSprint(form.getValues());
  };

  useEffect(() => {
    if (isFormShowing) {
      setHighlighted(true);
      const timer = setTimeout(() => setHighlighted(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isFormShowing]);
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
          'bg-background w-full',
          highlighted && 'animate-highlight'
          //   isFocused && 'ring-1 ring-primary/40 bg-primary/5'
        )}
      >
        {/* <Checkbox disabled /> */}
        <FaPenToSquare size={20} className="text-zinc-500 animate-pulse" />
        <FormInput
          name="name"
          placeholder="Напиши имя спринта"
          containerClassName="flex-1"
          className="h-8 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted"
          tabIndex={-1}
        >
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </button>

        {/* <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted"
          tabIndex={-1}
        >
          <User2 className="h-4 w-4 text-muted-foreground" />
        </button> */}

        <Button type="submit" size="sm" disabled={isPending} className="h-8">
          {isPending ? <LoaderComponent /> : 'Создать ↵'}
        </Button>
      </form>
    </FormProvider>
  );
};

export default CreateSprintRowForm;
