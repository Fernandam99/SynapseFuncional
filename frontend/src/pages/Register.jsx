import React, { useState } from 'react';
import api from '../services/api';
import cfg from '../services/config';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export default function Register({ onSuccess, onSwitchMode }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [err, setErr] = useState('');
  const [touched, setTouched] = useState({});
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  // derived validation state
  const validName = name.trim().length >= 2;
  const validEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const validPassword = password.length >= 6;
  const passwordsMatch = password === password2 && password2.length > 0;
  const validations = [validName, validEmail, validPassword, passwordsMatch];
  const progress = Math.round((validations.filter(Boolean).length / validations.length) * 100);

  const handle = async (e) => {
    e.preventDefault();
    setErr('');
    if (!name || name.length < 2) return setErr('El nombre debe tener al menos 2 caracteres');
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setErr('Por favor ingresa un correo válido');
    if (!password || password.length < 6) return setErr('La contraseña debe tener al menos 6 caracteres');
    if (password !== password2) return setErr('Las contraseñas no coinciden');

    try {
      await api.post(cfg.paths.register, { name, email, password });
      if (onSuccess) onSuccess('register');
    } catch (error) {
      console.error(error);
      setErr(error.response?.data?.error || error.response?.data || error.message);
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>crear cuenta</h2>
      </div>

      <button className="google-btn" type="button" style={{ marginBottom: 12 }}>
        <span className="google-icon"><img src="/static/IMG/google.svg" alt="google" /></span>
        <span>Continuar con Google</span>
      </button>

      {err && <div style={{ color: 'crimson', fontSize: 13, marginBottom: 8 }}>{err}</div>}

      <div style={{ marginBottom: 12 }}>
        <div style={{ height: 8, background: '#eef2ff', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg,#7c3aed,#667eea)', transition: 'width 220ms ease' }} />
        </div>
        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 6 }}>Progreso: {progress}%</div>
      </div>

      <form onSubmit={handle}>
        <div className="input-wrap" onFocus={() => setTouched(t => ({ ...t, name: true }))}>
          <span className="input-icon"><User size={18} /></span>
          <input className="auth-input" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" />
        </div>
        {!validName && touched.name && <div style={{ color: '#f43f5e', fontSize: 12, marginTop: 6 }}>El nombre debe tener al menos 2 caracteres</div>}

        <div className="input-wrap" onFocus={() => setTouched(t => ({ ...t, email: true }))}>
          <span className="input-icon"><Mail size={18} /></span>
          <input className="auth-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo electrónico" />
        </div>
        {!validEmail && touched.email && <div style={{ color: '#f43f5e', fontSize: 12, marginTop: 6 }}>Ingresa un correo válido</div>}

        <div className="input-wrap" onFocus={() => setTouched(t => ({ ...t, password: true }))}>
          <span className="input-icon"><Lock size={18} /></span>
          <input className="auth-input" type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {!validPassword && touched.password && <div style={{ color: '#f43f5e', fontSize: 12, marginTop: 6 }}>La contraseña debe tener al menos 6 caracteres</div>}

        <div className="input-wrap" onFocus={() => setTouched(t => ({ ...t, password2: true }))}>
          <span className="input-icon"><Lock size={18} /></span>
          <input className="auth-input" type={show2 ? 'text' : 'password'} value={password2} onChange={(e) => setPassword2(e.target.value)} placeholder="Confirmar contraseña" />
          <button
            type="button"
            onClick={() => setShow2(s => !s)}
            aria-label={show2 ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            {show2 ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {!passwordsMatch && touched.password2 && <div style={{ color: '#f43f5e', fontSize: 12, marginTop: 6 }}>Las contraseñas no coinciden</div>}

        <button type="submit" className="submit-btn" disabled={!(validName && validEmail && validPassword && passwordsMatch)} style={{ opacity: (validName && validEmail && validPassword && passwordsMatch) ? 1 : 0.6, cursor: (validName && validEmail && validPassword && passwordsMatch) ? 'pointer' : 'not-allowed' }}>Registrarse</button>
      </form>

      <div className="auth-footer">
        <span>¿Ya tienes cuenta? </span>
        <button className="switch-link" onClick={() => onSwitchMode && onSwitchMode()}>Inicia sesión</button>
      </div>
    </div>
  );
}
