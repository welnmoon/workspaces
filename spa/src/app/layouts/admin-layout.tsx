import { useDispatch, useSelector } from 'react-redux';
import { Outlet, Link } from 'react-router-dom';
import { toggleTheme } from '../store/theme-slice';
import type { RootState } from '../store/store';
import { useEffect } from 'react';
import { ThemeToggleButton } from '../../shared/ui/shadcn-io/theme-toggle-button';

function AdminLayout() {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch();

  useEffect(() => {
    document.documentElement.dataset.theme = theme; // 'light' | 'dark'
  }, [theme]);

  return (
    <div className="app flex gap-2">
      <aside className="hidden lg:block min-w-[15%] max-w-[15%] sidebar">
        <h1 className="text-6xl title">AdminLayout</h1>
        <ThemeToggleButton
          className=""
          variant="polygon"
          theme={theme}
          onClick={() => dispatch(toggleTheme())}
        />

        <nav style={{ display: 'flex', gap: 12 }}>
          <Link to="users">Users</Link>
          <Link to="workspaces">Workspaces</Link>
        </nav>
        <hr />
      </aside>
      <main className="p-4 w-full flex h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
