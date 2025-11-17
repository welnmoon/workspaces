import { Dispatch, SetStateAction, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const DoneTasksFilter = ({
  doneTasksCount,
  setDoneTasksCount,
  counts,
}: {
  doneTasksCount: string;
  setDoneTasksCount: Dispatch<SetStateAction<string>>;
  counts: number[];
}) => {
  return (
    <Select value={doneTasksCount} onValueChange={setDoneTasksCount}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Количество задач" />
      </SelectTrigger>

      <SelectContent>
        {counts.map((c) => (
          <SelectItem key={c} value={String(c)}>
            {c}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DoneTasksFilter;
