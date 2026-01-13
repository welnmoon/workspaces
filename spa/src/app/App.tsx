import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/admin-layout';
import UsersPage from '../pages/users';
import WorkspacesPage from '../pages/workspaces';
import UserPage from '../pages/user';
import WorkspacePage from '../pages/workspace';

//TODO Мы хотели достать данные из нашего api next с помощью RTK Query

export default function SpaApp() {
  return (
    <BrowserRouter basename="/spa">
      <Routes>
        <Route element={<AdminLayout />}>
          {/* редирект с /spa на /spa/users */}
          <Route index element={<Navigate to="users" replace />} />

          <Route path="users" element={<UsersPage />} />
          <Route path="users/:id" element={<UserPage />} />

          <Route path="workspaces" element={<WorkspacesPage />} />
          <Route path="workspaces/:id" element={<WorkspacePage />} />
        </Route>

        <Route path="*" element={<div>404</div>} />
      </Routes>
    </BrowserRouter>
  );
}
