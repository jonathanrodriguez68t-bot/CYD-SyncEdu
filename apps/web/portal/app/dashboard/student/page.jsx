'use client';

import React, { useState, useEffect } from 'react';

export default function StudentDashboardPage() {
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
          <h1>Bienvenida de nuevo, {currentUser?.shortName || 'Maria'}</h1>
          <p className="lead">Este es tu resumen academico de 6to grado. Hay una actividad proxima y una materia que conviene repasar esta semana.</p>
        </div>
        <div className="actions">
          <button className="secondary">Ver calendario</button>
          <button className="primary">Consultar SyncIA</button>
        </div>
      </section>

      <div className="layout">
        <div>
          {/* KPIs */}
          <section className="kpis">
            <article className="card kpi">
              <div className="label">Promedio general<span className="icon">OK</span></div>
              <strong>8.6</strong>
              <span className="delta">+0.3 vs mes pasado</span>
            </article>
            <article className="card kpi">
              <div className="label">Asistencia<span className="icon">OK</span></div>
              <strong>96%</strong>
              <span className="delta">2 faltas justificadas</span>
            </article>
            <article className="card kpi">
              <div className="label">Pendientes<span className="icon">!</span></div>
              <strong>2</strong>
              <span className="delta warn">Requiere atencion</span>
            </article>
          </section>

          {/* Grades Table */}
          <section className="card section">
            <div className="section-head">
              <h2>Notas recientes</h2>
              <button className="link">Ver todas</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Materia</th>
                  <th>Actividad</th>
                  <th>Nota</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="subject"><span className="chip-icon">M</span>Matematicas</span></td>
                  <td>Examen Unidad 2</td>
                  <td><strong>9.0</strong></td>
                  <td><span className="badge">Aprobado</span></td>
                </tr>
                <tr>
                  <td><span className="subject"><span className="chip-icon">C</span>Ciencias</span></td>
                  <td>Laboratorio de quimica</td>
                  <td><strong>8.5</strong></td>
                  <td><span className="badge">Aprobado</span></td>
                </tr>
                <tr>
                  <td><span className="subject"><span className="chip-icon">L</span>Lenguaje</span></td>
                  <td>Ensayo literario</td>
                  <td><strong>8.0</strong></td>
                  <td><span className="badge">Aprobado</span></td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Insight Panel */}
          <section className="card section insight">
            <div>
              <h2>Analisis de SyncIA</h2>
              <p>Maria Fernanda mantiene buen rendimiento. Se recomienda revisar Matematicas dos veces por semana porque el siguiente examen concentra el 30% del periodo.</p>
              <button className="primary">Ver reporte completo de IA</button>
            </div>
            <div className="brain">IA</div>
          </section>
        </div>

        {/* Sidebar widgets inside layout */}
        <aside className="side">
          <section className="card section">
            <div className="section-head">
              <h2>Proximas actividades</h2>
            </div>
            <div className="event">
              <div className="date">07<span>JUL</span></div>
              <div><strong>Exposicion de ciencias</strong><small>Ciencias - Aula 4, 8:00 AM.</small></div>
            </div>
            <div className="event">
              <div className="date">08<span>JUL</span></div>
              <div><strong>Entrega de cartulina</strong><small>Artes visuales - Llevar materiales y boceto.</small></div>
            </div>
          </section>
          <section className="notice">
            <strong>Feria de ciencias 2026</strong>
            <small>Revise fechas, criterios y recordatorios oficiales.</small>
          </section>
        </aside>
      </div>
    </div>
  );
}
