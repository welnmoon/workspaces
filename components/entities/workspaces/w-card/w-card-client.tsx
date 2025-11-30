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
  avatarUrl: string | null;
  workspace: { id: number; name: string };
  role: FullRoleDTO | null;
  userId: string;
  isRoleLoading: boolean;
};

export default function WorkspaceCardClient({
  avatarUrl,
  workspace,
  role,
  userId,
  isRoleLoading,
}: Props) {
  const [name, setName] = useState(workspace.name);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [roleLoaded, setRoleLoaded] = useState(false);

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-1 flex-row items-start gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 relative">
          {!imgLoaded && (
            <div className="absolute inset-0 rounded-full bg-gray-200 animate-pulse" />
          )}

          {avatarUrl && (
            <Image
              src={avatarUrl}
              alt="avatar"
              width={40}
              height={40}
              className={imgLoaded ? 'opacity-100' : 'opacity-0'}
              onLoadingComplete={() => setImgLoaded(true)}
            />
          )}
          {!avatarUrl && (
            <Image
              src="/images/workspaces/avatar/default-avatar.png"
              alt="avatar"
              width={40}
              height={40}
              className={imgLoaded ? 'opacity-100' : 'opacity-0'}
              onLoadingComplete={() => setImgLoaded(true)}
            />
          )}
        </div>

        <div className="flex-1 flex items-start gap-2 justify-between min-w-0">
          <CardTitle className="min-w-0">
            <Heading className="font-bold leading-tight break-words" level={2}>
              <Link
                className="underline-anim w-full workspace-name-clamp"
                href={clientRoutes.workspacePage(workspace.id)}
              >
                {name}
              </Link>
            </Heading>
          </CardTitle>

          {role !== RolesEnum.MEMBER && (
            <WorkspaceCardActions
              userId={userId}
              workspaceId={workspace.id}
              workspaceName={name}
              onNameChange={(newName) => setName(newName)}
            />
          )}
        </div>
      </CardHeader>

      <CardFooter className="text-sm text-muted-foreground">
        {isRoleLoading ? (
          // Скелетон роли
          <span className="inline-block h-4 w-24 rounded bg-gray-200 animate-pulse" />
        ) : role ? (
          // Когда загрузилась роль
          <span>Вы: {role}</span>
        ) : (
          // На всякий случай, если роли нет
          <span>Роль не определена</span>
        )}
      </CardFooter>
    </Card>
  );
}
