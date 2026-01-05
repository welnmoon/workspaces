import { Outlet, Link } from 'react-router-dom';

function AdminLayout() {
  return (
    <div>
      <h1>AdminLayout</h1>
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
