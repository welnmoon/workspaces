import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { clientRoutes } from '@/lib/routes/client-routes';
import Link from 'next/link';
import Image from 'next/image';
import { WorkspaceListDTO } from '@/types/prisma/DTO/workspaces';
import { MembershipService } from '@/lib/services/membership';

const WorkspaceCard = async ({
  workspace,
  userId,
}: {
  workspace: WorkspaceListDTO;
  userId: string;
}) => {
  const role = await MembershipService.getUserRoleInWorkspace(
    userId,
    workspace.id
  );

  console.log(workspace.id, workspace.avatarUrl);
  const avatarUrl = workspace.avatarUrl || '/images/workspace-default.png';

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-1 flex-row items-start gap-3">
        <Image
          src={avatarUrl}
          alt={`${workspace.name} avatar`}
          width={40}
          height={40}
          className="rounded-full object-cover shrink-0"
        />

        <CardTitle className="min-w-0">
          <Heading
            className="font-bold leading-tight line-clamp-2 break-words"
            level={2}
          >
            <Link
              className="underline-anim block"
              href={clientRoutes.workspacePage(workspace.id)}
            >
              {workspace.name}
            </Link>
          </Heading>
        </CardTitle>
      </CardHeader>

      <CardFooter className="text-sm text-muted-foreground ">
        Ваша роль: {role}
      </CardFooter>
    </Card>
  );
};

export default WorkspaceCard;
