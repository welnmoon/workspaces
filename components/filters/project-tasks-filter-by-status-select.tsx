import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  FaRegClock,
  FaPlay,
  FaCheckCircle,
  FaBan,
  FaStar,
} from 'react-icons/fa';
import { Heading } from '../ui/heading';

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
    <div className="flex flex-col gap-2">
      <Heading level={3}>Статус</Heading>
      <Select value={status || 'ALL'} onValueChange={setStatus}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Статус" />
        </SelectTrigger>
        <SelectContent className={className}>
          <SelectItem value="ALL">
            <div className="flex items-center gap-2">
              <FaStar /> All
            </div>
          </SelectItem>

          <SelectItem value="TODO">
            <div className="flex items-center gap-2">
              <FaRegClock /> To Do
            </div>
          </SelectItem>

          <SelectItem value="IN_PROGRESS">
            <div className="flex items-center gap-2">
              <FaPlay /> In Progress
            </div>
          </SelectItem>

          <SelectItem value="DONE">
            <div className="flex items-center gap-2">
              <FaCheckCircle /> Done
            </div>
          </SelectItem>

          <SelectItem value="BLOCKED">
            <div className="flex items-center gap-2">
              <FaBan /> Blocked
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProjectTasksFilterByStatusSelect;
