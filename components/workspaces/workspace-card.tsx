import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Heading } from '../ui/heading';


import { clientRoutes } from '@/lib/routes/client-routes';
import { Workspace } from '@prisma/client';
import Link from 'next/link';
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
