import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage';
import Profile from './pages/Profile';
import Concentracion from './pages/Concentracion';
import PrivateRoute from './components/PrivateRoute'; 
import PublicRoute from './components/PublicRoute';
import AuthModal from './components/AuthModal';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { logout as doLogout, getUsuario } from './services/auth';


export default function App(){
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  // Initialize theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [usuario, setUsuario] = useState(getUsuario());
  const nav = useNavigate();
  const location = useLocation();

  const openAuth = (mode = 'login') => { setAuthMode(mode); setAuthOpen(true); };
  const closeAuth = () => setAuthOpen(false);

  // Effect to apply theme class to body and save to localStorage
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };



  const handleLogout = () => {
    // central logout handler: clear local user state and perform service logout
    setAuthOpen(false);
    try {
      doLogout();
    } catch (e) {
      // fallback to full redirect if service logout fails
      window.location.href = '/';
      return;
    }
    setUsuario(null);
    try { nav('/', { replace: true }); } catch (e) { /* ignore */ }
  };

  const onAuthSuccess = (fromMode) => {
    if (fromMode === 'register') {
      setAuthMode('login');
      setAuthOpen(true);
      return;
    }
    setAuthOpen(false);
    try { nav('/', { replace: true }); } catch (e) { /* ignore */ }
    // Refresh local user state after successful auth
    try { setUsuario(getUsuario()); } catch (e) { /* ignore */ }
  };

  return (
    <>
  <div className="app-debug-banner">APP RENDER OK</div>
  <Navbar user={usuario} onAuthClick={openAuth} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />
  <AuthModal open={authOpen} mode={authMode} onClose={closeAuth} onAuthSuccess={onAuthSuccess} openAuth={openAuth} />

      <Routes>
        <Route path="/login" element={<div className="container"><PublicRoute><Navigate to="/" replace /></PublicRoute></div>} />
        <Route path="/register" element={<div className="container"><PublicRoute><Navigate to="/" replace /></PublicRoute></div>} />
  <Route path="/dashboard" element={<div className="container"><PrivateRoute><Dashboard/></PrivateRoute></div>} />
  <Route path="/perfil" element={<div className="container"><PrivateRoute><Profile/></PrivateRoute></div>} />
  <Route path="/concentracion" element={<div className="container"><PrivateRoute><Concentracion/></PrivateRoute></div>} />
  <Route path="/config" element={<div className="container"><PrivateRoute><Profile defaultTab="settings"/></PrivateRoute></div>} />
  <Route 
    path="/" 
    element={
      usuario 
        ? <Navigate to="/dashboard" replace /> 
        : <div className="container container-full"><HomePage user={usuario} onAuthClick={openAuth} /></div>
    } />
      </Routes>
      <Footer />
    </>
  );
}
