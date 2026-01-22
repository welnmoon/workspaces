import { Navigate, Outlet } from 'react-router-dom';
import { Spinner } from '../../../../shared/ui/spinner';
import { useGetSessionQuery } from '../../../../entities/session';
import { parseRtkError } from '../../../../shared/lib/error/parse-rtk-error';
import { mainPaths } from '../../../../shared/api/paths';

export function AdminGate() {
  const { data: session, isLoading, isError, error } = useGetSessionQuery();

  if (isLoading) return <Spinner />;

  if (!session) {
    window.location.href = mainPaths.auth.login({
      reason: 'unauthorized',
      from: window.location.pathname,
    });
    return;
  }

  const isAdmin = session.user.platformRole === 'SYSADMIN';
  if (!isAdmin) {
    window.location.href = mainPaths.auth.login({
      reason: 'forbidden',
      from: window.location.pathname,
    });
    return;
  }

  if (isError) {
    const parsedError = parseRtkError(error);

    return (
      <div>
        <p>Error: {parsedError.message}</p>
        <p>Status: {parsedError.status}</p>
      </div>
    );
  }

  return <Outlet />;
}
