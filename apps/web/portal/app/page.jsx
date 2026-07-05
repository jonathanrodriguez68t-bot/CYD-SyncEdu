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
            placeholder="Usuario (estudiante, profesor, admin)"
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
    </section>
  );
}
