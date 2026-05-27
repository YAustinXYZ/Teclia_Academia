import { useState } from 'react';
import { Icon } from '../common/Icons.jsx';

export const ContentGrid = ({ content, onDelete, isAdmin = false }) => {
  const [filter, setFilter] = useState('all');

  const filteredContent = filter === 'all'
    ? content
    : content.filter(item => item.type === filter);

  const getIcon = (type) => <Icon type={type} className="content-type-icon" />;

  return (
    <div className="content-section">
      <div className="content-header">
        <h2>Contenido</h2>
        <div className="content-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todos
          </button>
          <button
            className={`filter-btn ${filter === 'video' ? 'active' : ''}`}
            onClick={() => setFilter('video')}
          >
            Videos
          </button>
          <button
            className={`filter-btn ${filter === 'pdf' ? 'active' : ''}`}
            onClick={() => setFilter('pdf')}
          >
            PDFs
          </button>
          <button
            className={`filter-btn ${filter === 'audio' ? 'active' : ''}`}
            onClick={() => setFilter('audio')}
          >
            Audios
          </button>
          <button
            className={`filter-btn ${filter === 'image' ? 'active' : ''}`}
            onClick={() => setFilter('image')}
          >
            Imágenes
          </button>
        </div>
      </div>

      {filteredContent.length === 0 ? (
        <div className="empty-state">
          <p>No hay contenido {filter !== 'all' ? `de tipo ${filter}` : ''}</p>
        </div>
      ) : (
        <div className="content-grid">
          {filteredContent.map(item => (
            <div key={item.id} className="content-card">
              <div className="content-icon">{getIcon(item.type)}</div>
              <h3>{item.title}</h3>
              <p className="content-desc">{item.description || 'Sin descripción'}</p>
              <p className="content-type">
                <span className="badge">{item.type.toUpperCase()}</span>
              </p>
              <p className="content-author">Por: {item.uploaded_by_name}</p>
              <div className="content-actions">
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="button button-secondary">
                  Ver
                </a>
                {isAdmin && (
                  <button
                    onClick={() => onDelete(item.id)}
                    className="button button-danger"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
