'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { authenticateUser } from '../lib/services/usersService';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLeaving, setIsLeaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const user = await authenticateUser(username, password);
    if (user) {
      setIsLeaving(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      setTimeout(() => {
        router.push(`/dashboard/${user.role}`);
      }, 360);
      return;
    }

    setError('Usuario o contraseña incorrectos.');
  };

  return (
    <section className={`login-screen ${isLeaving ? 'leaving' : ''}`} id="login-screen">
      <header style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px 24px',
        background: 'rgba(15, 17, 22, 0.4)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        zIndex: 10,
        boxSizing: 'border-box'
      }}>
        <span style={{
          fontSize: '11px',
          color: 'var(--muted)',
          letterSpacing: '0.15em',
          fontWeight: 700,
          textTransform: 'uppercase',
          textAlign: 'center',
          lineHeight: '1.5'
        }}>
          Creado por <strong style={{ color: 'var(--ink)' }}>CYD</strong>
        </span>
      </header>

      <div className="login-card">
        <div className="login-emblem logo-image">
          <img src="/assets/pnglogo.png" alt="Logo CYD SyncEdu" />
        </div>
        <h1>Bienvenido a SyncEdu</h1>
        <p>Ingresa con tu cuenta institucional</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Usuario"
            required
            autoComplete="username"
          />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            autoComplete="current-password"
          />
          {error && <p className="form-error">{error}</p>}
          <button className="primary" type="submit">Iniciar sesión</button>
        </form>
      </div>

      <footer style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px 24px',
        background: 'rgba(15, 17, 22, 0.4)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        zIndex: 10,
        boxSizing: 'border-box',
        gap: '12px'
      }}>
        <small style={{
          fontSize: '9px',
          color: 'var(--muted)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fontWeight: 700
        }}>
          Desarrollado con la tecnología de
        </small>
        
        <div style={{
          fontSize: '11px',
          color: 'var(--ink)',
          letterSpacing: '0.08em',
          fontWeight: 600,
          textTransform: 'uppercase',
          textAlign: 'center',
          marginTop: '4px',
          opacity: 0.8
        }}>
          ElevenLabs — Cursor — Codex — n8n
        </div>

        {/* Thin white line separator below logos */}
        <div style={{
          width: '80px',
          height: '2px',
          background: 'rgba(255, 255, 255, 0.35)',
          borderRadius: '999px',
          marginTop: '6px'
        }} />
      </footer>
    </section>
  );
}
