import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

// Componentes
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

// Páginas
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Concentracion from './pages/Concentracion';
import Tareas from './pages/Tareas';

// Servicios (para autenticación real, opcional)
import { getUsuario, logout as doLogout } from './services/auth';

export default function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [usuario, setUsuario] = useState(getUsuario()); // Carga desde localStorage si existe
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  const navigate = useNavigate();
  const location = useLocation();

  // Aplicar tema al body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const closeAuth = () => {
    setAuthOpen(false);
  };

  const handleLogout = () => {
    doLogout();
    setUsuario(null);
    navigate('/'); // Redirigir al inicio
  };

  const handleAuthSuccess = (user) => {
    setUsuario(user);
    closeAuth();
    if (location.pathname === '/login' || location.pathname === '/register') {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar
        user={usuario}
        onAuthClick={openAuth}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="flex-grow">
        <Routes>
          {/* Rutas públicas */}
          <Route
            path="/"
            element={<HomePage user={usuario} onAuthClick={openAuth} />}
          />
          <Route
            path="/login"
            element={
              <PublicRoute user={usuario}>
                <Login onSuccess={handleAuthSuccess} onSwitchMode={() => setAuthMode('register')} />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute user={usuario}>
                <Register onSuccess={handleAuthSuccess} onSwitchMode={() => setAuthMode('login')} />
              </PublicRoute>
            }
          />

          {/* Rutas protegidas */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute user={usuario}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <PrivateRoute user={usuario}>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/concentracion"
            element={
              <PrivateRoute user={usuario}>
                <Concentracion />
              </PrivateRoute>
            }
          />
          <Route
            path="/tareas"
            element={
              <PrivateRoute user={usuario}>
                <Tareas />
              </PrivateRoute>
            }
          />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Modal de autenticación (opcional si prefieres usar rutas separadas) */}
      <AuthModal
        open={authOpen}
        mode={authMode}
        onClose={closeAuth}
        onAuthSuccess={handleAuthSuccess}
        openAuth={openAuth}
      />
    </div>
  );
}