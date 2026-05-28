import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { Logo } from './Logo.jsx';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
        <div className="header-extra">
          <Link to="/free" className="button button-ghost free-pill">Gratis</Link>
        </div>

        <div className="navbar-menu">
          {user ? (
            <div className="navbar-user">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role === 'admin' ? 'Admin' : 'Estudiante'}</span>

              <div className="navbar-links-inline">
                <Link to="/dashboard" className="button button-ghost">Dashboard</Link>
                {user.role === 'admin' && (
                  <>
                    <Link to="/admin" className="button button-ghost">Panel</Link>
                    <Link to="/admin/upload" className="button button-ghost">Gestionar contenido</Link>
                  </>
                )}
              </div>

              <button onClick={handleLogout} className="button button-secondary navbar-logout">
                Logout
              </button>
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
