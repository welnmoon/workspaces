import EntitySelect from './entity-select';
import { WorkspaceListDTO } from '@/types/prisma/DTO/workspaces';
import { clientRoutes } from '@/lib/routes/client-routes';

const WorkspaceSelect = ({
  workspaces,
  className,
  disabled,
  loading,
  onChange,
  value,
  placeholder,
  label,
}: {
  workspaces: WorkspaceListDTO[];
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  onChange?: (value: string) => void;
  value?: string | null;
  placeholder: string;
  label?: string;
}) => {
  const options = workspaces.map((w) => ({ label: w.name, id: w.id }));

  return (
    <EntitySelect
      label={label}
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
      getHref={(item) => clientRoutes.workspacePage(Number(item.id))}
    />
  );
};

export default WorkspaceSelect;
