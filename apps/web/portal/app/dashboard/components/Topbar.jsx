'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function Topbar({ user }) {
  const router = useRouter();

  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/');
  };

  const roleLabel = user.role === 'student' ? 'Portal Estudiante' : user.role === 'teacher' ? 'Portal Profesor' : 'Portal Admin';

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <div className="mark small">CYD</div>
        <div>
          <strong>SyncEdu</strong>
          <span id="topbar-portal-label">{roleLabel}</span>
        </div>
      </div>
      
      <div className="search">
        <span className="icon">SR</span>
        <input id="search-input" aria-label="Buscar" placeholder="Buscar en SyncEdu..." />
      </div>
      
      <div className="profile">
        <div>
          <strong id="profile-name">{user.name}</strong>
          <span id="profile-role">{user.label}</span>
        </div>
        <div className="avatar" id="profile-avatar">{user.avatar}</div>
        <button className="secondary compact" onClick={handleLogout}>Salir</button>
      </div>
    </header>
  );
}
