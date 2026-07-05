import { getDbConnection } from '../db';
import { fetchSubjectsByTeacher } from './subjectsService';
import { logAction } from './auditService';

/**
 * Servicio de Calificaciones (Grades Service)
 * 
 * Gestiona el registro de notas, validacion de permisos docentes y analitica estudiantil.
 */

// Mock de base de datos de calificaciones
let mockGradesDb = [
  { id: 1, student: 'Maria Fernanda Lopez', studentCarnet: 'estudiante', subject: 'Ciencias', activity: 'Laboratorio de Quimica', score: 8.5, teacherCode: 'profesor' },
  { id: 2, student: 'Carlos Mejia', studentCarnet: 'est002', subject: 'Ciencias', activity: 'Laboratorio de Quimica', score: 9.0, teacherCode: 'profesor' },
  { id: 3, student: 'Ana Martinez', studentCarnet: 'est003', subject: 'Ciencias', activity: 'Laboratorio de Quimica', score: 7.5, teacherCode: 'profesor' },
  { id: 4, student: 'Maria Fernanda Lopez', studentCarnet: 'estudiante', subject: 'Laboratorio de Quimica', activity: 'Informe de Reacciones', score: 9.2, teacherCode: 'profesor' },
  { id: 5, student: 'Carlos Mejia', studentCarnet: 'est002', subject: 'Laboratorio de Quimica', activity: 'Informe de Reacciones', score: 8.0, teacherCode: 'profesor' },
  { id: 6, student: 'Ana Martinez', studentCarnet: 'est003', subject: 'Laboratorio de Quimica', activity: 'Informe de Reacciones', score: 8.8, teacherCode: 'profesor' },
  { id: 7, student: 'Maria Fernanda Lopez', studentCarnet: 'estudiante', subject: 'Matematicas', activity: 'Examen Unidad 2', score: 6.0, teacherCode: 'doc002' },
  { id: 8, student: 'Carlos Mejia', studentCarnet: 'est002', subject: 'Matematicas', activity: 'Examen Unidad 2', score: 8.2, teacherCode: 'doc002' }
];

if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('mockGradesDb');
  if (stored) {
    mockGradesDb = JSON.parse(stored);
  } else {
    localStorage.setItem('mockGradesDb', JSON.stringify(mockGradesDb));
  }
}

export async function fetchAllGrades(subjectFilter = 'Todos') {
  if (subjectFilter === 'Todos') {
    return [...mockGradesDb];
  }
  return mockGradesDb.filter(g => g.subject === subjectFilter);
}

export async function fetchGradesByStudent(studentCarnet) {
  const cleanCarnet = studentCarnet.trim().toLowerCase();
  return mockGradesDb.filter(g => g.studentCarnet.toLowerCase() === cleanCarnet);
}

export async function createGradeRecord(gradeData, teacherCode) {
  const cleanTeacherCode = teacherCode.trim().toLowerCase();
  
  // VALIDACIÓN: Verificar que el profesor tiene la materia asignada
  const teacherSubjects = await fetchSubjectsByTeacher(cleanTeacherCode);
  const isAssigned = teacherSubjects.some(s => s.name.toLowerCase() === gradeData.subject.toLowerCase());
  
  if (!isAssigned) {
    const errorMsg = `Acceso denegado: El profesor "${teacherCode}" no puede calificar la materia "${gradeData.subject}" porque no la tiene asignada.`;
    await logAction(teacherCode, 'teacher', `FALLIDO: Intento de calificar materia no asignada (${gradeData.subject}).`);
    throw new Error(errorMsg);
  }

  const newRecord = {
    id: Date.now(),
    student: gradeData.student.trim(),
    studentCarnet: gradeData.studentCarnet ? gradeData.studentCarnet.trim().toLowerCase() : 'estudiante',
    subject: gradeData.subject.trim(),
    activity: gradeData.activity.trim(),
    score: parseFloat(gradeData.score),
    teacherCode: cleanTeacherCode
  };

  mockGradesDb.unshift(newRecord);
  if (typeof window !== 'undefined') {
    localStorage.setItem('mockGradesDb', JSON.stringify(mockGradesDb));
  }
  await logAction(teacherCode, 'teacher', `Cargo calificacion de ${newRecord.score} en ${newRecord.subject} para ${newRecord.student}.`);
  return newRecord;
}

// ANALÍTICA 1: Obtener la materia con la calificación más baja del estudiante
export async function getLowestGradeSubject(studentCarnet) {
  const studentGrades = await fetchGradesByStudent(studentCarnet);
  if (studentGrades.length === 0) {
    return null;
  }

  // Agrupar por materia y sacar promedio
  const subjectAverages = {};
  studentGrades.forEach(g => {
    if (!subjectAverages[g.subject]) {
      subjectAverages[g.subject] = { sum: 0, count: 0 };
    }
    subjectAverages[g.subject].sum += g.score;
    subjectAverages[g.subject].count += 1;
  });

  let lowestSubject = '';
  let lowestAvg = 11; // mayor que la nota maxima 10

  for (const sub in subjectAverages) {
    const avg = subjectAverages[sub].sum / subjectAverages[sub].count;
    if (avg < lowestAvg) {
      lowestAvg = avg;
      lowestSubject = sub;
    }
  }

  return {
    subject: lowestSubject,
    average: parseFloat(lowestAvg.toFixed(2))
  };
}

// ANALÍTICA 2: Obtener rendimiento grupal de una materia
export async function getGroupPerformance(subjectName) {
  const subjectGrades = mockGradesDb.filter(g => g.subject.toLowerCase() === subjectName.toLowerCase());
  if (subjectGrades.length === 0) {
    return null;
  }

  const totalSum = subjectGrades.reduce((sum, g) => sum + g.score, 0);
  const average = totalSum / subjectGrades.length;

  return {
    subject: subjectName,
    average: parseFloat(average.toFixed(2)),
    totalGradesCount: subjectGrades.length
  };
}
