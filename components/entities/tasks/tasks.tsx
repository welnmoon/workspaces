import { Task } from '@prisma/client';

const TasksComponent = ({ task }: { task: Task }) => {
  return <article>{task.title}</article>;
};

export default TasksComponent;
