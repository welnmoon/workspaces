import EntitySelect from '../entity-select';
import { clientRoutes } from '@/lib/routes/client-routes';
import { TaskListDTO } from '@/types/prisma/DTO/tasks';

const TaskSelect = ({
  tasks,
  className,
  disabled,
  loading,
  onChange,
  value,
  placeholder,
  workspaceId,
  projectId,
}: {
  tasks: TaskListDTO[];
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  onChange?: (value: string) => void;
  value?: string | null;
  placeholder: string;
  workspaceId: string;
  projectId: string;
}) => {
  const options = tasks.map((t) => ({ label: t.title, id: t.id }));

  return (
    <EntitySelect
      className={className}
      placeholder={placeholder}
      disabled={disabled}
      emptyLabel="Пусто"
      getLabel={(w) => w.label}
      getId={(w) => String(w.id)}
      items={options}
      loading={loading}
      onChange={onChange}
      value={value}
      getHref={(item) =>
        clientRoutes.taskPage(
          Number(workspaceId),
          Number(projectId),
          Number(item.id)
        )
      }
    />
  );
};

export default TaskSelect;
