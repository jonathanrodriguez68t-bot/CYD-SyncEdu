import { getDbConnection } from '../db';

/**
 * Servicio de Materias (Subjects Service)
 * 
 * Gestiona la carga de materias asignadas a profesores.
 */

const mockSubjectsDb = [
  { code: 'CI', name: 'Ciencias', group: '6to Grado B', studentsCount: 22 },
  { code: 'LQ', name: 'Laboratorio de Quimica', group: '7mo Grado A', studentsCount: 25 },
  { code: 'CN', name: 'Consejeria', group: '6to Grado B', studentsCount: 22 }
];

export async function fetchSubjectsByTeacher(teacherId) {
  // --- INTEGRACIÓN BASE DE DATOS ---
  // const db = await getDbConnection();
  // const sql = 'SELECT * FROM SUBJECTS WHERE teacher_id = ?';
  // return await db.query(sql, [teacherId]);

  return [...mockSubjectsDb];
}
