import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

export const LoginPage = () => {
  const [email, setEmail] = useState('admin@teclia.com');
  const [password, setPassword] = useState('Admin123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>Inicia sesión</h1>
          <p className="auth-subtitle">Bienvenido de vuelta a Teclia</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={loading} className="button button-primary button-block">
              {loading ? 'Cargando...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="auth-footer">
            ¿No tienes cuenta? <Link to="/auth/signup">Crea una aquí</Link>
          </p>

          <div className="demo-credentials">
            <p className="demo-title">Credenciales de demo:</p>
            <p><strong>Admin:</strong> admin@teclia.com / Admin123!</p>
            <p><strong>Estudiante:</strong> student1@teclia.com / Student123!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
