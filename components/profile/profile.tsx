import UnAuth from '@/components/profile/un-auth';
import AddAccounts from '@/components/profile/add-accounts';
import { Heading } from '@/components/ui/heading';
import { requireUser } from '@/helpers/require-user';
import type { SessionUser } from '@/helpers/require-user';

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
import { Mail, UserRoundCog, Link as LinkIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import BaseLink from '@/components/base-link';
import { clientRoutes } from '@/lib/routes/client-routes';
import { UserProfileDTO } from '@/types/prisma/DTO/user';
import { getInitials } from '@/helpers/profile.ts/getInitials';

type Props = {
  user: UserProfileDTO;
};
const ProfileComponent = ({ user }: Props) => {
  const accountProviders = user.accounts.map((a) => a.provider);

  return (
    <main className="">
      {/* Page header */}
      <header className="mb-8 flex items-center justify-between gap-4">
        <Heading level={1} className="text-3xl font-semibold tracking-tight">
          Профиль
        </Heading>
        <Button variant="default" size="sm" className="gap-2">
          <UserRoundCog className="h-4 w-4" /> Редактировать
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: user card */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={user.image ?? undefined}
                alt={user.firstName ?? 'User'}
              />
              <AvatarFallback className="bg-slate-200">
                {getInitials(user.firstName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <CardTitle className="truncate">
                {user.firstName || 'Без имени'}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 truncate">
                <Mail className="h-4 w-4" /> {user.email}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Никнейм</span>
                <Badge variant="secondary">{user.nickname ?? 'user'}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">ID</span>
                <span className="font-mono text-xs">{user.id}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button variant="outline" size="sm">
              Сменить пароль
            </Button>
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
              {user.accounts.length > 0 ? (
                <ul className="divide-y divide-border rounded-md border">
                  {user.accounts.map((acc) => (
                    <li
                      key={acc.id}
                      className="flex items-center justify-between gap-4 p-4"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">
                            {acc.provider}
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
                      <Button variant="ghost" size="sm" className="gap-2">
                        <LinkIcon className="h-4 w-4" /> Управлять
                      </Button>
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
              {user.memberships.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {user.memberships.map((m) => (
                    <div key={m.id} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium truncate">
                          <BaseLink
                            href={clientRoutes.workspacePage(m.workspaceId)}
                          >
                            {m.workspace.name}
                          </BaseLink>
                        </span>
                        <Badge variant="secondary" className="capitalize">
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
