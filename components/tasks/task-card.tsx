import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Heading } from '../ui/heading';
import Link from 'next/link';
import { clientRoutes } from '@/lib/routes/client-routes';

const TaskCard = ({
  title,
  description,
  status,
  dueDate,
  projectId,
  workspaceId,
  taskId,
}: {
  title: string;
  description: string;
  status: string;
  dueDate: string;
  projectId: number;
  workspaceId: number;
  taskId: number;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Heading className="text-bold" level={2}>
            <Link
              className="underline-anim"
              href={clientRoutes.taskPage(workspaceId, projectId, taskId)}
            >
              {title}
            </Link>
          </Heading>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
