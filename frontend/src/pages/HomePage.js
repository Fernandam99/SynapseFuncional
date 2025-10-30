import React, { useEffect, useState } from 'react';
import { Clock, Leaf, CheckCircle, Star, Users, User, Target, TrendingUp } from 'lucide-react';
import api from '../services/api';

export default function HomePage({ user, onAuthClick }) {
  const [backendUp, setBackendUp] = useState(null);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function checkBackend() {
      try {
        const res = await api.get('/home');
        if (!mounted) return;
        setBackendUp(true);
        setError('');
      } catch (e) {
        console.error('Backend /home check failed', e);
        if (!mounted) return;
        setBackendUp(false);
        setError('No se pudo conectar con el backend');
      }
    }

    async function loadStats() {
      setLoadingStats(true);
      try {
        const r = await api.get('/tarea/estadisticas');
        if (!mounted) return;
        setStats(r.data || null);
      } catch (e) {
        console.info('No stats endpoint or failed to fetch stats', e.message);
        if (!mounted) return;
        setStats(null);
      } finally {
        if (mounted) setLoadingStats(false);
      }
    }

    checkBackend();
    loadStats();

    const interval = setInterval(checkBackend, 30000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  // Lista de técnicas disponibles
  const tecnicas = [
    { id: 1, nombre: 'Pomodoro', descripcion: 'Mejora tu productividad trabajando en bloques de tiempo con pausas estratégicas.', ruta: '/pomodoro', Icon: Clock, color: '#667eea' },
    { id: 2, nombre: 'Meditación', descripcion: 'Reduce el estrés y aumenta tu claridad mental con prácticas guiadas de mindfulness.', ruta: '/meditacion', Icon: Leaf, color: '#764ba2' },
    { id: 3, nombre: 'Tareas', descripcion: 'Organiza y gestiona tus pendientes fácilmente.', ruta: '/tareas', Icon: CheckCircle, color: '#22c55e' },
    { id: 4, nombre: 'Recompensas', descripcion: 'Gana logros y puntos por tus hábitos.', ruta: '/recompensas', Icon: Star, color: '#eab308' },
    { id: 5, nombre: 'Sesiones Grupales', descripcion: 'Conéctate con otros usuarios en tiempo real.', ruta: '/sesion-grupal', Icon: Users, color: '#3b82f6' },
    { id: 6, nombre: 'Perfil', descripcion: 'Configura y revisa tu progreso personal.', ruta: '/perfil', Icon: User, color: '#8b5cf6' }
  ];

  // Manejo de autenticación
  const handleAuth = (mode) => { if (onAuthClick) onAuthClick(mode); };

  // Manejo de navegación a técnicas
  const handleTecnicaClick = (ruta) => { window.location.href = ruta; };

  return (
    <>
      <main className="main-with-sidebar">
        <div className="content-frame">
          <div className="homepage-root">
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.05); } }
        @keyframes gradientMove { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse { animation: pulse 2s ease-in-out infinite; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .homepage-root { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; overflow-x: hidden; }
        .hero-section { background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); }
        .section-features { background: var(--bg-secondary, #f8fafc); }
        .section-techniques { background: var(--primary-gradient); color: white; }
        .section-cta { background: var(--bg-secondary, #1e293b); color: var(--text-on-primary, white); text-align: center; }
        .section-cta { background: #1e293b; color: var(--text-on-primary, white); text-align: center; }
        .section-title { color: var(--text-primary); }
        .section-subtitle { color: var(--text-secondary); }
        .feature-card h3 { color: var(--text-primary); }
        .feature-card p { color: var(--text-secondary); }
        .btn-cta-final { padding: 1rem 2rem; border: none; background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%); color: white; border-radius: 9999px; font-weight: 600; cursor: pointer; font-size: 1rem; box-shadow: 0 10px 25px rgba(255,107,107,0.3); transition: all 0.3s ease; }
        .btn-cta-final:hover { transform: scale(1.05); box-shadow: 0 15px 35px rgba(255, 107, 107, 0.4); }
 
        [data-theme='dark'] .section-features { background: var(--bg-secondary, #111827); }
        [data-theme='dark'] .section-techniques { background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); }
        [data-theme='dark'] .section-cta { background: var(--bg-primary, #0f172a); color: var(--text-on-primary, #f9fafb); }
        [data-theme='dark'] .section-cta { background: #0f172a; color: var(--text-on-primary, #f9fafb); }

        /* Fallbacks for CSS variables if not defined globally */
        :root {
          --bg-secondary: #f8fafc;
          --bg-surface-raised: #1a202c;
          --text-primary: #1f2937;
          --text-secondary: #6b7280;
        }
        .status-badge { display:inline-block; padding:6px 10px; border-radius:9999px; font-weight:600; font-size:0.85rem; }
      `}</style>

      <section className="homepage-hero-fullbleed hero-section">
        <div className="hero-inner">
          <div className="hero-grid">
            <div className="hero-text" style={{ color: 'white' }}>
              <h1 style={{ color: 'white' }}>
                Potencia tu <span style={{ background: 'linear-gradient(135deg, #fde047 0%, #f97316 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Mente</span>
              </h1>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Entrena tu concentración, medita con propósito y transforma tu productividad con técnicas científicamente probadas.</p>

              <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                {backendUp === null ? (
                  <span className="status-badge" style={{ background: '#ffe58a', color: '#663c00' }}>Comprobando backend...</span>
                ) : backendUp ? (
                  <span className="status-badge" style={{ background: '#d1fae5', color: '#065f46' }}>Backend conectado</span>
                ) : (
                  <span className="status-badge" style={{ background: '#fecaca', color: '#7f1d1d' }}>Backend desconectado</span>
                )}
              </div>

              <div className="hero-ctas">
                <button className="btn-hero primary" onClick={() => handleAuth('register')}>Registrarse</button>
                <button className="btn-hero ghost" onClick={() => handleAuth('login')}>Iniciar Sesión</button>
              </div>
            </div>

            <div className="hero-visual animate-float">
              <div className="pulse animate-pulse"></div>
              <div className="ring"></div>
              <div className="dot"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-features" style={{ padding: '6rem 0' }}>
        <div className="content-inner">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 className="section-title" style={{ fontSize: 'clamp(1.875rem, 4vw, 2.25rem)', fontWeight: '700', marginBottom: '1rem' }}>Características que <span style={{ color: '#667eea' }}>Transforman</span></h2>
            <p className="section-subtitle" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', maxWidth: '42rem', margin: '0 auto' }}>Todo lo que necesitas para entrenar tu mente más fuerte y productiva.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="feature-card" style={{ textAlign: 'center', transition: 'all 0.3s ease' }}>
              <div style={{ width: '5rem', height: '5rem', margin: '0 auto 2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <Target size={32} color="white" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Entrenamiento de Concentración</h3>
              <p style={{ lineHeight: '1.6' }}>Ejercicios personalizados para mejorar tu enfoque mental.</p>
            </div>
            <div className="feature-card" style={{ textAlign: 'center', transition: 'all 0.3s ease' }}>
              <div style={{ width: '5rem', height: '5rem', margin: '0 auto 2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                <Leaf size={32} color="white" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Meditación Inteligente</h3>
              <p style={{ lineHeight: '1.6' }}>Sesiones guiadas con biofeedback y adaptación en tiempo real.</p>
            </div>
            <div className="feature-card" style={{ textAlign: 'center', transition: 'all 0.3s ease' }}>
              <div style={{ width: '5rem', height: '5rem', margin: '0 auto 2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                <TrendingUp size={32} color="white" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Análisis Avanzado</h3>
              <p style={{ lineHeight: '1.6' }}>Reportes detallados para maximizar tu desarrollo.</p>
            </div>
          </div>
        </div>
      </section>

  <section className="section-techniques" style={{ padding: '4rem 1rem' }}>
        <div className="content-inner">
          <h2 style={{ fontSize: 'clamp(1.875rem, 4vw, 2.25rem)', fontWeight: '700', marginBottom: '3rem', color: 'white', textAlign: 'center' }}>Técnicas Disponibles</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {tecnicas.map((tecnica) => {
              const { Icon } = tecnica;
              return (
                <div key={tecnica.id} className="tech-card">
                  <div className="tech-icon" style={{ marginBottom: '1rem' }}><Icon size={40} color={tecnica.color} /></div>
                  <h3 className="tech-title">{tecnica.nombre}</h3>
                  <p className="tech-desc">{tecnica.descripcion}</p>
                  <button className="tech-cta" onClick={() => handleTecnicaClick(tecnica.ruta)}>Ir a {tecnica.nombre}</button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sección de estadísticas eliminada por petición del usuario */}

      <section className="section-cta" style={{ padding: '6rem 0' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '0 1.5rem' }}>
          <h2 style={{ fontSize: 'clamp(1.875rem, 4vw, 2.25rem)', fontWeight: '700', marginBottom: '1.5rem' }}>¿Listo para <span style={{ color: '#ffd700' }}>Transformar tu Mente?</span></h2>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', lineHeight: '1.6', marginBottom: '3rem', opacity: 0.9, color: 'var(--text-muted, #d1d5db)' }}>Únete a miles de personas entrenando su mente para alcanzar su máximo potencial.</p>
          <button onClick={() => handleAuth('register')} className="btn-cta-final">Comenzar Ahora</button>
        </div>
      </section>

          
          </div>
        </div>
      </main>
    </>
  );
}