import { Workspace } from '@prisma/client';
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
const WorkspaceCard = ({ workspace }: { workspace: Workspace }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Heading className="text-bold " level={2}>
            <Link
              className="underline-anim"
              href={clientRoutes.workspacePage(workspace.id)}
            >
              {workspace.name}
            </Link>
          </Heading>
        </CardTitle>
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

export default WorkspaceCard;
