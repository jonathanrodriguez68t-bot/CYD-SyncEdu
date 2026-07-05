'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function Sidebar({ user, currentView, onViewChange, isCollapsed, onToggleCollapse }) {
  const router = useRouter();
  
  if (!user) return null;

  const navByRole = {
    student: [
      ["home", "IN", "Inicio"],
      ["records", "EX", "Expedientes"],
      ["grades", "NT", "Notas"],
      ["courses", "CR", "Cursos"],
      ["calendar", "AC", "Actividades"],
      ["notices", "AV", "Avisos"]
    ],
    teacher: [
      ["home", "IN", "Inicio"],
      ["groups", "GR", "Grupos"],
      ["gradebook", "NT", "Calificar"],
      ["calendar", "AC", "Calendario"],
      ["messages", "MS", "Mensajes"],
      ["reports", "RP", "Reportes"]
    ],
    admin: [
      ["home", "IN", "Inicio"],
      ["students", "AL", "Alumnos"],
      ["teachers", "PR", "Profesores"],
      ["requests", "SL", "Solicitudes"],
      ["calendar", "AC", "Calendario"],
      ["reports", "RP", "Reportes"]
    ]
  };

  const navItems = navByRole[user.role] || [];
  
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/');
  };

  const roleLabel = user.role === 'student' ? 'Portal Estudiante' : user.role === 'teacher' ? 'Portal Profesor' : 'Portal Admin';

  return (
    <aside className="sidebar">
      <button className="brand" onClick={onToggleCollapse} type="button" aria-label="Mostrar u ocultar menu">
        <div className="mark">CYD</div>
        {!isCollapsed && (
          <div>
            <strong>SyncEdu</strong>
            <span id="portal-label">{roleLabel}</span>
          </div>
        )}
      </button>

      <nav className="nav" aria-label="Navegacion principal">
        {navItems.map(([view, icon, label]) => (
          <button
            key={view}
            className={view === currentView ? "active" : ""}
            onClick={() => onViewChange(view)}
          >
            <span className="icon">{icon}</span>
            {!isCollapsed && <span>{label}</span>}
          </button>
        ))}
      </nav>

      {!isCollapsed && (
        <div className="support">
          <strong>Soporte IA</strong>
          <small id="support-copy">
            {user.role === 'student'
              ? 'SyncIA puede resumir tus notas, avisos y tareas pendientes.'
              : user.role === 'teacher'
              ? 'SyncIA puede ayudarte a preparar avisos, revisar entregas y detectar pendientes.'
              : 'SyncIA puede resumir solicitudes, expedientes y alertas institucionales.'}
          </small>
          <button onClick={() => onViewChange('chat-ia')}>Consultar SyncIA</button>
        </div>
      )}
    </aside>
  );
}
