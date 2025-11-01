import React, { useState } from 'react';
import api from '../services/api';
import cfg from '../services/config';
import { saveToken, saveUsuario } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login({ onSuccess, onSwitchMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [show, setShow] = useState(false);
  const nav = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    setErr('');
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setErr('Por favor ingresa un correo válido');
    if (!password || password.length < 6) return setErr('La contraseña debe tener al menos 6 caracteres');

    try {
      const res = await api.post(cfg.paths.login, { email, password });
      const data = res.data || {};
      const token = data[cfg.tokenField] || data.access_token || data.access;
      const usuario = data[cfg.usuarioField] || data.usuario || null;

      if (!token) {
        setErr('No se encontró access_token en la respuesta');
        return;
      }

      saveToken(token);
      try { const apiInstance = require('../services/api').default; apiInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`; } catch {}
      if (usuario) saveUsuario(usuario);
      if (onSuccess) { try { onSuccess('login'); } catch (e) { onSuccess(); } }
      else nav('/dashboard');
    } catch (error) {
      console.error(error);
      setErr(error.response?.data?.error || error.response?.data || error.message);
    }
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, Arial' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>Iniciar Sesión</h2>
      </div>

      <button className="google-btn" type="button">
        <span className="google-icon"><img src="/static/IMG/google.svg" alt="google" /></span>
        <span>Continuar con Google</span>
      </button>

      <div className="or-sep">o con tu correo</div>

      {err && <div style={{ color: 'crimson', fontSize: 13, marginBottom: 8 }}>{err}</div>}

      <form onSubmit={handle}>
        <div className="input-wrap" style={{ marginBottom: 10 }}>
          <span className="input-icon"><Mail size={18} /></span>
          <input className="auth-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo electrónico" />
        </div>

        <div className="input-wrap">
          <span className="input-icon"><Lock size={18} /></span>
          <input className="auth-input" type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
          <button
            type="button"
            onClick={() => setShow(!show)}
            aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <button type="submit" className="submit-btn">Iniciar Sesión</button>
      </form>

      <div className="auth-footer">
        <span>¿No tienes cuenta? </span>
        <button className="switch-link" onClick={() => onSwitchMode && onSwitchMode()}>Regístrate aquí</button>
      </div>
    </div>
  );
}
