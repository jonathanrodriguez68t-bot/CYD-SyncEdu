import { getDbConnection } from '../db';

/**
 * Servicio de Auditoria (Audit Service)
 * 
 * Registra y recupera las acciones criticas realizadas por los usuarios en el sistema.
 */

// Mock de logs de auditoria
let mockAuditLogsDb = [
  { id: 1, timestamp: '2026-07-05T01:30:00Z', user: 'Roberto Lopez', role: 'admin', action: 'Acceso al panel de control de administracion.' },
  { id: 2, timestamp: '2026-07-05T02:00:00Z', user: 'Karen Rivas', role: 'teacher', action: 'Consulta del libro de notas de Ciencias.' },
  { id: 3, timestamp: '2026-07-05T02:05:00Z', user: 'Karen Rivas', role: 'teacher', action: 'Registro de nota de Laboratorio de Quimica para Alumno Carlos Mejia.' }
];

export async function fetchAuditLogs() {
  // --- INTEGRACIÓN BASE DE DATOS ---
  // const db = await getDbConnection();
  // return await db.query('SELECT * FROM AUDIT_LOGS ORDER BY timestamp DESC');

  return [...mockAuditLogsDb];
}

export async function logAction(user, role, action) {
  // --- INTEGRACIÓN BASE DE DATOS ---
  // const db = await getDbConnection();
  // const sql = 'INSERT INTO AUDIT_LOGS (user, role, action, timestamp) VALUES (?, ?, ?, CURRENT_TIMESTAMP)';
  // await db.query(sql, [user, role, action]);

  const newLog = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    user,
    role,
    action
  };

  mockAuditLogsDb = [newLog, ...mockAuditLogsDb];
  return newLog;
}
