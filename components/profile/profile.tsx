'use client';

import AddAccounts from '@/components/profile/add-accounts';
import { Heading } from '@/components/ui/heading';

// shadcn/ui pieces
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Mail, Link as LinkIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import BaseLink from '@/components/base-link';
import { clientRoutes } from '@/lib/routes/client-routes';
import { getInitials } from '@/helpers/profile.ts/getInitials';
import { useState } from 'react';
import ProfileEditDialog from '../dialogs/profile/profile-edit-dialog';
import { useProfile } from '@/hooks/profile/use-profile';
import PageLoading from '../page-loading';
import PasswordEditDialog from '../dialogs/profile/password-edit-dialog';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import OAuthEditDialog from '../dialogs/profile/oauth-edit-dialog';
import { AccountFullDTO } from '@/types/prisma/DTO/account';

type Props = {
  userId: string;
};
const ProfileComponent = ({ userId }: Props) => {
  const [editing, setEditing] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [editOAuth, setEditOAuth] = useState('');

  const { data: profile, isLoading, isError, error } = useProfile(userId);

  if (isLoading && !profile) {
    return <PageLoading text="Профиль загружается" />;
  }
  if (isError || !profile) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 text-sm text-red-600">
        <span>Не удалось загрузить профиль</span>
        {error instanceof Error && <span>{error.message}</span>}
      </div>
    );
  }

  const hasPassword = !!(profile.password && profile.password !== '');
  const countOfAccounts = profile.accounts.length;
  const accountProviders = profile.accounts.map(
    (a: AccountFullDTO) => a.provider
  );

  return (
    <main className="">
      {/* Page header */}
      <header className="mb-8 flex items-center justify-between gap-4">
        <Heading level={1} className="text-3xl font-semibold tracking-tight">
          Профиль
        </Heading>
        <ProfileEditDialog
          open={editing}
          setEditing={setEditing}
          userId={profile.id}
          firstName={profile.firstName || ''}
          lastName={profile.lastName || ''}
          image={profile.image || ''}
        />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: user card */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={profile.image ?? undefined}
                alt={profile.firstName ?? 'User'}
              />
              <AvatarFallback className="bg-slate-200">
                {getInitials(profile.firstName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <CardTitle className="truncate">
                {profile.firstName || 'Без имени'}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 truncate">
                <Mail className="h-4 w-4" /> {profile.email}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Никнейм</span>
                <Badge variant="outline">{profile.nickname ?? 'user'}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">ID</span>
                <span className="font-mono text-xs">{profile.id}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <PasswordEditDialog
              open={editPassword}
              setEditPassword={setEditPassword}
            />
          </CardFooter>
        </Card>

        {/* Right column: accounts + workspaces */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Accounts */}
          <Card>
            <CardHeader>
              <CardTitle>Аккаунты</CardTitle>
              <CardDescription>
                Подключённые OAuth/внешние учётные записи
              </CardDescription>
            </CardHeader>
            <CardContent>
              {profile.accounts.length > 0 ? (
                <ul className="divide-y divide-border rounded-md border">
                  {profile.accounts.map((acc: AccountFullDTO) => (
                    <li
                      key={acc.id}
                      className="flex items-center justify-between gap-4 p-4"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="capitalize flex gap-1"
                          >
                            {acc.provider}

                            {acc.provider === 'google' && <FcGoogle />}
                            {acc.provider === 'github' && <FaGithub />}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            ID: {acc.providerAccountId}
                          </span>
                        </div>
                        {acc.type && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Тип: {acc.type}
                          </p>
                        )}
                      </div>
                      <OAuthEditDialog
                        countOfAccounts={countOfAccounts}
                        hasPassword={hasPassword}
                        account={acc}
                        setEditOAuth={(open) =>
                          setEditOAuth(open ? acc.id : '')
                        }
                        open={editOAuth === acc.id}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Нет подключённых аккаунтов
                </p>
              )}
            </CardContent>
            <CardFooter>
              <AddAccounts accountProviders={accountProviders} />
            </CardFooter>
          </Card>

          {/* Workspaces */}
          <Card>
            <CardHeader>
              <CardTitle>Ваши рабочие пространства</CardTitle>
              <CardDescription>
                Доступные вам воркспейсы и статусы членства
              </CardDescription>
            </CardHeader>
            <CardContent>
              {profile.memberships.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {profile.memberships.map((m) => (
                    <div key={m.id} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium truncate">
                          <BaseLink
                            href={clientRoutes.workspacePage(m.workspaceId)}
                          >
                            {m.workspace.name}
                          </BaseLink>
                        </span>
                        <Badge variant="outline" className="capitalize">
                          {m.role ?? 'member'}
                        </Badge>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          ID: <span className="font-mono">{m.workspaceId}</span>
                        </span>
                        {m.workspace?.tariff && (
                          <Badge variant="outline" className="capitalize">
                            {String(m.workspace.tariff).toLowerCase()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Пока нет членств
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default ProfileComponent;
