'use client';

import React, { useState, useEffect } from 'react';
import { fetchGradesByStudent, getLowestGradeSubject } from '../../../lib/services/gradesService';
import { fetchReminders } from '../../../lib/services/remindersService';

export default function StudentDashboardPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [studentGrades, setStudentGrades] = useState([]);
  const [lowestSubject, setLowestSubject] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);

      const loadStudentData = async () => {
        try {
          const grades = await fetchGradesByStudent(user.username);
          setStudentGrades(grades);

          const analysis = await getLowestGradeSubject(user.username);
          setLowestSubject(analysis);

          const activeReminders = await fetchReminders();
          setReminders(activeReminders);
        } catch (err) {
          console.error("Error cargando informacion del estudiante:", err);
        } finally {
          setLoading(false);
        }
      };
      loadStudentData();
    }
  }, []);

  const calculateAverage = () => {
    if (studentGrades.length === 0) return '0.0';
    const sum = studentGrades.reduce((acc, g) => acc + g.score, 0);
    return (sum / studentGrades.length).toFixed(1);
  };

  const handleAskAI = (promptText) => {
    window.dispatchEvent(new CustomEvent('trigger-chat-prompt', { detail: promptText }));
  };

  if (loading) {
    return <div style={{ color: '#fff', padding: '40px', textAlign: 'center' }}>Cargando expediente escolar...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Student Expediente Header Card */}
      <section className="hero" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className="badge" style={{ background: '#1d8fff', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '12px' }}>
              EXPEDIENTE: {currentUser?.expediente || 'EXP-2026-001'}
            </span>
            <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#98a2b3', padding: '4px 10px', borderRadius: '4px', fontSize: '12px' }}>
              CARNET: {currentUser?.carnet || 'estudiante'}
            </span>
            <span className="badge" style={{ background: '#12b76a', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '12px' }}>
              ESTADO: {currentUser?.status || 'Activo'}
            </span>
          </div>
          <h1>Bienvenida de nuevo, {currentUser?.shortName || 'Maria'}</h1>
          <p className="lead" style={{ margin: 0 }}>Consulta tu historial de notas, analiza tus debilidades académicas y revisa las tareas asignadas por tus docentes.</p>
        </div>
        <div className="actions" style={{ display: 'flex', gap: '10px' }}>
          <button className="secondary" onClick={() => handleAskAI('¿Cuáles son mis próximos recordatorios?')}>Avisos Recientes</button>
          <button className="primary" onClick={() => handleAskAI('¿Qué materia debo mejorar?')}>Analizar con SyncIA</button>
        </div>
      </section>

      <div className="layout">
        <div>
          {/* KPIs */}
          <section className="kpis">
            <article className="card kpi">
              <div className="label">Promedio General<span className="icon">OK</span></div>
              <strong>{calculateAverage()}</strong>
              <span className="delta">+0.3 vs periodo anterior</span>
            </article>
            <article className="card kpi">
              <div className="label">Asistencia escolar<span className="icon">OK</span></div>
              <strong>96%</strong>
              <span className="delta">2 faltas justificadas</span>
            </article>
            <article className="card kpi">
              <div className="label">Recordatorios en Muro<span className="icon">!</span></div>
              <strong>{reminders.length}</strong>
              <span className="delta warn">Publicados por docentes</span>
            </article>
          </section>

          {/* Grades Table */}
          <section className="card section" style={{ marginBottom: '24px' }}>
            <div className="section-head">
              <h2>Libro de Calificaciones (Notas Recientes)</h2>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Materia</th>
                  <th>Actividad Evaluada</th>
                  <th>Calificacion</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {studentGrades.map((g) => (
                  <tr key={g.id}>
                    <td>
                      <span className="subject">
                        <span className="chip-icon" style={{ background: '#1d8fff' }}>
                          {g.subject[0].toUpperCase()}
                        </span>
                        {g.subject}
                      </span>
                    </td>
                    <td>{g.activity}</td>
                    <td><strong>{g.score.toFixed(1)}</strong></td>
                    <td>
                      <span className={`badge ${g.score >= 6.0 ? 'success' : 'danger'}`} style={{
                        background: g.score >= 6.0 ? 'rgba(18, 183, 106, 0.15)' : 'rgba(240, 68, 56, 0.15)',
                        color: g.score >= 6.0 ? '#12b76a' : '#f04456',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        {g.score >= 6.0 ? 'Aprobado' : 'Reprobado'}
                      </span>
                    </td>
                  </tr>
                ))}
                {studentGrades.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: '#98a2b3', padding: '20px' }}>
                      No tienes calificaciones registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

          {/* Dynamic AI Analytics Insight */}
          <section className="card section insight" style={{ marginBottom: '24px' }}>
            <div>
              <h2>Recomendacion Inteligente de SyncIA</h2>
              {lowestSubject ? (
                <p>
                  Hemos detectado que tu materia con el promedio más bajo es <strong>{lowestSubject.subject}</strong> con un promedio de <strong>{lowestSubject.average}</strong>. Te sugerimos repasar esta materia y solicitar apoyo a tu profesora para mejorar tus notas en el próximo periodo.
                </p>
              ) : (
                <p>Mantienes un buen rendimiento escolar. Sigue así y recuerda consultar regularmente a tu asistente SyncIA.</p>
              )}
              <button className="primary" onClick={() => handleAskAI('¿Qué materia debo mejorar?')}>Pedir plan de mejora a IA</button>
            </div>
            <div className="brain">IA</div>
          </section>
        </div>

        {/* Reminders Wall Sidebar */}
        <aside className="side">
          <section className="card section" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="section-head">
              <h2>Muro de Avisos del Profesor</h2>
              <span className="badge" style={{ background: 'rgba(29, 143, 255, 0.15)', color: '#1d8fff' }}>Nuevo</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {reminders.map((rem) => (
                <article key={rem.id} style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ margin: 0, fontSize: '15px', color: '#1d8fff' }}>{rem.title}</h4>
                    <span className="badge" style={{ fontSize: '10px', background: 'rgba(255,255,255,0.05)', color: '#98a2b3', whiteSpace: 'nowrap' }}>
                      {rem.date}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: '#cfd4dc', lineHeight: '1.4' }}>{rem.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#667085', marginTop: '4px' }}>
                    <span>Clase: <strong>{rem.subject}</strong></span>
                    <span>De: {rem.createdBy}</span>
                  </div>
                </article>
              ))}
              {reminders.length === 0 && (
                <p className="muted" style={{ textAlign: 'center', padding: '30px 0' }}>No hay anuncios publicados por tus profesores en este momento.</p>
              )}
            </div>
          </section>

          <section className="notice" style={{ padding: '16px', background: 'linear-gradient(135deg, rgba(29,143,255,0.1), rgba(29,143,255,0.02))', border: '1px solid rgba(29,143,255,0.15)', borderRadius: '12px' }}>
            <strong style={{ display: 'block', marginBottom: '4px', color: '#1d8fff' }}>Feria de Ciencias 2026</strong>
            <small style={{ color: '#98a2b3' }}>Prepara tus prototipos y revisa el calendario del evento oficial.</small>
          </section>
        </aside>
      </div>
    </div>
  );
}
