import { Outlet } from 'react-router-dom';
import { Spinner } from '../../../../shared/ui/spinner';
import { useGetSessionQuery } from '../../../../entities/session';
import { parseRtkError } from '../../../../shared/lib/error/parse-rtk-error';
import { mainPaths } from '../../../../shared/api/paths';

export function AdminGate() {
  const {
    data: session,
    isLoading,
    isError,
    error,
  } = useGetSessionQuery(undefined, {
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4">
        <div className="flex flex-col items-center gap-2 rounded-xl border bg-card px-6 py-5 text-center shadow-sm">
          <Spinner className="size-5 text-primary" />
          <p className="text-sm font-medium">Проверяем вас...</p>
          <p className="text-xs text-muted-foreground">
            Готовим доступ в админку
          </p>
        </div>
      </div>
    );

  if (isError) {
    const parsedError = parseRtkError(error);

    if (!session) {
      window.location.href = mainPaths.auth.login({
        reason: 'unauthorized',
        from: window.location.pathname,
      });
      return;
    }

    const isAdminFromSession = session.user.platformRole === 'SYSADMIN';
    if (!isAdminFromSession) {
      window.location.href = mainPaths.auth.login({
        reason: 'forbidden',
        from: window.location.pathname,
      });
      return;
    }

    return (
      <div>
        <p>Error: {parsedError.message}</p>
        <p>Status: {parsedError.status}</p>
      </div>
    );
  }

  return <Outlet />;
}
