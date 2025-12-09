import { Button } from '@/components/ui/button';
import { User2 } from 'lucide-react';
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

type QuickCreateBacklogTaskRowProps = {
  onCreate: (payload: CreateTaskFormValues) => Promise<void> | void;
  isLoading?: boolean;
};

export const CreateTaskRowForm = ({
  onCreate,
  isLoading,
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
