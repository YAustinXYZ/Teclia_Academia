import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { Logo } from './Logo.jsx';
import { useState } from 'react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Logo />
        </Link>

        <div className="navbar-menu">
          {user ? (
            <div className="navbar-user">
              <div className="navbar-links-inline">
                <Link to="/recursos" className="button button-ghost">Recursos</Link>
                {user.role === 'admin' && (
                  <>
                    <Link to="/admin" className="button button-ghost">Panel</Link>
                    <Link to="/admin/upload" className="button button-ghost">Gestionar contenido</Link>
                  </>
                )}
              </div>
              <span className="user-role">{user.role === 'admin' ? 'Admin' : 'Estudiante'}</span>
              
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
                Login
              </Link>
              <Link to="/auth/signup" className="button button-primary">
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
