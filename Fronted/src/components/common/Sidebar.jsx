import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

export const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (user?.role !== 'admin') {
    return null;
  }

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Panel Admin</h3>
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/admin"
          className={`sidebar-link ${isActive('/admin') ? 'active' : ''}`}
        >
          Dashboard
        </Link>
        <Link
          to="/admin/upload"
          className={`sidebar-link ${isActive('/admin/upload') ? 'active' : ''}`}
        >
          Añadir contenido
        </Link>
        <Link
          to="/admin/content"
          className={`sidebar-link ${isActive('/admin/content') ? 'active' : ''}`}
        >
          Gestor de contenido
        </Link>
        <Link
          to="/admin/users"
          className={`sidebar-link ${isActive('/admin/users') ? 'active' : ''}`}
        >
          Usuarios
        </Link>
      </nav>
    </aside>
  );
};
