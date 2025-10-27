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

const ProjectCard = ({
  title,
  description,
  projectId,
  workspaceId,
}: {
  title: string;
  description: string;
  projectId: number;
  workspaceId: number;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Heading className="text-bold " level={2}>
            <Link
              className="underline-anim"
              href={clientRoutes.projectPage(workspaceId, projectId)}
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

export default ProjectCard;
