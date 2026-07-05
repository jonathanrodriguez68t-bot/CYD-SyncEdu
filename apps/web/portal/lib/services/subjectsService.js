import { getDbConnection } from '../db';
import { logAction } from './auditService';

/**
 * Servicio de Materias (Subjects Service)
 * 
 * Gestiona la carga de materias asignadas y la creacion de nuevos cursos por el Admin.
 */

// Mock de materias en base de datos
let mockSubjectsDb = [
  { code: 'CI', name: 'Ciencias', group: '6to Grado B', studentsCount: 22, teacherCode: 'profesor' },
  { code: 'LQ', name: 'Laboratorio de Quimica', group: '7mo Grado A', studentsCount: 25, teacherCode: 'profesor' },
  { code: 'CN', name: 'Consejeria', group: '6to Grado B', studentsCount: 22, teacherCode: 'profesor' },
  { code: 'MA', name: 'Matematicas', group: '6to Grado B', studentsCount: 22, teacherCode: 'doc002' }
];

if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('mockSubjectsDb');
  if (stored) {
    mockSubjectsDb = JSON.parse(stored);
  } else {
    localStorage.setItem('mockSubjectsDb', JSON.stringify(mockSubjectsDb));
  }
}

export async function fetchAllSubjects() {
  // --- INTEGRACIÓN BASE DE DATOS ---
  // const db = await getDbConnection();
  // return await db.query('SELECT * FROM SUBJECTS');

  return [...mockSubjectsDb];
}

export async function fetchSubjectsByTeacher(teacherCode) {
  // --- INTEGRACIÓN BASE DE DATOS ---
  // const db = await getDbConnection();
  // const sql = 'SELECT * FROM SUBJECTS WHERE teacher_code = ?';
  // return await db.query(sql, [teacherCode]);

  const cleanCode = teacherCode.trim().toLowerCase();
  return mockSubjectsDb.filter(s => s.teacherCode.toLowerCase() === cleanCode);
}

export async function createSubject(subjectData) {
  // --- INTEGRACIÓN BASE DE DATOS ---
  // const db = await getDbConnection();
  // const sql = 'INSERT INTO SUBJECTS (code, name, group_name, students_count, teacher_code) VALUES (?, ?, ?, ?, ?)';
  // await db.query(sql, [subjectData.code, subjectData.name, subjectData.group, subjectData.studentsCount, subjectData.teacherCode]);

  const newSubject = {
    code: subjectData.code.trim().toUpperCase(),
    name: subjectData.name.trim(),
    group: subjectData.group.trim(),
    studentsCount: parseInt(subjectData.studentsCount) || 0,
    teacherCode: subjectData.teacherCode.trim().toLowerCase()
  };

  mockSubjectsDb.push(newSubject);
  if (typeof window !== 'undefined') {
    localStorage.setItem('mockSubjectsDb', JSON.stringify(mockSubjectsDb));
  }
  await logAction('Administrador', 'admin', `Creo una nueva asignatura: ${newSubject.name} (${newSubject.code}) para ${newSubject.group} asignada al profesor ${newSubject.teacherCode}.`);
  return newSubject;
}
