import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Target, CheckCircle, User, LogIn, UserPlus, Menu, X, Globe } from "lucide-react";
import ThemeToggle from "./ThemeToggle"; // 1. Importar el componente del interruptor
import isotipo from "../static/IMG/isotipo.png";
import { useTranslation } from 'react-i18next';

export default function Navbar({ user, onAuthClick, onLogout, theme, toggleTheme }) { // 2. Aceptar las nuevas props
  const { t, i18n } = useTranslation();
  const profileMenuRef = useRef(null);
  const languageMenuRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openLanguageMenu, setOpenLanguageMenu] = useState(false);
  const [expanded, setExpanded] = useState(false); // expand sidebar on hover (desktop)
  const location = useLocation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    setOpenLanguageMenu(false);
  };

  const languages = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'pt', name: 'Português' },
  ];

  const navItems = [
    { path: '/', label: t('Home'), icon: <Home size={18} /> },
    { path: '/pomodoro', label: t('Pomodoro'), icon: <Target size={18} /> },
    { path: '/concentracion', label: t('Concentración'), icon: <Target size={18} /> },
    { path: '/meditacion', label: t('Meditación'), icon: <CheckCircle size={18} />, requiresAuth: true },
    { path: '/sesion-grupal', label: t('Sesión Grupal'), icon: <CheckCircle size={18} />, requiresAuth: true },
    { path: '/perfil', label: t('Perfil'), icon: <User size={18} />, requiresAuth: true },
  ];

  // Efecto para cerrar el menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setOpenProfile(false);
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setOpenLanguageMenu(false);
      }
    }
    if (openProfile || openLanguageMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openProfile, openLanguageMenu]);

  return (
    <>
      <aside
        className={`sidebar ${isMenuOpen ? 'open' : ''} ${expanded ? 'expanded' : 'collapsed'}`}
        aria-label="Main navigation"
        onMouseEnter={() => { if (window && window.innerWidth > 900) setExpanded(true); }}
        onMouseLeave={() => {
          if (window && window.innerWidth > 900) {
            setExpanded(false);
          }
          setOpenProfile(false);
        }}
      >
        <div className="sidebar-top">
          <Link to="/" className="nav-logo">
            <img src={isotipo} alt="Logo" className="logo-img" />
            <span className="logo-text">Synapse</span>
          </Link>
          {/* user info moved to Topbar */}
        </div>

        <nav>
          <ul className="sidebar-menu">
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link to={item.path} className={`sidebar-link ${isActive ? 'active' : ''}`} aria-current={isActive ? 'page' : undefined} onClick={() => setIsMenuOpen(false)}>
                    <span className="link-icon">{item.icon}</span>
                    <span className="link-label">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div class="sidebar-bottom">
          {/* 3. Añadir el interruptor de tema para la vista de escritorio */}
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <div ref={languageMenuRef} style={{ position: 'relative' }}>
            <button onClick={() => setOpenLanguageMenu(s => !s)} className="btn-language" aria-expanded={openLanguageMenu} aria-haspopup="true">
              <Globe size={20} />
            </button>
            {openLanguageMenu && (
              <div className="profile-menu" role="menu">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className="profile-menu-item"
                    role="menuitem"
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {!user ? (
            <>
              <button onClick={() => onAuthClick('login')} className="btn-login">
                <LogIn size={16} className="btn-icon" />
                <span className="btn-label">{t('Iniciar Sesión')}</span>
              </button>
              <button onClick={() => onAuthClick('register')} className="btn-register">
                <UserPlus size={16} className="btn-icon" />
                <span className="btn-label">{t('Registrarse')}</span>
              </button>
            </>
          ) : (
            <div ref={profileMenuRef} style={{ position: 'relative' }}>
              <button onClick={() => setOpenProfile(s => !s)} className="btn-register" aria-expanded={openProfile} aria-haspopup="true" style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-start' }}>
                <div style={{ width:28, height:28, borderRadius:999, background:'#7c3aed', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>{(user?.Username || user?.nombre || user?.correo || 'U').charAt(0).toUpperCase()}</div>
                <span className="btn-label" style={{ textAlign: 'left' }}>{user?.Username || user?.nombre || user?.correo}</span>
              </button>
              
              {openProfile && (
                <div className="profile-menu" role="menu">
                  <Link to="/perfil" onClick={() => setOpenProfile(false)} className="profile-menu-item" role="menuitem">{t('Mi Perfil')}</Link>
                  <Link to="/config" onClick={() => setOpenProfile(false)} className="profile-menu-item" role="menuitem">{t('Configuración')}</Link>
                  <button 
                    onClick={() => { setOpenProfile(false); onLogout && onLogout(); }} 
                    className="profile-menu-item logout" role="menuitem"
                  >
                    {t('Cerrar Sesión')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Hamburger fixed small square in top-right (separate from sidebar to avoid hover expanding the bar) */}
        <div className="hamburger-wrap" aria-hidden={isMenuOpen ? 'false' : 'true'}>
        <button
          className="hamburger-btn"
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(prev => !prev)}
        >
          {/* Always show hamburger icon (do not switch to X) */}
          <Menu size={16} />
        </button>
      </div>

      {/* Mobile menu dropdown shown when hamburger is open */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`} aria-hidden={!isMenuOpen}>
  <div className="mobile-menu-card" role="dialog" aria-modal={isMenuOpen} tabIndex={-1}>
          <div className="mobile-menu-header">
            <div />
            <button className="mobile-close" aria-label="Cerrar menú" onClick={() => setIsMenuOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <nav className="mobile-nav">
            <ul>
              {navItems.map(item => (
                <li key={`mobile-${item.path}`}>
                  <Link to={item.path} className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                    <span className="link-icon">{item.icon}</span>
                    <span className="link-label">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mobile-actions">
            {!user ? (
              <>
                <button onClick={() => { onAuthClick('login'); setIsMenuOpen(false); }} className="mobile-action-btn btn-login">
                  <LogIn size={16} />
                  <span>{t('Iniciar Sesión')}</span>
                </button>
                <button onClick={() => { onAuthClick('register'); setIsMenuOpen(false); }} className="mobile-action-btn btn-register">
                  <UserPlus size={16} />
                  <span>{t('Registrarse')}</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/perfil" className="mobile-action-btn" onClick={() => setIsMenuOpen(false)}>
                  <User size={16} />
                  <span>{t('Mi Perfil')}</span>
                </Link>
                <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="mobile-action-btn btn-logout">
                  <User size={16} />
                  <span>{t('Cerrar Sesión')}</span>
                </button>
              </>
            )}
          </div>

          <div className="mobile-footer">
            {/* 4. Añadir el interruptor de tema para la vista móvil */}
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <small>Entrena tu concentración, medita con propósito y transforma tu productividad.</small>
          </div>
        </div>
      </div>

      <style>{`
        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0; 
          width: 64px; /* collapsed width */
          background: #aaadb1ff; /* gray background as requested */
          backdrop-filter: blur(4px);
          border-right: 1px solid rgba(0,0,0,0.06);
          border-bottom: none !important;
          box-shadow: none !important;
          padding: 1rem 0.6rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1rem;
          z-index: 1000;
          transition: width 200ms ease, background 200ms ease;
          overflow: visible;
        }

  /* hide hamburger and mobile menu by default (visible only on small screens) */
  .hamburger-wrap { display: none; }
  .hamburger-btn { display: none; }
        .mobile-menu { display: none; }

        .sidebar.expanded { width: 220px; padding-left: 1rem; padding-right: 1rem; }
  .sidebar .nav-logo { display:flex; align-items:center; gap:0.65rem; text-decoration:none; }
  .sidebar .logo-img { width:36px; height:36px; object-fit:contain; border-radius:6px; }
          .sidebar-top { display:flex; align-items:center; justify-content:space-between; position: relative; }
  .sidebar .logo-text { font-weight:800; color: #111827; font-size:0.95rem; }
  /* hide logo text when collapsed */
  .sidebar.collapsed .logo-text { display: none; } 

  .sidebar-menu { list-style:none; padding:0; margin: 0.75rem 0; display:flex; flex-direction:column; gap:0.5rem; }
  .sidebar-link { display:flex; align-items:center; gap:0.75rem; color: var(--text-primary); text-decoration:none; padding:0.5rem 0.6rem; border-radius:10px; font-weight:600; transition: all 0.18s ease; outline: none; }
  .sidebar-link .link-icon { display:inline-flex; width:28px; height:28px; align-items:center; justify-content:center; color: var(--text-primary); }
  .sidebar-link .link-label { color: var(--text-primary); }
  /* Hide labels when collapsed */
  .sidebar.collapsed .link-label { display: none; }
  .sidebar.expanded .link-label { display: inline-block; }
  .sidebar-link:hover, .sidebar-link:focus, .sidebar-link:active { background: rgba(0,0,0,0.04); color:var(--text-primary); transform: none; outline: none; }
  .sidebar-link.active { background: transparent; color: #ffffff; }
  .sidebar-link.active { background: rgba(0,0,0,0.06); }
  .sidebar-link.active .link-icon { color: var(--text-primary); }

  .sidebar-bottom { display:flex; flex-direction:column; gap:0.5rem; align-items: center; }
  .btn-login { background:transparent; border:1px solid transparent; color:var(--text-primary); padding:0.5rem; text-align:left; cursor:pointer; border-radius:8px; display:flex; align-items:center; gap:0.5rem; }
  .btn-login:hover { background: rgba(0,0,0,0.04); }
  .btn-register { background: linear-gradient(90deg,#7c3aed,#667eea); color:white; border:none; padding:0.55rem 0.9rem; border-radius:999px; cursor:pointer; box-shadow: 0 6px 18px rgba(99,102,241,0.12); display:flex; align-items:center; gap:0.5rem; }
  .btn-icon { color: #111827; }
  .btn-label { display: inline-block; }
  /* hide labels when collapsed */
  .sidebar.collapsed .btn-label { display: none; }

  /* Center buttons when collapsed */
  .sidebar.collapsed .sidebar-bottom {
    align-items: center;
  }

  /* Keep the bottom area visually pinned on tall sidebars */
  .sidebar-bottom { margin-top: auto; }

  /* Profile Menu (Desktop) */
  .profile-menu {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.15);
    overflow: hidden;
    border: 1px solid #e5e7eb;
    z-index: 10;
    padding: 6px;
    animation: popUpUp 150ms ease-out;
    transform-origin: bottom center;
  }

  @keyframes popUpUp {
    from { opacity: 0; transform: translateX(-50%) scale(0.95); }
    to { opacity: 1; transform: translateX(-50%) scale(1); }
  }
  .profile-menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    text-align: left;
    padding: 10px 12px;
    border: none;
    background: transparent;
    cursor: pointer;
    text-decoration: none;
    color: #111827;
    font-size: 14px;
    font-weight: 500;
    border-radius: 8px;
    transition: background-color 0.2s ease;
  }
  .profile-menu-item:hover { background: #f3f4f6; }
  .profile-menu-item.logout { color: #ef4444; }
  .profile-menu-item.logout:hover { color: #dc2626; background: #fee2e2; }

  [data-theme='dark'] .profile-menu {
    background: #2f2f2f;
    border-color: #374151;
  }
  [data-theme='dark'] .profile-menu-item { color: #f9fafb; }
  [data-theme='dark'] .profile-menu-item:hover { background: #374151; }
  [data-theme='dark'] .profile-menu-item.logout { color: #f87171; }
  [data-theme='dark'] .profile-menu-item.logout:hover { color: #ef4444; background: #450a0a; }
  /* End Profile Menu */

        /* Responsive: collapse sidebar to top bar on small screens */
        @media (max-width: 900px) {
          .sidebar { position: fixed; width: 100%; height: 70px; bottom: auto; left: 0; right:0; display:flex; flex-direction:row; align-items:center; padding:0.5rem 1rem; }
          .sidebar-menu { flex-direction:row; gap:1rem; margin:0; display: none; }
          .sidebar-bottom { flex-direction:row; gap:0.5rem; margin-left:auto; display: none; }
          .sidebar .logo-text { display:none; }
          .sidebar .link-label { display:none; }

          /* Disable hover expansion behavior on small screens so navbar doesn't shift left/right */
          .sidebar { width: 100% !important; }
          .sidebar.expanded, .sidebar.collapsed { width: 100% !important; }
          .sidebar .logo-img { width:32px; height:32px; }

          /* Hamburger: small fixed square in the corner. Only this small box responds to hover. */
       /* ensure the background behind the hamburger is fully transparent by default (no blue/gray box)
         and only show the purple hover state. Use !important to override build CSS if needed. */
  /* smaller square so it visually matches the icon size better */ 
  .hamburger-wrap { display:flex !important; position: fixed; right: 8px; top: 8px; width:34px; height:34px; align-items:center; justify-content:center; z-index:1101; border-radius:6px; background: transparent !important; box-shadow: none !important; transition: background 160ms ease, transform 120ms ease; }
  .hamburger-wrap:hover { background: linear-gradient(90deg,#7c3aed,#667eea) !important; transform: scale(1.02); }
  .hamburger-btn { display:inline-flex !important; background: transparent !important; border: none !important; width:22px; height:22px; align-items:center; justify-content:center; padding:0; cursor:pointer; color: var(--text-tertiary) !important; box-shadow: none !important; }
  .hamburger-btn svg { display:block; }
  .hamburger-wrap:hover .hamburger-btn { color: #ffffff !important; }

          /* Lower logo slightly and ensure full visibility */
          .sidebar .logo-img { margin-top:10px; width:40px; height:40px; }

          /* Mobile menu dropdown (hidden by default) */
          .mobile-menu { display:block; position: fixed; top: 70px; left: 0; right: 0; background: transparent; max-height: 0; overflow: hidden; transition: max-height 220ms ease, opacity 200ms ease; opacity: 0; z-index: 999; display:flex; justify-content:center; }
          .mobile-menu.open { max-height: 80vh; opacity: 1; }
          .mobile-menu-card { width: 100%; max-width: 520px; background: #ffffff; border-radius: 10px; margin: 0.5rem; box-shadow: 0 8px 30px rgba(2,6,23,0.08); overflow: hidden; display:flex; flex-direction:column; }

          .mobile-menu-header { display:flex; align-items:center; justify-content:flex-end; padding:0.25rem 0.4rem; border-bottom:1px solid rgba(0,0,0,0.04); }
          .mobile-close { background: transparent; border:none; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; padding:6px; width:28px; height:28px; border-radius:6px; color:var(--text-secondary); }
          .mobile-close:hover { background: rgba(0,0,0,0.03); }

          .mobile-nav ul { list-style:none; margin:0; padding:0.5rem 0.75rem; display:flex; flex-direction:column; gap:4px; }
          .mobile-link { display:flex; align-items:center; gap:0.75rem; padding:0.75rem 0.75rem; text-decoration:none; color:var(--text-primary); border-radius:8px; }
          .mobile-link:hover { background: rgba(0,0,0,0.04); }

          .mobile-actions { display:flex; flex-direction:column; gap:0.5rem; padding:0.75rem; }
          .mobile-action-btn { display:flex; align-items:center; gap:0.6rem; width:100%; padding:0.7rem 0.9rem; border-radius:10px; border: none; cursor:pointer; text-decoration:none; color:#111827; background: transparent; justify-content:center; }
          /* medium-light gray actions on mobile */
          .mobile-action-btn.btn-register { background: linear-gradient(90deg,#eef0f2,#d1d5db); color:#374151; border:1px solid #d1d5db; }
          .mobile-action-btn.btn-login { background: linear-gradient(90deg,#ffffff,#eef0f2); border:1px solid #d1d5db; color:#374151; }
          .mobile-action-btn.btn-logout { background: linear-gradient(90deg,#ef4444,#f97316); color: #fff; }
          
          .mobile-footer { padding:0.6rem 1rem 1rem; border-top:1px solid rgba(0,0,0,0.04); color:#6b7280; font-size:0.85rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; }

          .profile-menu { position: absolute; top: 50%; left: calc(100% + 8px); transform: translateY(-50%); width: 200px; background: var(--bg-primary); border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.15); overflow: hidden; border: 1px solid var(--border-default); z-index: 10; padding: 6px; animation: popUpSide 150ms ease-out; }
          @keyframes popUpSide {
    from { opacity: 0; transform: translateY(-50%) translateX(-5px); }
    to { opacity: 1; transform: translateY(-50%) translateX(0); }
  }
          .profile-menu-item { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; padding: 10px 12px; border: none; background: transparent; cursor: pointer; text-decoration: none; color: var(--text-primary); font-size: 14px; font-weight: 500; border-radius: 8px; transition: background-color 0.2s ease; }
          .profile-menu-item:hover { background: var(--bg-tertiary); }
          .profile-menu-item.logout { color: var(--state-danger-primary); }
          .profile-menu-item.logout:hover { color: var(--state-danger-secondary); background: var(--state-danger-bg); }

          /* Dark mode for mobile menu buttons */
          [data-theme='dark'] .profile-menu { background: #2f2f2f; border-color: var(--border-light); }
          [data-theme='dark'] .profile-menu-item:hover { background: var(--bg-tertiary); }
          [data-theme='dark'] .profile-menu-item.logout { color: var(--state-danger-primary); }
          [data-theme='dark'] .profile-menu-item.logout:hover { color: var(--state-danger-secondary); background: var(--state-danger-bg); }
          [data-theme='dark'] .mobile-action-btn.btn-login { background: var(--bg-tertiary); color: var(--text-on-primary); border-color: var(--border-default); }
          [data-theme='dark'] .mobile-action-btn.btn-register { background: var(--primary-purple-vibrant); color: var(--text-on-primary); border: none; }
          [data-theme='dark'] .mobile-menu-card { background: var(--bg-secondary); }
        }
        .btn-language {
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--text-primary);
          padding: 0.5rem;
          border-radius: 8px;
        }
        .btn-language:hover {
          background: rgba(0,0,0,0.04);
        }
      `}</style>
    </>
  );
}