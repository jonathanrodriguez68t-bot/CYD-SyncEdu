'use client';

import React, { useState, useEffect } from 'react';
import { fetchStudents, createStudent, fetchTeachers, createTeacher } from '../../../lib/services/usersService';
import { fetchAllSubjects, createSubject } from '../../../lib/services/subjectsService';
import { fetchAuditLogs } from '../../../lib/services/auditService';

export default function AdminDashboardPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('students'); // 'students', 'teachers', 'subjects', 'audit'

  // Lists state
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Student Form State
  const [studentCarnet, setStudentCarnet] = useState('');
  const [studentPin, setStudentPin] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentGrade, setStudentGrade] = useState('6to Grado B');
  const [studentStatus, setStudentStatus] = useState('Activo');

  // Teacher Form State
  const [teacherCode, setTeacherCode] = useState('');
  const [teacherPin, setTeacherPin] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [teacherSpecialty, setTeacherSpecialty] = useState('');
  const [teacherGrados, setTeacherGrados] = useState('');
  const [teacherEstado, setTeacherEstado] = useState('Activo');

  // Subject Form State
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [subjectGroup, setSubjectGroup] = useState('');
  const [subjectStudents, setSubjectStudents] = useState('22');
  const [subjectTeacher, setSubjectTeacher] = useState('profesor');

  // Status message
  const [message, setMessage] = useState(null);

  const loadData = async () => {
    const stList = await fetchStudents();
    setStudents(stList);
    
    const tchList = await fetchTeachers();
    setTeachers(tchList);

    const sbList = await fetchAllSubjects();
    setSubjects(sbList);

    const logList = await fetchAuditLogs();
    setAuditLogs(logList);
  };

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
    loadData();
  }, []);

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    if (!studentCarnet || !studentPin || !studentName) {
      setMessage({ type: 'error', text: 'Completa todos los campos obligatorios del estudiante.' });
      return;
    }

    try {
      await createStudent({
        carnet: studentCarnet,
        pin: studentPin,
        name: studentName,
        grade: studentGrade,
        status: studentStatus
      });

      setMessage({ type: 'success', text: `Estudiante ${studentName} creado con Carnet: ${studentCarnet.toLowerCase()}` });
      setStudentCarnet('');
      setStudentPin('');
      setStudentName('');
      await loadData();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
    setTimeout(() => setMessage(null), 4000);
  };

  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    if (!teacherCode || !teacherPin || !teacherName || !teacherSpecialty) {
      setMessage({ type: 'error', text: 'Completa todos los campos obligatorios del profesor.' });
      return;
    }

    try {
      await createTeacher({
        codigo: teacherCode,
        pin: teacherPin,
        name: teacherName,
        especialidad: teacherSpecialty,
        grados: teacherGrados,
        estado: teacherEstado
      });

      setMessage({ type: 'success', text: `Docente ${teacherName} creado con Codigo: ${teacherCode.toLowerCase()}` });
      setTeacherCode('');
      setTeacherPin('');
      setTeacherName('');
      setTeacherSpecialty('');
      setTeacherGrados('');
      await loadData();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
    setTimeout(() => setMessage(null), 4000);
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    if (!subjectCode || !subjectName || !subjectGroup) {
      setMessage({ type: 'error', text: 'Completa todos los campos obligatorios de la materia.' });
      return;
    }

    try {
      await createSubject({
        code: subjectCode,
        name: subjectName,
        group: subjectGroup,
        studentsCount: subjectStudents,
        teacherCode: subjectTeacher
      });

      setMessage({ type: 'success', text: `Asignatura ${subjectName} creada y asignada exitosamente.` });
      setSubjectCode('');
      setSubjectName('');
      setSubjectGroup('');
      await loadData();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div style={{ padding: '24px' }}>
      <section className="hero" style={{ marginBottom: '24px' }}>
        <div>
          <h1>Panel de Administracion General</h1>
          <p className="lead">Bienvenido, {currentUser?.name || 'Administrador'}. Administra las cuentas, materias, asigna docentes y revisa la bitacora de auditoria del sistema.</p>
        </div>
      </section>

      {/* Navigation tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', marginBottom: '24px' }}>
        <button className={activeTab === 'students' ? 'primary' : 'secondary'} onClick={() => setActiveTab('students')}>
          Gestión Estudiantes
        </button>
        <button className={activeTab === 'teachers' ? 'primary' : 'secondary'} onClick={() => setActiveTab('teachers')}>
          Gestión Profesores
        </button>
        <button className={activeTab === 'subjects' ? 'primary' : 'secondary'} onClick={() => setActiveTab('subjects')}>
          Gestión Materias
        </button>
        <button className={activeTab === 'audit' ? 'primary' : 'secondary'} onClick={() => setActiveTab('audit')}>
          Bitácora Auditoría
        </button>
      </div>

      {message && (
        <div className={`toast ${message.type}`} style={{ position: 'static', margin: '0 0 24px 0', width: '100%' }}>
          <div>
            <strong>{message.type === 'success' ? 'Éxito' : 'Error'}</strong>
            <span>{message.text}</span>
          </div>
        </div>
      )}

      {/* Tab content: STUDENTS */}
      {activeTab === 'students' && (
        <div className="grid-2">
          {/* Table */}
          <section className="card section">
            <h2>Expedientes de Estudiantes</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Expediente</th>
                  <th>Estudiante</th>
                  <th>Carnet (User)</th>
                  <th>PIN (Pass)</th>
                  <th>Grado</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st) => (
                  <tr key={st.carnet}>
                    <td><span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: '#cfd4dc' }}>{st.expediente}</span></td>
                    <td><strong>{st.name}</strong></td>
                    <td><code>{st.carnet}</code></td>
                    <td><code>{st.pin}</code></td>
                    <td>{st.label.replace('Estudiante - ', '')}</td>
                    <td>
                      <span className="badge" style={{
                        background: st.status === 'Activo' ? 'rgba(18, 183, 106, 0.15)' : 'rgba(255,255,255,0.05)',
                        color: st.status === 'Activo' ? '#12b76a' : '#98a2b3'
                      }}>
                        {st.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Form */}
          <section className="card section">
            <h2>Registrar Nuevo Alumno</h2>
            <form onSubmit={handleCreateStudent} className="login-form" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="field">
                <label>
                  Nombre Completo
                  <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Ej. Maria Fernanda Lopez" required style={{ background: '#17191f', border: '1px solid rgba(255,255,255,0.1)' }} />
                </label>
              </div>
              <div className="field">
                <label>
                  Carnet / Username
                  <input type="text" value={studentCarnet} onChange={(e) => setStudentCarnet(e.target.value)} placeholder="Ej. estudiante o est004" required style={{ background: '#17191f', border: '1px solid rgba(255,255,255,0.1)' }} />
                </label>
              </div>
              <div className="field">
                <label>
                  PIN de Acceso
                  <input type="password" value={studentPin} onChange={(e) => setStudentPin(e.target.value)} placeholder="Ej. 1234" required style={{ background: '#17191f', border: '1px solid rgba(255,255,255,0.1)' }} />
                </label>
              </div>
              <div className="field">
                <label>
                  Grado y Sección
                  <input type="text" value={studentGrade} onChange={(e) => setStudentGrade(e.target.value)} placeholder="Ej. 6to Grado B" required style={{ background: '#17191f', border: '1px solid rgba(255,255,255,0.1)' }} />
                </label>
              </div>
              <div className="field">
                <label>
                  Estado
                  <select value={studentStatus} onChange={(e) => setStudentStatus(e.target.value)} style={{ background: '#17191f', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc', padding: '10px 14px', borderRadius: '8px', minHeight: '48px' }}>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </label>
              </div>
              <button type="submit" className="primary" style={{ marginTop: '8px' }}>Emitir Carnet y Crear Estudiante</button>
            </form>
          </section>
        </div>
      )}

      {/* Tab content: TEACHERS */}
      {activeTab === 'teachers' && (
        <div className="grid-2">
          {/* Table */}
          <section className="card section">
            <h2>Directorio de Profesores</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Código (User)</th>
                  <th>Profesor</th>
                  <th>Especialidad</th>
                  <th>Grados a Cargo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((tch) => (
                  <tr key={tch.codigo}>
                    <td><code>{tch.codigo}</code></td>
                    <td><strong>{tch.name}</strong></td>
                    <td><span className="badge" style={{ background: 'rgba(29, 143, 255, 0.15)', color: '#1d8fff' }}>{tch.especialidad}</span></td>
                    <td><small>{tch.grados}</small></td>
                    <td>
                      <span className="badge" style={{
                        background: tch.estado === 'Activo' ? 'rgba(18, 183, 106, 0.15)' : 'rgba(255,255,255,0.05)',
                        color: tch.estado === 'Activo' ? '#12b76a' : '#98a2b3'
                      }}>
                        {tch.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Form */}
          <section className="card section">
            <h2>Registrar Nuevo Docente</h2>
            <form onSubmit={handleCreateTeacher} className="login-form" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="field">
                <label>
                  Nombre del Profesor
                  <input type="text" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} placeholder="Ej. Karen Rivas" required style={{ background: '#17191f', border: '1px solid rgba(255,255,255,0.1)' }} />
                </label>
              </div>
              <div className="field">
                <label>
                  Código / Username
                  <input type="text" value={teacherCode} onChange={(e) => setTeacherCode(e.target.value)} placeholder="Ej. profesor o doc003" required style={{ background: '#17191f', border: '1px solid rgba(255,255,255,0.1)' }} />
                </label>
              </div>
              <div className="field">
                <label>
                  PIN de Acceso
                  <input type="password" value={teacherPin} onChange={(e) => setTeacherPin(e.target.value)} placeholder="Ej. 1234" required style={{ background: '#17191f', border: '1px solid rgba(255,255,255,0.1)' }} />
                </label>
              </div>
              <div className="field">
                <label>
                  Especialidad Académica
                  <input type="text" value={teacherSpecialty} onChange={(e) => setTeacherSpecialty(e.target.value)} placeholder="Ej. Ciencias Naturales o Matematicas" required style={{ background: '#17191f', border: '1px solid rgba(255,255,255,0.1)' }} />
                </label>
              </div>
              <div className="field">
                <label>
                  Grados asignados
                  <input type="text" value={teacherGrados} onChange={(e) => setTeacherGrados(e.target.value)} placeholder="Ej. 6to B, 7mo A" style={{ background: '#17191f', border: '1px solid rgba(255,255,255,0.1)' }} />
                </label>
              </div>
              <div className="field">
                <label>
                  Estado
                  <select value={teacherEstado} onChange={(e) => setTeacherEstado(e.target.value)} style={{ background: '#17191f', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc', padding: '10px 14px', borderRadius: '8px', minHeight: '48px' }}>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </label>
              </div>
              <button type="submit" className="primary" style={{ marginTop: '8px' }}>Crear Cuenta de Docente</button>
            </form>
          </section>
        </div>
      )}

      {/* Tab content: SUBJECTS */}
      {activeTab === 'subjects' && (
        <div className="grid-2">
          {/* Table */}
          <section className="card section">
            <h2>Asignaturas y Cursos</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Asignatura</th>
                  <th>Grado/Sección</th>
                  <th>Estudiantes</th>
                  <th>Profesor Encargado</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((sub) => (
                  <tr key={sub.code}>
                    <td><span className="badge" style={{ background: 'rgba(29, 143, 255, 0.15)', color: '#1d8fff' }}>{sub.code}</span></td>
                    <td><strong>{sub.name}</strong></td>
                    <td>{sub.group}</td>
                    <td>{sub.studentsCount} alumnos</td>
                    <td><code>{sub.teacherCode}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Form */}
          <section className="card section">
            <h2>Crear Nueva Asignatura (Grado / Seccion)</h2>
            <form onSubmit={handleCreateSubject} className="login-form" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="field">
                <label>
                  Código de Materia
                  <input type="text" value={subjectCode} onChange={(e) => setSubjectCode(e.target.value)} placeholder="Ej. MA o CI" required style={{ background: '#17191f', border: '1px solid rgba(255,255,255,0.1)' }} />
                </label>
              </div>
              <div className="field">
                <label>
                  Nombre de Asignatura
                  <input type="text" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} placeholder="Ej. Matematicas" required style={{ background: '#17191f', border: '1px solid rgba(255,255,255,0.1)' }} />
                </label>
              </div>
              <div className="field">
                <label>
                  Grado y Sección (Grupo)
                  <input type="text" value={subjectGroup} onChange={(e) => setSubjectGroup(e.target.value)} placeholder="Ej. 6to Grado B" required style={{ background: '#17191f', border: '1px solid rgba(255,255,255,0.1)' }} />
                </label>
              </div>
              <div className="field">
                <label>
                  Cantidad Alumnos
                  <input type="number" value={subjectStudents} onChange={(e) => setSubjectStudents(e.target.value)} required style={{ background: '#17191f', border: '1px solid rgba(255,255,255,0.1)' }} />
                </label>
              </div>
              <div className="field">
                <label>
                  Asignar a Docente (Username/Codigo)
                  <select value={subjectTeacher} onChange={(e) => setSubjectTeacher(e.target.value)} style={{ background: '#17191f', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc', padding: '10px 14px', borderRadius: '8px', minHeight: '48px' }}>
                    {teachers.map((tch) => (
                      <option key={tch.codigo} value={tch.codigo}>{tch.name} ({tch.codigo})</option>
                    ))}
                  </select>
                </label>
              </div>
              <button type="submit" className="primary" style={{ marginTop: '8px' }}>Crear Asignatura y Asignar Docente</button>
            </form>
          </section>
        </div>
      )}

      {/* Tab content: AUDIT LOG */}
      {activeTab === 'audit' && (
        <section className="card section" style={{ width: '100%' }}>
          <div className="section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2>Bitácora de Auditoría Académica</h2>
              <p className="muted">Monitoreo de auditoría y registros de acciones ejecutadas por maestros, estudiantes y administradores.</p>
            </div>
            <button className="secondary" onClick={async () => {
              const logList = await fetchAuditLogs();
              setAuditLogs(logList);
            }}>
              Actualizar Bitácora
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
            <thead>
              <tr>
                <th>Fecha y Hora</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Acción Realizada</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td><small className="muted">{new Date(log.timestamp).toLocaleString()}</small></td>
                  <td><strong>{log.user}</strong></td>
                  <td>
                    <span className="badge" style={{
                      background: log.role === 'admin' ? 'rgba(240,68,56,0.15)' : log.role === 'teacher' ? 'rgba(29, 143, 255, 0.15)' : 'rgba(18, 183, 106, 0.15)',
                      color: log.role === 'admin' ? '#f04456' : log.role === 'teacher' ? '#1d8fff' : '#12b76a'
                    }}>
                      {log.role}
                    </span>
                  </td>
                  <td><code>{log.action}</code></td>
                </tr>
              ))}
              {auditLogs.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: '#98a2b3', padding: '20px' }}>
                    No hay registros de auditoría almacenados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
