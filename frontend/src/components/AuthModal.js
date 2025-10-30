import React from 'react';
import Login from '../pages/Login';
import Register from '../pages/Register';

export default function AuthModal({ open, mode, onClose, onAuthSuccess, openAuth }) {
  if (!open) return null;

  const handleSwitch = (nextMode) => {
    if (openAuth) openAuth(nextMode);
  };

  const content = mode === 'register'
    ? <Register onSuccess={() => onAuthSuccess && onAuthSuccess('register')} onSwitchMode={() => handleSwitch('login')} />
    : <Login onSuccess={() => onAuthSuccess && onAuthSuccess('login')} onSwitchMode={() => handleSwitch('register')} />;

  return (
    <div className="auth-modal-overlay" role="dialog" aria-modal="true">
      <div className="auth-card">
        <button className="close-btn" onClick={onClose} aria-label="Cerrar">×</button>
        <div className="auth-card-content">
          {content}
        </div>
      </div>

      <style>{`
        .auth-modal-overlay{ position:fixed; inset:0; display:flex; align-items:center; justify-content:center; z-index:2000; background: var(--modal-overlay-bg, rgba(7,10,25,0.45)); padding:20px; }
        .auth-card { width: 392px; background: var(--bg-primary); border-radius: 14px; padding: 22px; box-shadow: var(--shadow-heavy); position: relative; transform: translateY(0); animation: popIn 220ms ease; }
        @keyframes popIn { from { transform: translateY(8px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        .close-btn { position:absolute; right:10px; top:10px; border:none; background:transparent; font-size:14px; cursor:pointer; color:var(--text-tertiary); width:28px; height:28px; display:inline-flex; align-items:center; justify-content:center; border-radius:6px; }
        .close-btn:hover { background: var(--bg-tertiary); }

        /* Google button */
        .google-btn { display:flex; align-items:center; gap:12px; padding:10px 14px; border-radius:999px; background: linear-gradient(90deg, var(--accent-blue), var(--accent-blue-light)); color:white; border:none; width:100%; font-weight:700; cursor:pointer; box-shadow: var(--shadow-primary); }
        .google-icon { width:26px; height:26px; border-radius:99px; background:white; display:flex; align-items:center; justify-content:center; padding:2px; }
        .google-icon img { width:18px; height:18px; display:block; }

        .or-sep { text-align:center; margin:12px 0; color:var(--text-muted); font-size:13px; }

        .input-wrap { display:flex; align-items:center; gap:10px; border:1px solid var(--input-border); padding:10px; border-radius:10px; background:var(--input-bg); position:relative; }
        .input-wrap + .input-wrap { margin-top:10px; }
        .input-icon { color:var(--text-muted); display:flex; align-items:center; }
        .auth-input { border:none; outline:none; font-size:14px; width:100%; background:transparent; padding-right:36px; color: var(--text-primary); }
        .input-wrap:focus-within { border-color: var(--input-focus-border); box-shadow: var(--input-focus-shadow); background: var(--input-focus-bg); }

  /* Eye toggle button inside input-wrap */
  .input-wrap > button[type="button"] { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: transparent; border: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; width:28px; height:28px; }
  .input-wrap > button[type="button"] svg { color: var(--text-tertiary); }

  /* medium-light gray button for auth actions */
  .submit-btn { margin-top:18px; width:100%; padding:12px 14px; border-radius:12px; border:1px solid var(--border-default); background: var(--bg-tertiary); color:var(--text-secondary); font-weight:800; cursor:pointer; box-shadow: var(--shadow-light); font-size:15px; transition: all 0.2s ease; }
  /* hover: medium-light gray (force with important to override other styles) */
  .submit-btn:hover:not(:disabled) { background: var(--bg-accent) !important; color: var(--text-primary) !important; transform: translateY(-1px); }

  [data-theme='dark'] .submit-btn { color: var(--text-primary); }

        .auth-footer { text-align:center; margin-top:12px; font-size:13px; color:var(--text-tertiary); }
  /* medium-light gray link */
  .switch-link { background:transparent !important; border:none !important; color:var(--text-tertiary) !important; font-weight:800; cursor:pointer; margin-top:14px; display:inline-block; font-size:14px; padding:6px 10px; border-radius:8px; }
  /* Hover: show medium-light gray pill */
  .switch-link:hover { background: var(--bg-tertiary) !important; color:var(--text-primary) !important; text-decoration:none; }

      `}</style>
    </div>
  );
}
