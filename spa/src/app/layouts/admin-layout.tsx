import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { toggleTheme } from '../store/theme-slice';
import type { RootState } from '../store/store';
import { useEffect, useState } from 'react';
import { ThemeToggleButton } from '../../shared/ui/shadcn-io/theme-toggle-button';

function AdminLayout() {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme; // 'light' | 'dark'
  }, [theme]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="app admin-layout">
      <button
        type="button"
        className={
          isSidebarOpen
            ? 'admin-layout__sidebar-backdrop admin-layout__sidebar-backdrop--open'
            : 'admin-layout__sidebar-backdrop'
        }
        aria-label="Закрыть меню"
        onClick={handleSidebarClose}
      />
      <aside
        id="admin-sidebar"
        className={
          isSidebarOpen
            ? 'admin-layout__sidebar admin-layout__sidebar--open'
            : 'admin-layout__sidebar'
        }
      >
        <div className="admin-sidebar__brand">
          <div className="admin-sidebar__logo">WN</div>
          <div>
            <div className="admin-sidebar__title">Worknest</div>
            <div className="admin-sidebar__subtitle">Админ панель</div>
          </div>
        </div>

        <ThemeToggleButton
          className="admin-sidebar__theme-toggle"
          variant="polygon"
          theme={theme}
          onClick={() => {
            dispatch(toggleTheme());
            localStorage.setItem(
              'theme',
              theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
            );
          }}
        />

        <nav className="admin-sidebar__nav">
          <div className="admin-sidebar__section-label">Навигация</div>
          <NavLink
            to="users"
            className={({ isActive }) =>
              isActive
                ? 'admin-sidebar__link admin-sidebar__link--active'
                : 'admin-sidebar__link'
            }
          >
            Пользователи
          </NavLink>
          <NavLink
            to="workspaces"
            className={({ isActive }) =>
              isActive
                ? 'admin-sidebar__link admin-sidebar__link--active'
                : 'admin-sidebar__link'
            }
          >
            Воркспейсы
          </NavLink>
          <NavLink
            to="projects"
            className={({ isActive }) =>
              isActive
                ? 'admin-sidebar__link admin-sidebar__link--active'
                : 'admin-sidebar__link'
            }
          >
            Проекты
          </NavLink>
          <NavLink
            to="tasks"
            className={({ isActive }) =>
              isActive
                ? 'admin-sidebar__link admin-sidebar__link--active'
                : 'admin-sidebar__link'
            }
          >
            Задачи
          </NavLink>
          <NavLink
            to="sprints"
            className={({ isActive }) =>
              isActive
                ? 'admin-sidebar__link admin-sidebar__link--active'
                : 'admin-sidebar__link'
            }
          >
            Спринты
          </NavLink>
        </nav>
      </aside>
      <main className="admin-layout__main">
        <div className="admin-layout__mobile-bar">
          <button
            type="button"
            className="admin-layout__sidebar-toggle"
            aria-controls="admin-sidebar"
            aria-expanded={isSidebarOpen}
            onClick={handleSidebarToggle}
          >
            Меню
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
