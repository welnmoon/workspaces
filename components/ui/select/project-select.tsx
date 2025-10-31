import EntitySelect from '../entity-select';
import { clientRoutes } from '@/lib/routes/client-routes';
import { ProjectListDTO } from '@/types/prisma/DTO/projects';

const ProjectSelect = ({
  projects,
  className,
  disabled,
  loading,
  onChange,
  value,
  placeholder,
  workspaceId,
}: {
  projects: ProjectListDTO[];
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  onChange?: (value: string) => void;
  value?: string | null;
  placeholder: string;
  workspaceId: string;
}) => {
  const options = projects.map((w) => ({ label: w.name, id: w.id }));

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
        clientRoutes.projectPage(Number(workspaceId), Number(item.id))
      }
    />
  );
};

export default ProjectSelect;
