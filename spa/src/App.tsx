import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UsersPage from './pages/users';
import AdminLayout from './layouts/admin-layout';

export default function SpaApp() {
  return (
    <BrowserRouter basename="/spa">
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="users" replace />} />
          <Route path="users" element={<UsersPage />} />
          {/* <Route path="workspaces" element={<WorkspacesPage />} /> */}
        </Route>

        <Route path="*" element={<div>404</div>} />
      </Routes>
    </BrowserRouter>
  );
}
