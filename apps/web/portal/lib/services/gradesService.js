import { getDbConnection } from '../db';

/**
 * Servicio de Calificaciones (Grades Service)
 * 
 * Capa de servicio encargada de las lecturas y escrituras de notas.
 * Aquí puedes implementar las consultas SQL reales o llamadas de ORM
 * reemplazando la base de datos simulada en memoria.
 */

// Mock de base de datos en memoria
let mockGradesDb = [
  { id: 1, student: 'Maria Fernanda Lopez', subject: 'Ciencias', activity: 'Laboratorio de Quimica', score: 8.5 },
  { id: 2, student: 'Carlos Mejia', subject: 'Ciencias', activity: 'Laboratorio de Quimica', score: 9.0 },
  { id: 3, student: 'Ana Martinez', subject: 'Ciencias', activity: 'Laboratorio de Quimica', score: 7.5 },
  { id: 4, student: 'Maria Fernanda Lopez', subject: 'Laboratorio de Quimica', activity: 'Informe de Reacciones', score: 9.2 },
  { id: 5, student: 'Carlos Mejia', subject: 'Laboratorio de Quimica', activity: 'Informe de Reacciones', score: 8.0 },
  { id: 6, student: 'Ana Martinez', subject: 'Laboratorio de Quimica', activity: 'Informe de Reacciones', score: 8.8 }
];

export async function fetchAllGrades(subjectFilter = 'Todos') {
  // --- INTEGRACIÓN BASE DE DATOS ---
  // const db = await getDbConnection();
  // if (subjectFilter === 'Todos') {
  //   return await db.query('SELECT * FROM GRADES ORDER BY created_at DESC');
  // } else {
  //   return await db.query('SELECT * FROM GRADES WHERE subject = ? ORDER BY created_at DESC', [subjectFilter]);
  // }
  
  if (subjectFilter === 'Todos') {
    return [...mockGradesDb];
  }
  return mockGradesDb.filter(g => g.subject === subjectFilter);
}

export async function createGradeRecord(gradeData) {
  // --- INTEGRACIÓN BASE DE DATOS ---
  // const db = await getDbConnection();
  // const sql = 'INSERT INTO GRADES (student_name, subject, activity_name, score, feedback) VALUES (?, ?, ?, ?, ?)';
  // const result = await db.query(sql, [gradeData.student, gradeData.subject, gradeData.activity, gradeData.score, gradeData.feedback]);
  // return { id: result.insertId, ...gradeData };

  const newRecord = {
    id: Date.now(),
    student: gradeData.student,
    subject: gradeData.subject,
    activity: gradeData.activity,
    score: parseFloat(gradeData.score)
  };

  mockGradesDb = [newRecord, ...mockGradesDb];
  return newRecord;
}
