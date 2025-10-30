import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Heading } from '../ui/heading';

import { clientRoutes } from '@/lib/routes/client-routes';
import Link from 'next/link';
import { WorkspaceListDTO } from '@/types/prisma/DTO/workspaces';
const WorkspaceCard = ({ workspace }: { workspace: WorkspaceListDTO }) => {
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
