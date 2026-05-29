import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api.js';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [sent, setSent] = useState(false);
  const [emailSentTo, setEmailSentTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      if (!sent) {
        const res = await authService.forgotPassword(email);
        const successMessage = res.data.message || 'Se ha enviado un PIN de recuperación al correo. Revisa tu bandeja de entrada.';
        setMessage(successMessage);
        setEmailSentTo(email);
        setSent(true);
      } else {
        await authService.resetPassword(emailSentTo || email, pin, newPassword);
        setMessage('Contraseña restablecida correctamente. Redirigiendo al login...');
        setTimeout(() => navigate('/auth/login'), 1300);
      }
    } catch (err) {
      setError(err.response?.data?.error || (sent ? 'No se pudo restablecer la contraseña.' : 'No se pudo enviar el correo de recuperación.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>{sent ? 'Restablecer contraseña' : 'Recuperar contraseña'}</h1>
          <p className="auth-subtitle">
            {sent
              ? 'Introduce el PIN que recibiste y escribe una nueva contraseña.'
              : 'Ingresa tu correo y te enviaremos un PIN para restablecer tu contraseña.'}
          </p>

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {!sent ? (
              <div className="form-group">
                <label htmlFor="recover-email">Email</label>
                <input
                  id="recover-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@email.com"
                />
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={emailSentTo}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recover-pin">PIN de recuperación</label>
                  <input
                    id="recover-pin"
                    type="text"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    required
                    placeholder="123456"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recover-password">Nueva contraseña</label>
                  <input
                    id="recover-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Nueva contraseña"
                  />
                </div>
              </>
            )}

            <button type="submit" disabled={loading} className="button button-primary button-block">
              {loading ? (sent ? 'Restableciendo...' : 'Enviando PIN...') : (sent ? 'Restablecer contraseña' : 'Enviar PIN de recuperación')}
            </button>
          </form>

          <p className="auth-footer">
            {sent ? (
              <button
                type="button"
                className="link-button"
                onClick={() => {
                  setSent(false);
                  setMessage(null);
                  setError(null);
                  setPin('');
                  setNewPassword('');
                }}
              >
                Volver a enviar PIN
              </button>
            ) : (
              <Link to="/auth/login">¿Recordaste tu contraseña? Iniciar sesión</Link>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
