import { useDispatch, useSelector } from 'react-redux';
import { Outlet, Link } from 'react-router-dom';
import { toggleTheme } from '../store/theme-slice';
import type { RootState } from '../store/store';
import { useEffect } from 'react';

function AdminLayout() {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch();

  useEffect(() => {
    document.documentElement.dataset.theme = theme; // 'light' | 'dark'
  }, [theme]);

  return (
    <div className="app">
      <h1 className="text-6xl title">AdminLayout</h1>
      <button onClick={() => dispatch(toggleTheme())}>Toggle Theme</button>
      {theme}
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link to="users">Users</Link>
        <Link to="workspaces">Workspaces</Link>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}

export default AdminLayout;
