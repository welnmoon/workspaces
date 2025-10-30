import EntitySelect from '../entity-select';
import { WorkspaceListDTO } from '@/types/prisma/DTO/workspaces';

const WorkspaceSelect = ({
  workspaces,
  className,
  disabled,
  loading,
  onChange,
  value,
}: {
  workspaces: WorkspaceListDTO[];
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  onChange?: (value: string) => void;
  value?: string | null;
}) => {
  const options = workspaces.map((w) => ({ label: w.name, id: w.id }));

  return (
    <EntitySelect
      className={className}
      placeholder="Workspace"
      disabled={disabled}
      emptyLabel="Пусто"
      getLabel={(w) => w.label}
      getId={(w) => String(w.id)}
      items={options}
      loading={loading}
      onChange={onChange}
      value={value}
    />
  );
};

export default WorkspaceSelect;
