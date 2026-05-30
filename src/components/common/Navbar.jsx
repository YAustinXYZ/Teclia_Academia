import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { Logo } from './Logo.jsx';
import { resolveAvatar } from '../../utils/avatar.js';
import { planLabel } from '../../utils/plans.js';
import { useState } from 'react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const isAdminPath = (path) => location.pathname === path;

  const avatarSrc = resolveAvatar(user?.avatar_url || '');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" title="Volver al inicio">
          <Logo size={36} showTagline={false} />
        </Link>

        <div className="navbar-menu">
          {user ? (
            <div className="navbar-user">
              <div className="navbar-links-inline">
                <Link to="/recursos" className="button button-ghost">Recursos</Link>
                {user.role === 'admin' && (
                  <>
                    <Link to="/admin" className={`button button-ghost ${isAdminPath('/admin') ? 'nav-active' : ''}`}>Mi escuela</Link>
                    <Link to="/admin/students" className={`button button-ghost ${isAdminPath('/admin/students') ? 'nav-active' : ''}`}>Estudiantes</Link>
                    <Link to="/admin/upload" className={`button button-ghost ${['/admin/upload', '/admin/content'].includes(location.pathname) ? 'nav-active' : ''}`}>Gestionar contenido</Link>
                  </>
                )}
              </div>
              <span className="user-role">
                {user.role === 'admin'
                  ? '👑 Instructor'
                  : user.plan_tier
                    ? `✨ ${planLabel(user.plan_tier)}`
                    : user.role === 'premium'
                      ? '✨ Alumno premium'
                      : '🎓 Estudiante'}
              </span>

              <Link to="/profile" className="navbar-avatar-link" title="Mi perfil">
                {avatarSrc ? (
                  <img src={avatarSrc} alt="Foto de perfil" className="navbar-avatar" />
                ) : (
                  <span className="navbar-avatar navbar-avatar-placeholder">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                )}
              </Link>

              <div className="settings-dropdown-container">
                <button
                  className="button button-settings"
                  title="Configuración"
                  onClick={() => setSettingsOpen(!settingsOpen)}
                >
                  ⚙️
                </button>
                {settingsOpen && (
                  <div className="settings-dropdown">
                    <Link to="/profile" className="settings-option" onClick={() => setSettingsOpen(false)}>
                      👤 Mi Perfil
                    </Link>
                    <Link to="/profile?tab=security" className="settings-option" onClick={() => setSettingsOpen(false)}>
                      🔒 Seguridad
                    </Link>
                    <Link to="/profile?tab=subscription" className="settings-option" onClick={() => setSettingsOpen(false)}>
                      ⭐ Suscripción
                    </Link>
                    <div className="settings-divider"></div>
                    <button
                      className="settings-option logout-option"
                      onClick={() => {
                        handleLogout();
                        setSettingsOpen(false);
                      }}
                    >
                      🚪 Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="navbar-links">
              <Link to="/auth/login" className="button button-secondary">
                Iniciar sesión
              </Link>
              <Link to="/auth/signup" className="button button-primary">
                Registro de alumnos
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
