import { useMemo, useState } from 'react';

const navigation = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Explora', href: '#explora' },
  { label: 'Premium', href: '#premium' },
  { label: 'Studio', href: '#studio' },
  { label: 'Contacto', href: '#contacto' },
];

const features = [
  {
    title: 'Lecciones en video',
    description: 'Lecciones prácticas en video y rutas de aprendizaje estructuradas.',
  },
  {
    title: 'Piezas y acompañamientos',
    description: 'Pistas y partituras para práctica y estudio.',
  },
  {
    title: 'Lecciones estructuradas',
    description: 'Módulos y ejercicios organizados para avanzar paso a paso.',
  },
  {
    title: 'Teoría y partituras',
    description: 'Artículos, escalas y partituras para profundizar el conocimiento musical.',
  },
];

const premiumPlans = [
  {
    label: 'Básico',
    price: '$9.99',
    features: ['Acceso a recursos', 'Lecciones guiadas', 'Comunidad privada'],
  },
  {
    label: 'Pro',
    price: '$24.99',
    features: ['Feedback de IA', 'Clases 1:1', 'Partituras exclusivas'],
    highlight: true,
  },
  {
    label: 'Master',
    price: '$49.99',
    features: ['Plan personalizado', 'Sesiones premium', 'Análisis avanzado'],
  },
];

const scaleOptions = [
  { name: 'Mayor', notes: 'C D E F G A B' },
  { name: 'Menor', notes: 'C D Eb F G Ab Bb' },
  { name: 'Pentatónica', notes: 'C D E G A' },
  { name: 'Blues', notes: 'C Eb F Gb G Bb' },
];

function LandingPage() {
  const [selectedScale, setSelectedScale] = useState(scaleOptions[0]);

  const keyboardKeys = useMemo(
    () => [
      { label: 'C', type: 'white' },
      { label: 'C#', type: 'black' },
      { label: 'D', type: 'white' },
      { label: 'D#', type: 'black' },
      { label: 'E', type: 'white' },
      { label: 'F', type: 'white' },
      { label: 'F#', type: 'black' },
      { label: 'G', type: 'white' },
      { label: 'G#', type: 'black' },
      { label: 'A', type: 'white' },
      { label: 'A#', type: 'black' },
      { label: 'B', type: 'white' },
    ],
    []
  );

  return (
    <div className="page-shell">
      <header className="topbar" id="inicio">
        <div className="brand">
          <span className="brand-mark">T</span>
          <div>
            <p className="brand-name">Teclia</p>
            <p className="brand-tag">Piano learning, refined.</p>
          </div>
        </div>
        <nav className="nav-links">
          {navigation.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <section className="hero section-surface">
          <div className="hero-copy">
            <p className="eyebrow">Teclia · Piano training</p>
            <h1>Aprende piano. Sin límites.</h1>
            <p className="hero-text">
              Teclia es una plataforma de aprendizaje interactivo de piano creada para estudiantes.
              Minimalismo, claridad y contenido premium en una experiencia de estudio de clase mundial.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#explora">
                Comenzar gratis
              </a>
              <a className="button button-secondary" href="#premium">
                Ver planes Premium
              </a>
            </div>
          </div>
          <div className="hero-panel">
            <div className="hero-card">
              <span className="hero-badge">Lanzamiento</span>
              <h2>Tu estudio de piano digital</h2>
              <p>Accede a lecciones organizadas, partituras y recursos interactivos curados por el instructor.</p>
              <ul className="hero-list">
                <li>Videos y partituras</li>
                <li>Lecciones organizadas</li>
                <li>Recursos gratuitos y premium</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section-surface section-grid">
          <div className="section-intro">
            <p className="eyebrow">¿Por qué Teclia?</p>
            <h2>Una plataforma construida para el aprendizaje musical con estilo.</h2>
          </div>
          <div className="feature-grid">
            <article className="feature-card">
              <h3>Diseño minimalista</h3>
              <p>Espacios limpios, tipografía precisa y una navegación que invita a concentrarte en el aprendizaje.</p>
            </article>
            <article className="feature-card">
              <h3>Recursos estructurados</h3>
              <p>Lecciones, partituras y ejercicios organizados para un progreso claro y medible.</p>
            </article>
            <article className="feature-card">
              <h3>Premium con confianza</h3>
              <p>Bloquea lecciones, ofrece acceso exclusivo y convierte el aprendizaje en una experiencia valiosa.</p>
            </article>
          </div>
        </section>

        <section className="section-surface section-studio" id="studio">
          <div>
            <p className="eyebrow">Tu estudio</p>
            <h2>Contenido curado por el instructor</h2>
            <p className="section-copy">
              Todos los contenidos son publicados por el instructor. Los estudiantes acceden a lecciones interactivas y materiales cuidadosamente seleccionados.
            </p>
          </div>
          <div className="studio-grid">
            {features.map((item) => (
              <article className="studio-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-surface section-preview" id="premium">
          <div className="preview-copy">
            <p className="eyebrow">Teclia Pro</p>
            <h2>Experiencia premium para alumnos y creadores</h2>
            <p>Acceso a planes, análisis de progreso, clases 1:1 y contenido exclusivo con una presentación cuidada al detalle.</p>
          </div>
          <div className="pricing-grid">
            {premiumPlans.map((plan) => (
              <div key={plan.label} className={`pricing-card ${plan.highlight ? 'pricing-card-highlight' : ''}`}>
                {plan.highlight && <span className="plan-badge">Recomendado</span>}
                <h3>{plan.label}</h3>
                <p className="plan-price">{plan.price}</p>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <button className="button button-outline">Elegir plan</button>
              </div>
            ))}
          </div>
        </section>

        <section className="section-surface section-explore" id="explora">
          <div className="explore-copy">
            <p className="eyebrow">Explora</p>
            <h2>Recursos gratuitos que hacen que aprender sea intuitivo.</h2>
            <p>Biblioteca de escalas, teoría musical, notas en pentagrama y ejercicios interactivos. Todo en un solo lugar.</p>
            <div className="scale-selector">
              {scaleOptions.map((scale) => (
                <button
                  key={scale.name}
                  className={scale.name === selectedScale.name ? 'scale-button active' : 'scale-button'}
                  onClick={() => setSelectedScale(scale)}
                >
                  {scale.name}
                </button>
              ))}
            </div>
            <p className="scale-details">Notas: {selectedScale.notes}</p>
          </div>
          <div className="keyboard-shell">
            <div className="keyboard">
              {keyboardKeys.map((key) => (
                <button key={key.label} className={`piano-key ${key.type}`} type="button">
                  {key.type === 'white' ? key.label : ''}
                </button>
              ))}
            </div>
            <p className="keyboard-caption">Teclado interactivo — toca cada nota con el cursor.</p>
          </div>
        </section>

        <section className="section-surface section-about" id="contacto">
          <div className="about-copy">
            <p className="eyebrow">Conecta conmigo</p>
            <h2>Teclia está construyéndose para ser tu escuela de piano online.</h2>
            <p>Mi nombre es [Tu Nombre], este proyecto será tu plataforma de aprendizaje y espacio de crecimiento musical.</p>
            <div className="contact-cards">
              <div className="contact-card">
                <p className="contact-label">Teléfono</p>
                <p className="contact-value">+57 300 000 0000</p>
              </div>
              <div className="contact-card">
                <p className="contact-label">Email</p>
                <p className="contact-value">hola@teclia.com</p>
              </div>
            </div>
          </div>
          <div className="social-panel">
            <p className="social-title">Redes sociales</p>
            <div className="social-links">
              <a href="#" aria-label="Instagram">Instagram</a>
              <a href="#" aria-label="YouTube">YouTube</a>
              <a href="#" aria-label="TikTok">TikTok</a>
              <a href="#" aria-label="LinkedIn">LinkedIn</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>
          <p className="footer-logo">Teclia</p>
          <p>Democratizando el aprendizaje del piano con elegancia y tecnología.</p>
        </div>
        <div className="footer-links">
          <a href="#inicio">Inicio</a>
          <a href="#explora">Explora</a>
          <a href="#premium">Premium</a>
          <a href="#contacto">Contacto</a>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
