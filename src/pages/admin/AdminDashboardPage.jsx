import { Link } from 'react-router-dom';
import { Sidebar } from '../../components/common/Sidebar.jsx';
import { Icon } from '../../components/common/Icons.jsx';
import { useContent } from '../../context/ContentContext.jsx';
import { useAuth } from '../../hooks/useAuth.js';

export const AdminDashboardPage = () => {
  const { content } = useContent();
  const { user } = useAuth();

  const recentContent = content.slice(0, 5);
  const stats = {
    total: content.length,
    videos: content.filter(c => c.type === 'video').length,
    pdfs: content.filter(c => c.type === 'pdf').length,
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <div className="dashboard-header">
          <div className="dashboard-header-inner">
            <div>
              <h1>Panel administrativo</h1>
              <p>Bienvenido, {user?.name}. Gestiona la plataforma desde aquí</p>
            </div>
            <div className="account-card">
              <div className="account-avatar">{user?.name?.charAt(0) || 'U'}</div>
              <div className="account-info">
                <div className="account-name">{user?.name}</div>
                <div className="account-meta">{user?.email} · <span className="role-tag">{user?.role}</span></div>
                <div className="account-status">Estado: <strong className="status-indicator">Activo</strong></div>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-quick-actions">
          <Link to="/admin/upload" className="action-card">
            <div className="action-icon">+</div>
            <h3>Subir contenido</h3>
            <p>Agrega video, PDF, audio o imagen con un flujo claro.</p>
          </Link>
          <Link to="/admin/content" className="action-card">
            <div className="action-icon">★</div>
            <h3>Gestor de contenido</h3>
            <p>Revisa y administra todos los recursos publicados.</p>
          </Link>
        </div>

        <div className="admin-stats">
          <h2>Resumen del panel</h2>
          <div className="stats-grid">
            <div className="stat-card highlight">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Contenidos</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.videos}</div>
              <div className="stat-label">Videos</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.pdfs}</div>
              <div className="stat-label">PDFs</div>
            </div>
          </div>
        </div>

        <div className="admin-recent">
          <h2>Contenido reciente</h2>
          {recentContent.length === 0 ? (
            <div className="empty-state">
              <p>No hay contenido aún. <Link to="/admin/upload">Añade tu primer contenido</Link></p>
            </div>
          ) : (
            <div className="recent-list">
              {recentContent.map(item => (
                <div key={item.id} className="recent-item">
                  <div className="recent-icon"><Icon type={item.type} className="recent-icon-svg" /></div>
                  <div className="recent-info">
                    <h4>{item.title}</h4>
                    <p>{item.type.toUpperCase()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
