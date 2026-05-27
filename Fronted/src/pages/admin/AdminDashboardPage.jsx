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
          <h1>Panel administrativo</h1>
          <p>Bienvenido, {user?.name}. Gestiona la plataforma desde aquí</p>
        </div>

        <div className="admin-quick-actions">
          <Link to="/admin/upload" className="action-card">
            <div className="action-icon">Añadir</div>
            <h3>Añadir contenido</h3>
            <p>Agrega videos, PDFs, audios e imágenes</p>
          </Link>
          <Link to="/admin/content" className="action-card">
            <div className="action-icon">Contenido</div>
            <h3>Gestor de Contenido</h3>
            <p>Administra todo tu contenido</p>
          </Link>
          <Link to="/admin/users" className="action-card">
            <div className="action-icon">Usuarios</div>
            <h3>Usuarios</h3>
            <p>Gestiona estudiantes y usuarios</p>
          </Link>
        </div>

        <div className="admin-stats">
          <h2>Estadísticas Rápidas</h2>
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
          <h2>Contenido Reciente</h2>
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
                    <p>{item.type.toUpperCase()} • {new Date(item.created_at).toLocaleDateString()}</p>
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
