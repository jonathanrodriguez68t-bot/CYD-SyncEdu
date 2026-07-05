'use client';

import React, { useState, useEffect } from 'react';

export default function AdminDashboardPage() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <section className="hero">
        <div>
          <h1>Panel administrativo, {currentUser?.shortName || 'Roberto'}</h1>
          <p className="lead">Supervisa expedientes, docentes, solicitudes y operacion academica general.</p>
        </div>
        <div className="actions">
          <button className="secondary">Ver reportes</button>
          <button className="primary">Nuevo alumno</button>
        </div>
      </section>

      {/* Admin KPIs */}
      <section className="kpis">
        <article className="card kpi">
          <div className="label">Expedientes<span className="icon">!</span></div>
          <strong>428</strong>
          <span className="delta warn">3 requieren validacion</span>
        </article>
        <article className="card kpi">
          <div className="label">Asistencia global<span className="icon">OK</span></div>
          <strong>97%</strong>
          <span className="delta">Estable esta semana</span>
        </article>
        <article className="card kpi">
          <div className="label">Solicitudes<span className="icon">!</span></div>
          <strong>9</strong>
          <span className="delta warn">Pendientes de respuesta</span>
        </article>
      </section>

      <div className="grid-2">
        {/* Requests Table */}
        <section className="card section">
          <div className="section-head">
            <h2>Solicitudes</h2>
          </div>
          <table>
            <thead>
              <tr>
                <th>Solicitud</th>
                <th>Estado</th>
                <th>Detalle</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cambio de encargado</td>
                <td><span className="badge">Pendiente</span></td>
                <td>Revision administrativa</td>
                <td><button className="secondary compact">Gestionar</button></td>
              </tr>
              <tr>
                <td>Justificacion de ausencia</td>
                <td><span className="badge">Aprobado</span></td>
                <td>Registrado en asistencia</td>
                <td><button className="secondary compact">Gestionar</button></td>
              </tr>
              <tr>
                <td>Actualizacion de telefono</td>
                <td><span className="badge">Pendiente</span></td>
                <td>Falta confirmacion</td>
                <td><button className="secondary compact">Gestionar</button></td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Admin Reports */}
        <section className="card section">
          <div className="section-head">
            <h2>Reportes administrativos</h2>
          </div>
          <div className="grid-2">
            <article className="mini-panel">
              <h2>Expedientes activos</h2>
              <p className="muted">428 registros actualizados.</p>
            </article>
            <article className="mini-panel">
              <h2>Solicitudes abiertas</h2>
              <p className="muted">9 requieren respuesta administrativa.</p>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}
