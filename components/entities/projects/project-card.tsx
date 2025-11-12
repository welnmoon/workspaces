import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Heading } from '../../ui/heading';
import Link from 'next/link';
import { clientRoutes } from '@/lib/routes/client-routes';

import ProjectCardBadge from './project-card-badge';

const ProjectCard = async ({
  title,
  description,
  projectId,
  workspaceId,
  tasksTotal,
  tasksDone,
  tasksInProgress,
  tasksToDoCount,
  tasksOverdue,
}: {
  title: string;
  description: string;
  projectId: number;
  workspaceId: number;
  tasksTotal: number;
  tasksDone: number;
  tasksInProgress: number;
  tasksToDoCount: number;
  tasksOverdue: number;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Heading className="text-bold " level={2}>
            <Link
              className=""
              href={clientRoutes.projectPage(workspaceId, projectId)}
            >
              <span className="underline-anim truncate max-w-full min-w-fit">
                {title}
              </span>
            </Link>
          </Heading>
        </CardTitle>
        <CardDescription className="block line-clamp-2 break-words">
          {description}
        </CardDescription>
      </CardHeader>

      <CardFooter className="block bg-zinc-50 px-4 py-2 ">
        <Heading level={6} className="text-zinc-400 mb-2">
          Задачи
        </Heading>
        <div className=" flex flex-wrap gap-1 ">
          <ProjectCardBadge text="Всего" value={tasksTotal} />
          <ProjectCardBadge text="Выполненные" value={tasksDone} />
          <ProjectCardBadge text="В работе" value={tasksInProgress} />
          <ProjectCardBadge text="Новые" value={tasksToDoCount} />
          <ProjectCardBadge text="Просроченные" value={tasksOverdue} />
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
