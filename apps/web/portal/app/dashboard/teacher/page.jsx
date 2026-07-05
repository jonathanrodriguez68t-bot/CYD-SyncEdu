'use client';

import React, { useState, useEffect } from 'react';
import { fetchSubjectsByTeacher } from '../../../lib/services/subjectsService';
import { fetchAllGrades, createGradeRecord } from '../../../lib/services/gradesService';
import { fetchReminders, createReminder } from '../../../lib/services/remindersService';

export default function TeacherDashboardPage() {
  const [currentUser, setCurrentUser] = useState(null);
  
  // State for managed subjects
  const [managedSubjects, setManagedSubjects] = useState([]);

  // State for student grades
  const [grades, setGrades] = useState([]);

  // Filter state
  const [selectedFilterSubject, setSelectedFilterSubject] = useState('Todos');

  // Form states for adding grades
  const [newStudentName, setNewStudentName] = useState('');
  const [newSubject, setNewSubject] = useState('Ciencias');
  const [newActivity, setNewActivity] = useState('');
  const [newScore, setNewScore] = useState('');
  const [message, setMessage] = useState(null);

  // Reminders/Announcements states
  const [reminders, setReminders] = useState([]);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDesc, setReminderDesc] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderSubject, setReminderSubject] = useState('Ciencias');
  const [reminderMessage, setReminderMessage] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      
      const loadInitialData = async () => {
        const teacherSubjects = await fetchSubjectsByTeacher(user.username);
        setManagedSubjects(teacherSubjects);
        if (teacherSubjects.length > 0) {
          setNewSubject(teacherSubjects[0].name);
          setReminderSubject(teacherSubjects[0].name);
        }
        
        const allGrades = await fetchAllGrades(selectedFilterSubject);
        setGrades(allGrades);

        const allReminders = await fetchReminders();
        setReminders(allReminders);
      };
      loadInitialData();
    }
  }, [selectedFilterSubject]);

  const handleAddGrade = async (e) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newActivity.trim() || !newScore) {
      setMessage({ type: 'error', text: 'Por favor, completa todos los campos.' });
      return;
    }

    const scoreNum = parseFloat(newScore);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10) {
      setMessage({ type: 'error', text: 'La calificacion debe ser un numero entre 0 y 10.' });
      return;
    }

    try {
      const newRecord = await createGradeRecord({
        student: newStudentName.trim(),
        subject: newSubject,
        activity: newActivity.trim(),
        score: scoreNum
      }, currentUser?.username || 'profesor');

      setGrades((prev) => [newRecord, ...prev]);
      setNewStudentName('');
      setNewActivity('');
      setNewScore('');
      setMessage({ type: 'success', text: 'Calificacion agregada correctamente.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }

    setTimeout(() => setMessage(null), 5000);
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    if (!reminderTitle.trim() || !reminderDesc.trim() || !reminderDate) {
      setReminderMessage({ type: 'error', text: 'Por favor, completa todos los campos del recordatorio.' });
      return;
    }

    try {
      const newRem = await createReminder({
        title: reminderTitle.trim(),
        description: reminderDesc.trim(),
        date: reminderDate,
        subject: reminderSubject,
        createdBy: currentUser?.name || 'Karen Rivas'
      });

      setReminders((prev) => [newRem, ...prev]);
      setReminderTitle('');
      setReminderDesc('');
      setReminderDate('');
      setReminderMessage({ type: 'success', text: 'Recordatorio publicado exitosamente para tus estudiantes.' });
    } catch (err) {
      setReminderMessage({ type: 'error', text: err.message });
    }

    setTimeout(() => setReminderMessage(null), 5000);
  };

  const filteredGrades = selectedFilterSubject === 'Todos'
    ? grades
    : grades.filter(g => g.subject === selectedFilterSubject);

  return (
    <div style={{ padding: '24px' }}>
      <section className="hero">
        <div>
          <h1>Hola, profesora {currentUser?.shortName || 'Karen'}</h1>
          <p className="lead">Gestiona tus materias a cargo, consulta y actualiza las calificaciones de tus alumnos de forma interactiva.</p>
        </div>
      </section>

      {/* Teacher KPIs */}
      <section className="kpis" style={{ marginBottom: '24px' }}>
        <article className="card kpi">
          <div className="label">Materias a cargo<span className="icon">OK</span></div>
          <strong>{managedSubjects.length}</strong>
          <span className="delta">Asignadas para el periodo</span>
        </article>
        <article className="card kpi">
          <div className="label">Total Estudiantes<span className="icon">OK</span></div>
          <strong>47</strong>
          <span className="delta">Entre ambos grupos</span>
        </article>
        <article className="card kpi">
          <div className="label">Calificaciones Registradas<span className="icon">OK</span></div>
          <strong>{grades.length}</strong>
          <span className="delta">En el sistema actual</span>
        </article>
      </section>

      {/* Subjects section */}
      <section className="card section" style={{ marginBottom: '24px' }}>
        <div className="section-head">
          <h2>Materias bajo tu cargo (Encargada)</h2>
        </div>
        <div className="grid-2">
          {managedSubjects.map((sub, idx) => (
            <article key={idx} className="mini-panel" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span className="chip-icon" style={{ background: '#1d8fff' }}>{sub.code}</span>
                <h3 style={{ margin: 0, fontSize: '18px' }}>{sub.name}</h3>
              </div>
              <p className="muted" style={{ margin: '4px 0' }}>Grupo: <strong>{sub.group}</strong></p>
              <p className="muted" style={{ margin: '4px 0' }}>Alumnos inscritos: <strong>{sub.studentsCount} estudiantes</strong></p>
            </article>
          ))}
        </div>
      </section>

      <div className="grid-2">
        {/* Grades Table Section */}
        <section className="card section">
          <div className="section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <h2>Notas de Alumnos por Materia</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <small className="muted">Filtrar:</small>
              <select
                value={selectedFilterSubject}
                onChange={(e) => setSelectedFilterSubject(e.target.value)}
                style={{
                  background: '#17191f',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#f8fafc',
                  padding: '4px 8px',
                  outline: 'none'
                }}
              >
                <option value="Todos">Todas las materias</option>
                <option value="Ciencias">Ciencias</option>
                <option value="Laboratorio de Quimica">Laboratorio de Quimica</option>
              </select>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Alumno</th>
                <th>Materia</th>
                <th>Actividad</th>
                <th>Calificacion</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrades.map((g) => (
                <tr key={g.id}>
                  <td>{g.student}</td>
                  <td><span className="badge" style={{ background: 'rgba(29, 143, 255, 0.15)', color: '#1d8fff' }}>{g.subject}</span></td>
                  <td>{g.activity}</td>
                  <td><strong>{g.score.toFixed(1)}</strong></td>
                </tr>
              ))}
              {filteredGrades.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: '#98a2b3', padding: '20px' }}>
                    No hay calificaciones registradas para esta materia.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Form to Add Grades */}
        <section className="card section">
          <div className="section-head">
            <h2>Registrar Nueva Calificacion</h2>
          </div>
          {message && (
            <div className={`toast ${message.type}`} style={{ position: 'static', margin: '0 0 16px 0', width: '100%' }}>
              <div>
                <strong>{message.type === 'success' ? 'Exito' : 'Error'}</strong>
                <span>{message.text}</span>
              </div>
            </div>
          )}
          <form onSubmit={handleAddGrade} className="login-form" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="field">
              <label>
                Nombre del Estudiante
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="Ej. Carlos Mejia"
                  required
                  style={{ background: '#17191f', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </label>
            </div>
            
            <div className="field">
              <label>
                Materia
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  style={{
                    background: '#17191f',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    minHeight: '48px',
                    padding: '0 14px',
                    color: '#f8fafc',
                    width: '100%',
                    outline: 'none'
                  }}
                >
                  {managedSubjects.map((sub, idx) => (
                    <option key={idx} value={sub.name}>{sub.name} ({sub.group})</option>
                  ))}
                  {/* Test de validación: Opción con materia no asignada para probar el bloqueo */}
                  <option value="Matematicas">Matematicas (NO asignada - Bloqueo)</option>
                </select>
              </label>
            </div>

            <div className="field">
              <label>
                Actividad Evaluada
                <input
                  type="text"
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  placeholder="Ej. Tarea 3: Fotosintesis"
                  required
                  style={{ background: '#17191f', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </label>
            </div>

            <div className="field">
              <label>
                Calificacion (0.0 - 10.0)
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  placeholder="Ej. 9.5"
                  required
                  style={{ background: '#17191f', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </label>
            </div>

            <button type="submit" className="primary" style={{ marginTop: '10px' }}>
              Registrar Calificacion
            </button>
          </form>
        </section>
      </div>

      {/* Reminders / Announcements Section (NEW) */}
      <section className="card section" style={{ marginTop: '24px' }}>
        <div className="section-head">
          <h2>Muro de Recordatorios y Anuncios para Alumnos</h2>
          <p className="muted">Publica anuncios que tus alumnos verán de forma inmediata en tipo tarjetas en sus portales.</p>
        </div>
        
        <div className="grid-2">
          {/* Form to publish reminder */}
          <div style={{ padding: '8px' }}>
            <h3 style={{ marginTop: 0 }}>Publicar Nuevo Anuncio</h3>
            {reminderMessage && (
              <div className={`toast ${reminderMessage.type}`} style={{ position: 'static', margin: '0 0 16px 0', width: '100%' }}>
                <div>
                  <strong>{reminderMessage.type === 'success' ? 'Exito' : 'Error'}</strong>
                  <span>{reminderMessage.text}</span>
                </div>
              </div>
            )}
            <form onSubmit={handleAddReminder} className="login-form" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="field">
                <label>
                  Titulo del Anuncio
                  <input
                    type="text"
                    value={reminderTitle}
                    onChange={(e) => setReminderTitle(e.target.value)}
                    placeholder="Ej. Examen Parcial de Ciencias"
                    required
                    style={{ background: '#17191f', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </label>
              </div>

              <div className="field">
                <label>
                  Materia asociada
                  <select
                    value={reminderSubject}
                    onChange={(e) => setReminderSubject(e.target.value)}
                    style={{
                      background: '#17191f',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      minHeight: '48px',
                      padding: '0 14px',
                      color: '#f8fafc',
                      width: '100%',
                      outline: 'none'
                    }}
                  >
                    {managedSubjects.map((sub, idx) => (
                      <option key={idx} value={sub.name}>{sub.name}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="field">
                <label>
                  Fecha del Evento / Entrega
                  <input
                    type="date"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    required
                    style={{ background: '#17191f', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc' }}
                  />
                </label>
              </div>

              <div className="field">
                <label>
                  Detalles del Anuncio
                  <textarea
                    value={reminderDesc}
                    onChange={(e) => setReminderDesc(e.target.value)}
                    placeholder="Escribe las indicaciones o recordatorio..."
                    required
                    rows="3"
                    style={{
                      background: '#17191f',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: '#f8fafc',
                      width: '100%',
                      fontFamily: 'inherit',
                      outline: 'none'
                    }}
                  />
                </label>
              </div>

              <button type="submit" className="primary" style={{ marginTop: '8px' }}>
                Publicar Anuncio en Muro
              </button>
            </form>
          </div>

          {/* List of active reminders */}
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', paddingLeft: '24px' }}>
            <h3 style={{ marginTop: 0 }}>Anuncios Activos en el Muro</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto', paddingRight: '8px' }}>
              {reminders.map((rem) => (
                <article key={rem.id} className="mini-panel" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '16px', color: '#1d8fff' }}>{rem.title}</h4>
                    <span className="badge" style={{ fontSize: '11px', background: 'rgba(255,255,255,0.05)', color: '#98a2b3' }}>{rem.date}</span>
                  </div>
                  <p className="lead" style={{ fontSize: '13px', margin: '4px 0 10px 0', lineHeight: '1.4' }}>{rem.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#667085' }}>
                    <span>Materia: <strong>{rem.subject}</strong></span>
                    <span>Por: {rem.createdBy}</span>
                  </div>
                </article>
              ))}
              {reminders.length === 0 && (
                <p className="muted" style={{ textAlign: 'center', padding: '40px 0' }}>No has publicado anuncios en el muro aún.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
