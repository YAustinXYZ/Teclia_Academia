import { useEffect, useState } from 'react';
import { useContent } from '../../context/ContentContext.jsx';
import { ContentGrid } from '../../components/content/ContentGrid.jsx';

const RecursosPage = () => {
  const { content, loadContent, loading } = useContent();

  useEffect(() => {
    if (!content || content.length === 0) {
      loadContent();
    }
  }, []);

  return (
    <div className="page-shell">
      <section className="section-surface">
        <div className="section-intro">
          <h2>Recursos disponibles</h2>
          <p className="section-copy">Accede a todos los recursos compartidos por los instructores de Teclia.</p>
        </div>

        <ContentGrid
          content={content}
          isAdmin={false}
        />
      </section>
    </div>
  );
};

export default RecursosPage;
