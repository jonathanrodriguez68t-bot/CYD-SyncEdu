'use client';

import React, { useState, useEffect } from 'react';
import { fetchSubjectsByTeacher } from '../../../lib/services/subjectsService';
import { fetchAllGrades, createGradeRecord } from '../../../lib/services/gradesService';

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

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      
      const loadInitialData = async () => {
        const teacherSubjects = await fetchSubjectsByTeacher(user.username);
        setManagedSubjects(teacherSubjects);
        
        const allGrades = await fetchAllGrades(selectedFilterSubject);
        setGrades(allGrades);
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

    const newRecord = await createGradeRecord({
      student: newStudentName.trim(),
      subject: newSubject,
      activity: newActivity.trim(),
      score: scoreNum
    });

    setGrades((prev) => [newRecord, ...prev]);
    setNewStudentName('');
    setNewActivity('');
    setNewScore('');
    setMessage({ type: 'success', text: 'Calificacion agregada correctamente.' });

    setTimeout(() => setMessage(null), 3000);
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
                  <option value="Ciencias">Ciencias</option>
                  <option value="Laboratorio de Quimica">Laboratorio de Quimica</option>
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
    </div>
  );
}
