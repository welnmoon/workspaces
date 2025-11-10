import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ProjectTasksFilterByStatusSelect = ({
  status,
  setStatus,
  className,
}: {
  status: string | undefined | null;
  setStatus: (value: string) => void;
  className?: string;
}) => {
  return (
    <Select value={status || 'ALL'} onValueChange={setStatus}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Статус" />
      </SelectTrigger>
      <SelectContent className={className}>
        <SelectItem value="ALL">🌟 All</SelectItem>
        <SelectItem value="TODO">📝 To Do</SelectItem>
        <SelectItem value="IN_PROGRESS">🚧 In Progress</SelectItem>
        <SelectItem value="DONE">✅ Done</SelectItem>
        <SelectItem value="BLOCKED">⛔ Blocked</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ProjectTasksFilterByStatusSelect;
