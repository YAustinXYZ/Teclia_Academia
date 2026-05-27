import { Sidebar } from '../../components/common/Sidebar.jsx';
import { UploadForm } from '../../components/content/UploadForm.jsx';
import { ContentGrid } from '../../components/content/ContentGrid.jsx';
import { useContent } from '../../context/ContentContext.jsx';
import axios from 'axios';

export const AdminUploadPage = () => {
  const { content, removeContent } = useContent();

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este contenido?')) {
      try {
        const token = localStorage.getItem('authToken');
        await axios.delete(
          `http://localhost:3001/api/content/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        removeContent(id);
      } catch (err) {
        alert('Error al eliminar contenido: ' + err.response?.data?.error);
      }
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h1>Gestionar contenido</h1>
          <p>Agrega videos, PDFs, audios o imágenes para la plataforma (solo administrador)</p>
        </div>

        <div className="admin-grid">
          <div className="admin-upload-section">
            <UploadForm />
          </div>

          <div className="admin-content-section">
            <h2>Contenido Reciente</h2>
            <ContentGrid
              content={content.slice(0, 5)}
              onDelete={handleDelete}
              isAdmin={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUploadPage;
