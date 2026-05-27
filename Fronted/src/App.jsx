import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ContentProvider } from './context/ContentContext.jsx';
import { ProtectedRoute } from './components/auth/ProtectedRoute.jsx';
import { Navbar } from './components/common/Navbar.jsx';
import LandingPage from './pages/public/LandingPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import SignupPage from './pages/auth/SignupPage.jsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import AdminUploadPage from './pages/admin/AdminUploadPage.jsx';
import AdminContentPage from './pages/admin/AdminContentPage.jsx';

export const Dashboard = () => (
  <div className="page-shell">
    <h1>Dashboard</h1>
    <p>Bienvenido al dashboard. Próximamente: galería de contenido.</p>
  </div>
);

export const NotFoundPage = () => (
  <div className="page-shell">
    <h1>404 - Página no encontrada</h1>
    <a href="/" className="button button-primary">Volver a inicio</a>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <ContentProvider>
          <Navbar />
          <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/upload"
            element={
              <ProtectedRoute role="admin">
                <AdminUploadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/content"
            element={
              <ProtectedRoute role="admin">
                <AdminContentPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ContentProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
