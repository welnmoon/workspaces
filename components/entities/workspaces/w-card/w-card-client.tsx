'use client';

import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { clientRoutes } from '@/lib/routes/client-routes';
import { useState } from 'react';
import Link from 'next/link';

import WorkspaceCardActions from './workspace-card-actions';
import { FullRoleDTO, RolesEnum } from '@/types/prisma/DTO/role';
import { Badge } from '@/components/ui/badge';
import { Shield, ShieldHalf, ShieldPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { WorkspaceListDTO } from '@/types/prisma/DTO/workspaces';
import { cn } from '@/lib/utils';

type Props = {
  avatarUrl: string | null;
  workspace: WorkspaceListDTO;
  role: FullRoleDTO | null;
  userId: string;
  isRoleLoading: boolean;
  noActions?: boolean;
  noLink?: boolean;
};

export default function WorkspaceCardClient({
  avatarUrl,
  workspace,
  role,
  userId,
  isRoleLoading,
  noActions,
  noLink = false,
}: Props) {
  const [name, setName] = useState(workspace.name);
  const description = workspace.description;
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="flex flex-col border border-zinc-100 shadow-sm">
      <CardHeader className="flex flex-col gap-3 pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
            <AvatarFallback className="text-xs">{initials || 'WS'}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="min-w-0">
                <Heading
                  className="font-bold leading-tight break-words"
                  level={2}
                >
                  {noLink ? (
                    <span className="underline-anim w-full workspace-name-clamp">
                      {name}
                    </span>
                  ) : (
                    <Link
                      className="underline-anim w-full workspace-name-clamp"
                      href={clientRoutes.workspacePage(workspace.id)}
                    >
                      {name}
                    </Link>
                  )}
                </Heading>
              </CardTitle>

              {role !== RolesEnum.MEMBER && (
                <WorkspaceCardActions
                  noActions={noActions}
                  userId={userId}
                  workspaceId={workspace.id}
                  workspaceName={name}
                  onNameChange={(newName) => setName(newName)}
                />
              )}
            </div>

            {description && (
              <p className="mt-1 text-xs leading-snug text-muted-foreground line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardFooter
        className={cn(
          'text-xs text-muted-foreground pt-0',
          'flex items-center justify-between'
        )}
      >
        {isRoleLoading ? (
          <span className="inline-block h-4 w-24 rounded bg-gray-200 animate-pulse" />
        ) : role ? (
          <Badge
            variant={'outline'}
            className="flex items-center gap-2 font-light"
          >
            {role === 'OWNER' && (
              <ShieldPlus size={15} className="text-zinc-400" />
            )}
            {role === 'ADMIN' && <Shield size={15} />}
            {role === 'MEMBER' && <ShieldHalf size={15} />} {role}
          </Badge>
        ) : (
          <Badge variant={'destructive'}>Роль не определена</Badge>
        )}
      </CardFooter>
    </Card>
  );
}
