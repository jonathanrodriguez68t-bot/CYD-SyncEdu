import { getDbConnection } from '../db';

/**
 * Servicio de Recordatorios y Anuncios (Reminders Service)
 * 
 * Gestiona los anuncios que los profesores publican para los estudiantes.
 */

// Mock de base de datos en memoria para los recordatorios
let mockRemindersDb = [
  {
    id: 1,
    title: 'Exposicion Final de Ciencias',
    description: 'Recuerden llevar su cartulina y prototipo de sostenibilidad. Aula 4.',
    date: '2026-07-07',
    subject: 'Ciencias',
    createdBy: 'Karen Rivas'
  },
  {
    id: 2,
    title: 'Entrega de Informe de Reacciones',
    description: 'Subir el PDF con los resultados del laboratorio de reacciones quimicas.',
    date: '2026-07-09',
    subject: 'Laboratorio de Quimica',
    createdBy: 'Karen Rivas'
  }
];

if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('mockRemindersDb');
  if (stored) {
    mockRemindersDb = JSON.parse(stored);
  } else {
    localStorage.setItem('mockRemindersDb', JSON.stringify(mockRemindersDb));
  }
}

export async function fetchReminders(subjectFilter = 'Todos') {
  // --- INTEGRACIÓN BASE DE DATOS ---
  // const db = await getDbConnection();
  // if (subjectFilter === 'Todos') {
  //   return await db.query('SELECT * FROM REMINDERS ORDER BY date ASC');
  // } else {
  //   return await db.query('SELECT * FROM REMINDERS WHERE subject = ? ORDER BY date ASC', [subjectFilter]);
  // }

  if (subjectFilter === 'Todos') {
    return [...mockRemindersDb];
  }
  return mockRemindersDb.filter(r => r.subject === subjectFilter);
}

export async function createReminder(reminderData) {
  // --- INTEGRACIÓN BASE DE DATOS ---
  // const db = await getDbConnection();
  // const sql = 'INSERT INTO REMINDERS (title, description, date, subject, created_by) VALUES (?, ?, ?, ?, ?)';
  // const result = await db.query(sql, [reminderData.title, reminderData.description, reminderData.date, reminderData.subject, reminderData.createdBy]);
  // return { id: result.insertId, ...reminderData };

  const newReminder = {
    id: Date.now(),
    title: reminderData.title,
    description: reminderData.description,
    date: reminderData.date,
    subject: reminderData.subject,
    createdBy: reminderData.createdBy || 'Sistema'
  };

  mockRemindersDb = [newReminder, ...mockRemindersDb];
  if (typeof window !== 'undefined') {
    localStorage.setItem('mockRemindersDb', JSON.stringify(mockRemindersDb));
  }
  return newReminder;
}
