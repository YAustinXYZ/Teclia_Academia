import { useState } from 'react';
import axios from 'axios';
import { useContent } from '../../context/ContentContext.jsx';

export const UploadForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('video');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { addContent } = useContent();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!title || !url) {
      setError('Título y URL son requeridos');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.post(
        'http://localhost:3001/api/content/upload',
        {
          title,
          description,
          type,
          url
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      addContent(res.data.content);
      setSuccess(true);
      setTitle('');
      setDescription('');
      setUrl('');
      setType('video');

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error uploading content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <h2>Añadir contenido (solo administradores)</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Contenido agregado correctamente.</div>}

      <div className="form-group">
        <label htmlFor="title">Título</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Lección 1 - Acordes Mayores"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe el contenido brevemente..."
          rows={3}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="type">Tipo de Contenido</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="video">Video</option>
            <option value="pdf">PDF</option>
            <option value="audio">Audio</option>
            <option value="image">Imagen</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="url">URL del Contenido</label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/contenido"
          required
        />
      </div>

      <button type="submit" disabled={loading} className="button button-primary button-block">
        {loading ? 'Subiendo...' : 'Añadir contenido'}
      </button>
    </form>
  );
};
