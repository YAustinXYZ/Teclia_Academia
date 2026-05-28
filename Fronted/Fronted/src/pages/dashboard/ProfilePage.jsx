import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [changePassword, setChangePassword] = useState({ current: '', new: '', confirm: '' });
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (changePassword.new !== changePassword.confirm) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    if (changePassword.new.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        'http://localhost:3001/api/auth/change-password',
        {
          currentPassword: changePassword.current,
          newPassword: changePassword.new,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswordSuccess(true);
      setChangePassword({ current: '', new: '', confirm: '' });
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(err.response?.data?.error || 'Error cambiando contraseña');
    }
  };

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  return (
    <div className="profile-page">
      <div className="page-shell">
        <div className="profile-header">
          <h1>Perfil</h1>
          <p>Administra tu cuenta, seguridad y preferencias</p>
        </div>

        <div className="profile-tabs">
          <button
            className={`profile-tab ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            className={`profile-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Seguridad
          </button>
          <button
            className={`profile-tab ${activeTab === 'subscription' ? 'active' : ''}`}
            onClick={() => setActiveTab('subscription')}
          >
            Suscripción
          </button>
        </div>

        {activeTab === 'general' && (
          <div className="profile-content">
            <div className="profile-section">
              <h2>Información general</h2>
              <div className="profile-card">
                <div className="profile-field">
                  <label>Nombre</label>
                  <p className="profile-value">{user?.name}</p>
                </div>
                <div className="profile-field">
                  <label>Email</label>
                  <p className="profile-value">{user?.email}</p>
                </div>
                <div className="profile-field">
                  <label>Tipo de cuenta</label>
                  <p className="profile-value">
                    <span className="role-badge">{user?.role === 'admin' ? 'Admin' : user?.role === 'premium' ? 'Premium' : 'Gratis'}</span>
                  </p>
                </div>
                <div className="profile-field">
                  <label>Estado</label>
                  <p className="profile-value"><span className="status-active">● Activo</span></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="profile-content">
            <div className="profile-section">
              <h2>Cambiar contraseña</h2>
              <div className="profile-card">
                {passwordError && <div className="error-message">{passwordError}</div>}
                {passwordSuccess && <div className="success-message">Contraseña actualizada correctamente</div>}
                <form onSubmit={handleChangePassword} className="password-form">
                  <div className="form-group">
                    <label htmlFor="current">Contraseña actual</label>
                    <input
                      id="current"
                      type="password"
                      value={changePassword.current}
                      onChange={(e) => setChangePassword({ ...changePassword, current: e.target.value })}
                      required
                      placeholder="Ingresa tu contraseña actual"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="new">Nueva contraseña</label>
                    <input
                      id="new"
                      type="password"
                      value={changePassword.new}
                      onChange={(e) => setChangePassword({ ...changePassword, new: e.target.value })}
                      required
                      placeholder="Ingresa tu nueva contraseña"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirm">Confirmar nueva contraseña</label>
                    <input
                      id="confirm"
                      type="password"
                      value={changePassword.confirm}
                      onChange={(e) => setChangePassword({ ...changePassword, confirm: e.target.value })}
                      required
                      placeholder="Confirma tu nueva contraseña"
                    />
                  </div>
                  <button type="submit" className="button button-primary">
                    Actualizar contraseña
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="profile-content">
            <div className="profile-section">
              <h2>Plan actual</h2>
              <div className="profile-card">
                <div className="subscription-info">
                  <p className="sub-label">Tu plan actual es:</p>
                  <p className="sub-value">
                    {user?.role === 'admin' ? 'Admin' : user?.role === 'premium' ? 'Premium' : 'Gratis'}
                  </p>
                  {user?.role === 'gratis' || user?.role === 'user' ? (
                    <>
                      <p className="sub-description">Actualiza tu cuenta para acceder a beneficios exclusivos y contenido premium.</p>
                      <button onClick={handleUpgrade} className="button button-primary">
                        Mejorar a Premium
                      </button>
                    </>
                  ) : (
                    <p className="sub-description">Gracias por tu suscripción. Disfruta de todos los beneficios de tu plan.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
