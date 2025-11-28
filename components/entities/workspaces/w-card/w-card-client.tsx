'use client';

import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { clientRoutes } from '@/lib/routes/client-routes';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import WorkspaceCardActions from './workspace-card-actions';
import { FullRoleDTO, ROLE_VALUES, RolesEnum } from '@/types/prisma/DTO/role';

type Props = {
  avatarUrl: string;
  workspace: { id: number; name: string };
  role: FullRoleDTO | null;
};

export default function WorkspaceCardClient({
  avatarUrl,
  workspace,
  role,
}: Props) {
  const [name, setName] = useState(workspace.name);

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
          <Image src={avatarUrl} alt="avatar" width={40} height={40} />
        </div>

        <div className="flex-1 flex items-start gap-2 justify-between min-w-0">
          <CardTitle className="min-w-0">
            <Heading className="font-bold leading-tight break-words" level={2}>
              <Link
                className="underline-anim block line-clamp-2"
                href={clientRoutes.workspacePage(workspace.id)}
              >
                {name}
              </Link>
            </Heading>
          </CardTitle>

          {role !== RolesEnum.MEMBER && (
            <WorkspaceCardActions
              workspaceId={workspace.id}
              workspaceName={name}
              onNameChange={(newName) => setName(newName)}
            />
          )}
        </div>
      </CardHeader>

      <CardFooter className="text-sm text-muted-foreground">
        Ваша роль: {role}
      </CardFooter>
    </Card>
  );
}
